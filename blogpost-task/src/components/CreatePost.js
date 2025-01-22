import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { domen } from '../config'
import './CreatePost.css'
function CreatePost() {
    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const response = await fetch(`${domen}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, mediaUrl }),
        });

        if (response.ok) {
            navigate('/');
        } else {
            alert('Ошибка при создании поста');
        }
    };

    return (
        <div>
            <h2>Создание поста</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Напишите ваш пост"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <input
                    type="text"
                    placeholder="Ссылка на медиа"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                />
                <button type="submit">Опубликовать</button>
            </form>
        </div>
    );
}

export default CreatePost;
