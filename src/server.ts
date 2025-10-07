import uWS from 'uWebSockets.js';
import websocket from './routes/websocket_handler.js';
import type { IUserData } from './models/IUserData.js';
import { config } from './utils/config.js';

const port = config.port ?? 3000;

uWS.App().ws<IUserData>('/*', websocket).listen(port, (token) => {
    if (token) console.log('🚀 uWS.js + TypeScript running on port', port);
});
