import { DateHelper } from "../utils/date_helper.js";
import { db } from "./db.js";

export class Repository {
    static async getUserByUsername(username: string): Promise<any[]> {
        const result = await db.query('SELECT username FROM tb_users WHERE username = $1', [username]);
        return Promise.resolve(result.rows);
    }

    static async insertWsLog(token: string, message: string): Promise<void> {
        await db.query('INSERT INTO websocket_log (token, message, date_created) VALUES ($1, $2, $3)', [token, message, DateHelper.getCurrentDate()]);
    }

    static async insertErrorLog(username: string, log: string, deviceInfo: string): Promise<void> {
        await db.query(
            'INSERT INTO tb_error_log (username, log, device_info, location, created_at) VALUES ($1, $2, $3)',
            [
                username,
                log,
                deviceInfo,
                '',
                DateHelper.getCurrentDate()
            ])
    }
}