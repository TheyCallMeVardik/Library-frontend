import React from 'react';
import { Container, Paper, Box, TextField, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const LoginForm = ({ username, setUsername, password, setPassword, login, message }) => {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            onClick={login}
            style={{ marginTop: '10px' }}
          >
            Login
          </Button>
        </Box>
        {message && (
          <Typography color={message.includes('error') ? 'error' : 'primary'}>
            {message}
          </Typography>
        )}
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          Еще не зарегистрированы?{' '}
          <Link to="/register" style={{ color: '#4CAF50', textDecoration: 'underline' }}>
            Зарегистрируйтесь
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginForm;