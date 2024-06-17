import * as bcrypt from 'bcryptjs';
import { RedisClientType } from 'redis';
import { client } from '../redis_client';

export interface User {
    id: string;
    username: string;
    password: string;
    avatar?: string | null;
}

export interface UserSerializer {
    id: string;
    username: string;
    avatar?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
    const saltRound = 10;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRound);
        return hashedPassword;
    }
    catch (error) {
        throw new Error('Error hashing password');
    }
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    }
    catch (error) {
        throw new Error('Error comparing password');
    }
}

export async function getUserFromUsername(username: string, client: RedisClientType): Promise<User | null> {
    const users_data = await client.hGetAll('users');
    let right_user: User | null = null;
    Object.keys(users_data).forEach((key) => {
        const value = users_data[key];
        const user: User = JSON.parse(value);
        if (user.username === username) {
            right_user = user;
        } 
    });
    return right_user;
}

export async function addUser(user: User): Promise<void> {
    await client.hSet('users', user.id, JSON.stringify(user));
}