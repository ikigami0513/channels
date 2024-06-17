import * as express from 'express';
import { UserSerializer } from '../models/user.model';
import { client } from '../redis_client';

export async function getUser(req: express.Request, res: express.Response) {
    return res.json(req.user as UserSerializer);
}

export async function changeUserProfilePicture(req: express.Request, res: express.Response) {
    if (!req.file) {
        return res.status(400).json({ 
            error: 'No file upload'
        });
    }

    req.user.avatar = req.file.filename;
    await client.hSet('users', req.user.id, JSON.stringify(req.user));
    res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename
    });
}