import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Theme.css';
import '../styles/App.css';

const Todos = ({ logout }) => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetchTodos();
    }, []);

    const capitalizeAll = str =>
        str.replace(/\b\w/g, char => char.toUpperCase());

    const fetchTodos = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/todos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTodos(res.data);
            if (!res.data.length) return setLoading(false)

            setUser(capitalizeAll(res.data[0].username));
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                navigate('/login');
                return;
            }
            setError('Failed to fetch todos');
            setLoading(false);
        }
    };

    const addTodo = async () => {
        if (!title.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${BACKEND_URL}/api/todos`,
                { title }, { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos([...todos, res.data]);
            setTitle('');
        } catch (err) {
            setError('Failed to add todo');
        }
    };

    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BACKEND_URL}/api/todos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (err) {
            setError('Failed to delete todo');
        }
    };

    const toggleComplete = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                `${BACKEND_URL}/api/todos/${id}`,
                { completed: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos(todos.map(todo =>
                todo._id === id ? res.data : todo
            ));
        } catch (err) {
            setError('Failed to update todo');
        }
    };

    const startEditing = (todo) => {
        setEditingId(todo._id);
        setEditTitle(todo.title);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditTitle('');
    };

    const saveEdit = async (id) => {
        if (!editTitle.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                `${BACKEND_URL}/api/todos/${id}`,
                { title: editTitle },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos(todos.map(todo =>
                todo._id === id ? res.data : todo
            ));
            setEditingId(null);
            setEditTitle('');
        } catch (err) {
            setError('Failed to update todo');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="container">
            {error && <div className="error-message">{error}</div>}

            {user && <div className="username-div">{user}</div>}

            <div className="todo-form">
                <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                />
                <button className="btn btn-primary" onClick={addTodo}>Add</button>
            </div>

            <ul className="todo-list">
                {todos.length === 0 ? (
                    <li style={{ textAlign: 'center', padding: '20px', color: '#95a5a6' }}>
                        No todos yet. Add one above!
                    </li>
                ) : (
                    todos.map(todo => (
                        <li key={todo._id} className="todo-item">
                            <input
                                type="checkbox"
                                className="todo-checkbox"
                                checked={todo.completed}
                                onChange={() => toggleComplete(todo._id, todo.completed)}
                            />

                            {editingId === todo._id ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo._id)}
                                    autoFocus
                                />
                            ) : (
                                <span
                                    className={`todo-title ${todo.completed ? 'completed' : ''}`}
                                    onDoubleClick={() => startEditing(todo)}
                                >
                                    {todo.title}
                                </span>
                            )}

                            <div className="todo-actions">
                                {editingId === todo._id ? (
                                    <>
                                        <button
                                            className="btn btn-success"
                                            onClick={() => saveEdit(todo._id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={cancelEditing}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => startEditing(todo)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteTodo(todo._id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Todos;