import { Pool } from 'pg';
import { config } from '../utils/config.js';

export const db = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.name,
    password: config.db.password,
    port: parseInt(config.db.port),
    max: parseInt(config.db.maxConnection),
    idleTimeoutMillis: parseInt(config.db.idleTimeout),
});
