import React, { useState } from 'react';
import { Container, Paper, Box, TextField, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = ({ username, setUsername, password, setPassword, message, setMessage }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const register = () => {
    if (!username || !password || !email || !firstName || !lastName) {
      setMessage('Все поля обязательны!');
      return;
    }
    axios
      .post('https://localhost:7098/api/auth/register', {
        username,
        password,
        email,
        firstName,
        lastName,
        role: 'User',
      })
      .then(() => setMessage('Регистрация успешна! Пожалуйста, войдите.'))
      .catch((error) =>
        setMessage(`Ошибка регистрации: ${error.response?.data?.Message || error.message}`)
      );
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        <Box mb={2}>
          <TextField
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={register}
            style={{ marginTop: '10px' }}
          >
            Register
          </Button>
        </Box>
        {message && (
          <Typography color={message.includes('error') ? 'error' : 'primary'}>
            {message}
          </Typography>
        )}
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          Уже есть аккаунт?{' '}
          <Link to="/login" style={{ color: '#4CAF50', textDecoration: 'underline' }}>
            Войдите
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterForm;