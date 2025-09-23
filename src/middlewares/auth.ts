import { db } from '../persistences/db.ts';

export async function verifyToken(token: string): Promise<string | null> {
    const result = await db.query('SELECT token FROM tb_token WHERE token = $1', [token]);
    return Promise.resolve(result.rows[0]?.token || null);
}
