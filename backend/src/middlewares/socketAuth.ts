import { Socket } from "socket.io";
import { client } from "../redis_client";
import { User } from "../models/user.model";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export async function socketAuthMiddleware (socket: Socket, next: (err?: any) => void) {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication Error'));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; };
        const user_data = await client.hGet('users', decoded.id);

        if (!user_data) {
            return next(new Error('User not found'));
        }

        const user: User = JSON.parse(user_data);
        socket.user = user;
        next();
    } 
    catch (error) {
        console.error('Authentication error', error);
        next(new Error('Authentication error'));
    }
}