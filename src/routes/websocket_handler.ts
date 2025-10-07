import uWS from 'uWebSockets.js';
import { verifyToken } from '../middlewares/auth.js';
import type { IUserData } from '../models/IUserData.js';
import { config } from '../utils/config.js';
import { ErrorHandler } from '../utils/error_handler.js';
import { Repository } from '../persistences/repository.js';
import type { IPayload } from '../models/IPayload.js';

export class WebSocketHandler implements uWS.WebSocketBehavior<IUserData> {
    topicToSubcribe: string = 'broadcast';
    maxPayloadLength: number;
    idleTimeout: number;

    constructor() {
        this.maxPayloadLength = config.uws.maxPayloadLength;
        this.idleTimeout = config.uws.idleTimeout;
    }

    generatePayload = (message?: string, payload?: any): string => {
        const basePayload: IPayload = {
            message: message ?? '',
            timestamp: new Date().toISOString(),
        };
        const extendedPayloadObj = typeof payload === 'string' ? JSON.parse(payload) : payload;
        console.log('Generated Payload:', extendedPayloadObj);
        return JSON.stringify({ ...basePayload, ...(typeof extendedPayloadObj == 'object' ? extendedPayloadObj : { content: payload }) });
    }

    upgrade = (res: uWS.HttpResponse, req: uWS.HttpRequest, context: any): void => {
        console.log('Upgrading connection...');
        let aborted = false;
        res.onAborted(() => {
            aborted = true;
        });
        const query = req.getQuery();
        const wsKey = req.getHeader('sec-websocket-key');
        const wsProtocol = req.getHeader('sec-websocket-protocol');
        const wsExtensions = req.getHeader('sec-websocket-extensions');
        const token = (new URLSearchParams(query).get('token') ?? '').trim();
        verifyToken(token)
            .then(token => {
                if (aborted) return;
                if (typeof token === 'string' && token.length > 0) {
                    console.log(`${token} is verified.`);
                    if (!aborted) res.cork(() => res.upgrade<IUserData>(
                        { token },
                        wsKey,
                        wsProtocol,
                        wsExtensions,
                        context
                    ));
                } else {
                    console.warn('Invalid token');
                    ErrorHandler.record('verify_token', 'WebSocket upgrade failed: Invalid token', new Error('Invalid token'));
                    if (!aborted) res.cork(() => res.end('Invalid token'));
                }
            })
            .catch(e => {
                console.warn('Exception: ' + e.message);
                ErrorHandler.record('verify_token', 'WebSocket upgrade exception', e);
                if (!aborted) res.cork(() => res.end('Exception: ' + e.message));
            });
    }

    open = (ws: uWS.WebSocket<IUserData>): void => {
        ws.subscribe(this.topicToSubcribe);
        ws.publish(this.topicToSubcribe, this.generatePayload(`User ${ws.getUserData().token} connected.`));
    }

    message = (ws: uWS.WebSocket<IUserData>, message: ArrayBuffer, isBinary: boolean): void => {
        const payload = Buffer.from(message).toString();
        const { token } = ws.getUserData();
        Repository.insertWsLog(token, payload)
            .then(() => {
                try {
                    ws.publish(this.topicToSubcribe, this.generatePayload(`Message broadcasted by ${token}.`, payload));
                } catch (e) {
                    console.warn(e);
                    ErrorHandler.record('message_publish', 'WebSocket publish exception', e);
                }
            })
            .catch(e => {
                try {
                    Repository.insertErrorLog(token, typeof e === 'object' ? JSON.stringify(e) : e, 'websocket_server')
                        .then(() => ws.end(500, 'Insert failed'))
                        .catch(e => {
                            console.warn(e);
                            ErrorHandler.record('database_insert', 'WebSocket error logging exception', e);
                        });
                } catch (e) {
                    console.warn(e);
                    ErrorHandler.record('database_insert', 'WebSocket message handling exception', e);
                }
            });
    }

    close = (ws: uWS.WebSocket<IUserData>, code: number, reason: ArrayBuffer): void => {
        try {
            const { token } = ws.getUserData();
            ws.publish(this.topicToSubcribe, this.generatePayload(`User ${token} disconnected. Code: ${code}, Reason: ${Buffer.from(reason).toString()}`));
            ws.unsubscribe(this.topicToSubcribe);
            ErrorHandler.record('connection_close', `WebSocket connection closed. Token: ${token}, Code: ${code}, Reason: ${Buffer.from(reason).toString()}`, new Error('Connection closed'));
        } catch (e) {
            console.warn(e);
            ErrorHandler.record('message_publish', 'WebSocket publish exception', e);
        }
    }
};

export default new WebSocketHandler();