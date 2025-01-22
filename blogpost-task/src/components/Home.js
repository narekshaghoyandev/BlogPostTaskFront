import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { domen } from '../config'

function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            fetchPosts(token);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchPosts = async (token) => {
        const response = await fetch(`${domen}/posts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setPosts(data);
    };

    const handleDelete = async (postId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${domen}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            setPosts(posts.filter((post) => post.id !== postId));
        } else {
            alert('Ошибка при удалении поста');
        }
    };

    return (
        <div>
            <h2>Главная страница</h2>
            {isAuthenticated ? (
                <div>
                    <h3>Посты:</h3>
                    <ul>
                        {posts.map((post) => (
                            <li key={post.id}>
                                <div>
                                    <p>{post.content}</p>
                                    {post.mediaUrl && <img src={post.mediaUrl} alt="Post media" />}
                                    <p><strong>{post.author.username}</strong></p>
                                    <p>{new Date(post.createdAt).toLocaleString()}</p>
                                    <button onClick={() => navigate(`/edit/${post.id}`)}>Редактировать</button>
                                    <button onClick={() => handleDelete(post.id)}>Удалить</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Пожалуйста, войдите</p>
            )}
        </div>
    );
}

export default Home;
