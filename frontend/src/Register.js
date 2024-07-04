import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:3001/register', { username, password, role });
            setMessage('User registered successfully');
        } catch (err) {
            setMessage('Error registering user');
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>Inscription</Typography>
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
            <TextField
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
            />
            {message && <Typography>{message}</Typography>}
            <Button variant="contained" color="primary" onClick={handleRegister} style={{ marginTop: '1rem' }}>
                S'inscrire
            </Button>
        </Container>
    );
};

export default Register;
