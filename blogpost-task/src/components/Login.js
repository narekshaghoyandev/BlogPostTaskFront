import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { domen } from '../config';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch(`${domen}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Сохраняем токен в localStorage
            navigate('/'); // Перенаправляем на главную страницу
        } else {
            alert('Неверные данные для входа');
        }
    };

    return (
        <div>
            <h2>Вход</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Войти</button>
            </form>
            <br></br>
            <button style={{ marginTop: '20px', marginLeft: '45%', width: 'fit-content' }} onClick={() => navigate('/register')}>Нету аккаунта?</button>
        </div>
    );
}

export default Login;
