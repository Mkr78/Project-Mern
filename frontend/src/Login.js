import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3001/login', { username, password });
            const { token, role } = res.data;
            onLogin(token, role);
            console.log(role);
            console.log(res.data); 
            
            navigate(role === 'ROLE_ADMIN' ? '/admin' : '/articles'); 
        } catch (err) {
            setError('Invalid credentials'); 
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>Login</Typography>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button variant="contained" color="primary" onClick={handleLogin} style={{ marginTop: '1rem' }}>
                Login
            </Button>
        </Container>
    );
};

export default Login;
