import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Импортируем Link для переходов
import { domen } from '../config';
import './Home.css';

function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [posts, setPosts] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);

            try {
                const base64Url = token.split('.')[1];
                const decodedToken = JSON.parse(atob(base64Url));

                const userId = decodedToken.userId || decodedToken.sub || decodedToken.id;
                setCurrentUserId(userId);

                fetchPosts(token);
            } catch (error) {
                navigate('/login');
            }
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
                    <div>
                        <Link to="/create">
                            <button>Создать новый пост</button>
                        </Link>
                    </div>
                    <h3>Посты:</h3>
                    <ul>
                        {posts.map((post) => (
                            <li key={post.id}>
                                <div>
                                    {/* Проверяем, является ли mediaUrl видео */}
                                    {post.mediaUrl && post.mediaUrl.match(/\.(mp4|webm)$/) ? (
                                        <video width="400" controls>
                                            <source src={post.mediaUrl} type="video/mp4" />
                                            Ваш браузер не поддерживает видео.
                                        </video>
                                    ) : (
                                        post.mediaUrl && <img src={post.mediaUrl} alt="Post media" />
                                    )}
                                    <p>{post.content}</p>
                                    <p>Автор: <strong>{post.author.username}</strong></p>
                                    <p>{new Date(post.createdAt).toLocaleString()}</p>
                                    {currentUserId === post.author.id && (
                                        <div>
                                            <button onClick={() => navigate(`/edit/${post.id}`)}>Редактировать</button>
                                            <button onClick={() => handleDelete(post.id)}>Удалить</button>
                                        </div>
                                    )}
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
