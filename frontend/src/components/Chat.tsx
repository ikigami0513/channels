import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import io, { Socket } from 'socket.io-client';
import { format } from 'date-fns';
import { User } from '../interfaces';

let socket: Socket | null = null;

interface UserMessage {
    id: string;
    username: string;
}

interface Message {
    id: string;
    user: UserMessage;
    content: string;
    date: Date;
}

type LoginProps = {
    user: User | null;
};

const Chat: React.FC<LoginProps> = ({ user }) => {
    const navigate = useNavigate();
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messages, setMessages] = useState<Array<Message>>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }

        if (user) {
            socket = io('http://127.0.0.1:4000', {
                auth: {
                    token: user.token
                }
            });
        }

        socket?.on('message', (message: Message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        socket?.on('get_messages', (messages: Array<Message>) => {
            setMessages(messages);
        });

        return () => {
            socket?.off('message');
        };
    }, [user, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentMessage(event.target.value);
    };

    const handleSubmitMessage = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        socket?.emit('message', currentMessage);
        setCurrentMessage('');
    };

    return (
        <div className='flex flex-col h-screen'>
            <div className='flex-grow overflow-y-auto p-4'>
                {messages.map((message) => (
                    <div key={message.id} className='p-2 bg-gray-700 rounded mb-2 text-white'>
                        <div>
                            <span className='text-xl'>{message.user.username}</span>
                            <span className='text-xs text-gray-300 pl-2'>{format(new Date(message.date), 'dd-MM-yyyy HH:mm:ss')}</span>
                        </div>
                        <div>{message.content}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmitMessage} className='p-4 bg-gray-900 flex items-center'>
                <input
                    type='text'
                    value={currentMessage}
                    onChange={handleInputChange}
                    className='w-full p-2 rounded bg-gray-800 text-white'
                    placeholder='Envoyer un message...'
                />
                <button type='submit'>
                    <PaperAirplaneIcon className='h-8 text-white ml-4' />
                </button>
            </form>
        </div>
    );
}

export default Chat;
