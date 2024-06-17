import * as express from 'express';
import { User, comparePassword, getUserFromUsername } from '../models/user.model';
import { client } from '../redis_client';
import { createJWT } from '../models/jwt.model';

export async function loginController(req: express.Request, res: express.Response) {
    const { username, password } = req.body;

    try {
        const user: User | null = await getUserFromUsername(username, client);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = createJWT(user);
        return res.json({
            message: 'Login successful', 
            user: {
                id: user.id,
                username: user.username
            },
            token: token
        });
    }
    catch (error) {
        console.error('Error fetching user from Redis', error);
        return res.status(500).json({ message: 'Internal Server Error '});
    }
}