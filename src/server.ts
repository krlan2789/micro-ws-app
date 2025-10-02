import uWS from 'uWebSockets.js';
import websocket from './routes/websocket_handler.ts';
import type { IUserData } from './models/IUserData.ts';
import { config } from './utils/config.ts';

const port = config.port ?? 3000;

uWS.App().ws<IUserData>('/*', websocket).listen(port, (token) => {
    if (token) console.log('🚀 uWS.js + TypeScript running on port', port);
});
