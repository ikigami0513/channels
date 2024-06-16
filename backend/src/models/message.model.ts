import { client } from "../redis_client";

export interface UserMessage {
    id: string;
    username: string;
}

export interface Message {
    id: string;
    user: UserMessage;
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
    return messages;
}