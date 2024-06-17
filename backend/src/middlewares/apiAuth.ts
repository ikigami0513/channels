import * as express from 'express';
import { client } from '../redis_client';
import { User } from '../models/user.model';
import { UserJWTProps, getUserPropsFromJWT } from '../models/jwt.model';

export async function apiAuthMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Token non fourni'
        });
    }

    try {
        const decoded: UserJWTProps = getUserPropsFromJWT(token);
        const user_data = await client.hGet('users', decoded.id);

        if (!user_data) {
            return res.status(401).json({
                message: 'Authentication Error'
            });
        }
        
        const user: User = JSON.parse(user_data);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
}
