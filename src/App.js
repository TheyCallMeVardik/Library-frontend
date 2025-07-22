// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch all books
  const fetchBooks = (authToken = token) => {
    if (!authToken) return;
    axios.get('https://localhost:7098/api/books', {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .then(res => setBooks(res.data))
    .catch(err => console.error(err));
  };

  // Search books
  const searchBooks = () => {
    if (!token) return;
    axios.get(`https://localhost:7098/api/books/search?query=${encodeURIComponent(searchQuery)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setSearchResults(res.data))
    .catch(err => console.error(err));
  };

  // Login
  const login = () => {
    setMessage('');
    axios.post('https://localhost:7098/api/auth/login', { username, password })
      .then(res => {
        const t = res.data.token;
        localStorage.setItem('token', t);
        setToken(t);
        setUsername(''); setPassword('');
        fetchBooks(t);
      })
      .catch(err => setMessage(err.response?.data?.Message || err.message));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setBooks([]);
    setSearchResults([]);
  };

  // Check if admin
  const isAdmin = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return Array.isArray(roles) ? roles.includes('Admin') : roles === 'Admin';
    } catch {
      return false;
    }
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Library</Typography>
          {token ? (
            <>
              <Button color="inherit" component={Link} to="/">Главная</Button>
              {isAdmin() && <Button color="inherit" component={Link} to="/adminpanel">Админ</Button>}
              <Button color="inherit" onClick={logout}>Выйти</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Вход</Button>
              <Button color="inherit" component={Link} to="/register">Регистрация</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/login" element={!token ? (
          <LoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            login={login}
            message={message}
          />
        ) : <Navigate to="/" />} />

        <Route path="/register" element={!token ? (
          <RegisterForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            message={message}
            setMessage={setMessage}
          />
        ) : <Navigate to="/" />} />

        <Route path="/" element={token ? (
          <Home
            books={books}
            searchResults={searchResults}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchBooks={searchBooks}
            token={token}
            logout={logout}
          />
        ) : <Navigate to="/login" />} />

        <Route path="/adminpanel" element={token && isAdmin() ? (
          <AdminPanel token={token} />
        ) : <Navigate to="/" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
