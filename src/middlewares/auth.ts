import { Repository } from '../persistences/repository.js';

export async function verifyToken(token: string): Promise<string | null> {
    const result = await Repository.getUserByUsername(token);;
    return Promise.resolve(result[0]?.username || null);
}
