import { Server, Socket } from "socket.io";
import { getMessages } from "../models/message.model";
import { messageHandler } from "../handlers/message.handler";

export async function registerSocketEvents (socket: Socket, io: Server) {
    console.log(`${socket.user.username} s'est connecté.`);
    socket.emit('get_messages', await getMessages());

    socket.on('message', (message: string) => messageHandler(socket, io, message));
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
}