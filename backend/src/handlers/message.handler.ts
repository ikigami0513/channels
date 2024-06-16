import { Server, Socket } from "socket.io";
import { Message, UserMessage } from "../models/message.model";
import { v4 as uuidv4 } from 'uuid';
import { client } from "../redis_client";

export function messageHandler (socket: Socket, io: Server, message: string) {
    const new_message: Message = {
        id: uuidv4(),
        user: socket.user as UserMessage,
        content: message,
        date: new Date()
    }
    client.hSet('messages', new_message.id, JSON.stringify(new_message));
    io.emit('message', new_message);
}