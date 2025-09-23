import 'dotenv/config';
import type { IAppConfig } from '../models/IAppConfig';

function getEnv(key: string, fallback?: string): string {
    const value = process.env[key];
    if (value === undefined && fallback === undefined) {
        throw new Error(`Missing required env variable: ${key}`);
    }
    return value ?? fallback!;
}

export const config: IAppConfig = {
    port: parseInt(getEnv('APP_PORT', '3000')),
    db: {
        host: getEnv('DB_HOST', 'localhost'),
        user: getEnv('DB_USER', 'postgres'),
        name: getEnv('DB_NAME', ''),
        password: getEnv('DB_PASS', ''),
        port: getEnv('DB_PORT', '5432'),
        maxConnection: getEnv('DB_MAX_CONNECTION', '16'),
        idleTimeout: getEnv('DB_IDLE_TIMEOUT', '30000'),
    },
    uws: {
        maxPayloadLength: parseInt(getEnv('UWS_MAX_PAYLOAD_LENGTH', '1024')),
        idleTimeout: parseInt(getEnv('UWS_IDLE_TIMEOUT', '30')),
    },
};
