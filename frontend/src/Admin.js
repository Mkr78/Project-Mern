import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Admin = ({ onLogout }) => {
    const [newArticle, setNewArticle] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewArticle({ ...newArticle, [name]: value });
    };

    const handleAddArticle = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/articles', newArticle, {
                headers: { Authorization: token },
            });
            setMessage('Article added successfully');
            setNewArticle({ name: '', description: '', price: 0, stock: 0 });
        } catch (err) {
            setMessage('Error adding article');
            if (err.response.status === 401 || err.response.status === 403) {
                onLogout();
                navigate('/login');
            }
        }
    };

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <Container>
            <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginTop: '1rem' }}>
                Déconnexion
            </Button>
            <Typography variant="h4" gutterBottom>
                Ajouter un article
            </Typography>
            <TextField
                label="Name"
                name="name"
                value={newArticle.name}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                fullWidth
            />
            <TextField
                label="Description"
                name="description"
                value={newArticle.description}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                fullWidth
            />
            <TextField
                label="Price"
                name="price"
                type="number"
                value={newArticle.price}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                fullWidth
            />
            <TextField
                label="Stock"
                name="stock"
                type="number"
                value={newArticle.stock}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                fullWidth
            />
            {message && <Typography>{message}</Typography>}
            <Button variant="contained" color="primary" onClick={handleAddArticle} style={{ marginTop: '1rem' }}>
                Ajouter
            </Button>
        </Container>
    );
};

export default Admin;
