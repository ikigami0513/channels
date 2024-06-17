import { client } from "../redis_client";
import { UserSerializer } from "./user.model";

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