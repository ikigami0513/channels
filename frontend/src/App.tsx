import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import { User } from './interfaces';

function App() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        document.body.classList.add("bg-gray-800");
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Chat user={user} />}/>
                <Route path='/login' element={<Login setUser={setUser} />} />
                <Route path='/register' element={<Register setUser={setUser} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;