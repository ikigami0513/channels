import * as express from 'express';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const JWT_SECRET = '82bb2403316591bfdf67f5906f716821da217d7372edfed4219491b3e3b9a93b';
export const JWT_EXPIRES_IN = '8h';

const storage: multer.StorageEngine = multer.diskStorage({
    destination: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        let upload_path = 'uploads/'
        
        if (req.path.includes('/user/change_profile_picture')) {
            upload_path = 'uploads/user/profile_picture';
        }

        cb(null, upload_path);
    },
    filename: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, `${uuidv4()}-${file.originalname}`)
    }
});

export const upload = multer({ storage });