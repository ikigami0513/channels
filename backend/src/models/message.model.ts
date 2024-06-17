import { client } from "../redis_client";
import { User, UserSerializer } from "./user.model";

export interface Message {
    id: string;
    user: UserSerializer;
    content: string;
    date: Date;
}

export async function getMessages(): Promise<Array<Message>> {
    const messages_data = await client.hGetAll('messages');
    const messages: Array<Message> = new Array<Message>();
    Object.keys(messages_data).forEach((key) => {
        const value = messages_data[key];
        const message: Message = JSON.parse(value);
        messages.push(message);
    });
    messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return messages;
}

export async function getMessagesFromUsers(users: Array<User>): Promise<Array<Message>> {
    const messages_data = await client.hGetAll('messages');
    const messages: Array<Message> = new Array<Message>();
    const user_ids = new Array<string>();
    users.map(user => user_ids.push(user.id))
    Object.keys(messages_data).forEach((key) => {
        const value = messages_data[key];
        const message: Message = JSON.parse(value);
        if (user_ids.includes(message.user.id)) {
            messages.push(message);
        }
    });
    messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return messages;
}