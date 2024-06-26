import * as express from 'express';
import { addUser, hashPassword } from '../models/user.model';
import { client } from '../redis_client';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user.model';
import { createJWT } from '../models/jwt.model';

export async function registerController(req: express.Request, res: express.Response) {
    const { username, password } = req.body;
    const user_exists = await client.hGet('users', username);

    if (user_exists) {
        return res.status(401).json({ message: 'Username already exists' });
    }

    const user: User = {
        id: uuidv4(),
        username: username,
        password: await hashPassword(password)
    };
    await addUser(user);
    const token = createJWT(user);
    return res.json({
        message: 'Register successful', 
        user: {
            id: user.id,
            username: user.username
        },
        token: token
    });
}