import { User } from "../models/user.model";

declare module "socket.io" {
    interface Socket {
        user: User | null;
    }
}
