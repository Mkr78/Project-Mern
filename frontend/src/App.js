import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Article from './Article';
import Login from './Login';
import Register from './Register';
import Admin from './Admin';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || '');

    const handleLogin = (token, role) => {
        setToken(token);
        setRole(role);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
    };

    const handleLogout = () => {
        setToken('');
        setRole('');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/articles" element={token ? <Article onLogout={handleLogout} /> : <Navigate to="/login" />} />
                {/* <Route path="/articles" element={<Article />} /> */}
                {/* <Route path="/admin" element={token && role === 'ROLE_ADMIN' ? <Admin onLogout={handleLogout} /> : <Navigate to="/login" />} /> */}
                <Route path="/admin" element={<Admin/>} />

            </Routes>
        </Router>
    );
};

export default App;
