import { User } from "./user.model";
import * as jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config";

export interface UserJWTProps {
    id: string;
    username: string;
}

export function createJWT (user: User): string {
    return jwt.sign(user as UserJWTProps, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function getUserPropsFromJWT (token: string): UserJWTProps {
    return jwt.verify(token, JWT_SECRET) as UserJWTProps;
}