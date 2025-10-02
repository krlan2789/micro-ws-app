import uWS from 'uWebSockets.js';
import { verifyToken } from '../middlewares/auth.ts';
import { db } from '../persistences/db.ts';
import type { IUserData } from '../models/IUserData.ts';
import DateHelper from '../utils/date_helper.ts';
import { config } from '../utils/config.ts';

export class WebSocketHandler implements uWS.WebSocketBehavior<IUserData> {
    topicToSubcribe: string = 'broadcast';
    maxPayloadLength: number;
    idleTimeout: number;

    constructor() {
        this.maxPayloadLength = config.uws.maxPayloadLength;
        this.idleTimeout = config.uws.idleTimeout;
    }

    upgrade(res: uWS.HttpResponse, req: uWS.HttpRequest, context: any) {
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
        console.log('Token:', token);
        verifyToken(token)
            .then(token => {
                console.log('aborted:', aborted);
                if (aborted) return;
                console.log('UserToken:', token);
                if (typeof token === 'string' && token.length > 0) {
                    res.cork(() => res.upgrade<IUserData>(
                        { token },
                        wsKey,
                        wsProtocol,
                        wsExtensions,
                        context
                    ));
                } else {
                    res.cork(() => res.end('Invalid token'));
                }
            })
            .catch(e => {
                console.warn('Exception: ' + e.message);
                if (!aborted) res.cork(() => res.end('Exception: ' + e.message));
            });
    }

    open(ws: uWS.WebSocket<IUserData>) {
        ws.subscribe(this.topicToSubcribe);
    }

    message(ws: uWS.WebSocket<IUserData>, message: ArrayBuffer, isBinary: boolean) {
        const payload = Buffer.from(message).toString();
        const { token } = ws.getUserData();
        db.query('INSERT INTO websocket_log (token, message, date_created) VALUES ($1, $2, $3)', [token, payload, DateHelper.getCurrentDate()])
            .then(() => {
                try {
                    ws.publish(this.topicToSubcribe, JSON.stringify(payload));
                } catch (e) {
                    console.warn(e);
                }
            })
            .catch(e => {
                try {
                    db.query('INSERT INTO websocket_log (token, message, date_created) VALUES ($1, $2, $3)', [token, `${token}|${e}`, DateHelper.getCurrentDate()])
                        .then(() => ws.end(500, 'Insert failed'))
                        .catch(e => console.warn(e));
                } catch (e) {
                    console.warn(e);
                }
            });
    }

    close(ws: uWS.WebSocket<IUserData>, code: number, reason: ArrayBuffer) {
        ws.unsubscribe(this.topicToSubcribe);
    }
};

export default new WebSocketHandler();