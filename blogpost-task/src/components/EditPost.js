import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { domen } from '../config'

function EditPost() {
    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${domen}/posts/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const post = await response.json();
            setContent(post.content);
            setMediaUrl(post.mediaUrl);
        };

        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const response = await fetch(`${domen}/posts/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, mediaUrl }),
        });

        if (response.ok) {
            navigate('/');
        } else {
            alert('Ошибка при редактировании поста');
        }
    };

    return (
        <div>
            <h2>Редактирование поста</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Редактировать ваш пост"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <input
                    type="text"
                    placeholder="Ссылка на медиа"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                />
                <button type="submit">Сохранить изменения</button>
            </form>
        </div>
    );
}

export default EditPost;
