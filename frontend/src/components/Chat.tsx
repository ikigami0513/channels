import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import io, { Socket } from 'socket.io-client';
import { format } from 'date-fns';
import { User } from '../interfaces';
import { Cog8ToothIcon, MicrophoneIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';

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
        <div className='flex'>
            <div className='flex flex-col justify-end w-1/20 bg-slate-800'>

            </div>
            <div className='flex flex-col h-screen w-3/20 bg-slate-900'>
                <div className='h-19/20'></div>
                <div className='text-white bg-slate-950 h-1/20 flex items-center justify-between px-1'>
                    <div className='flex items-center space-x-4'>
                        <img src="https://via.placeholder.com/150" alt='default_picture' className='rounded-full h-12 w-12'/>
                        <span>{user?.username}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <MicrophoneIcon className='h-6 w-6 m-2' />
                        <SpeakerWaveIcon className='h-6 w-6 m-2' />
                        <Cog8ToothIcon className='h-6 w-6 m-2' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col h-screen w-13/20'>
                <div className='p-4 text-white text-lg'>Channel Name</div>
                <div className='flex-grow overflow-y-auto p-4'>
                    {messages.map((message) => (
                        <div key={message.id} className='p-2 rounded mb-2 text-white'>
                            <div className='flex space-x-4'>
                                <div>
                                    <img src="https://via.placeholder.com/150" alt='default_picture' className='rounded-full h-12 w-12'/> 
                                </div>
                                <div>
                                    <div>
                                        <span className='text-xl'>{message.user.username}</span>
                                        <span className='text-xs text-gray-300 pl-2'>{format(new Date(message.date), 'dd-MM-yyyy HH:mm:ss')}</span>
                                    </div>
                                    <div>{message.content}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmitMessage} className='p-4 flex items-center'>
                    <input
                        type='text'
                        value={currentMessage}
                        onChange={handleInputChange}
                        className='w-full p-4 rounded bg-gray-900 text-white'
                        placeholder='Envoyer un message...'
                    />
                </form>
            </div>
            <div className='w-3/20 bg-slate-900'></div>
        </div>
    );
}

export default Chat;
