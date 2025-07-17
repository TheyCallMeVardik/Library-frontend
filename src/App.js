import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';

// Компонент BookCard
function BookCard({ book, token }) {
  const buyBook = () => {
    axios
      .post(`https://localhost:7098/api/books/purchase?bookId=${book.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => alert('Книга куплена!'))
      .catch((error) => alert(`Ошибка при покупке: ${error.message}`));
  };

  return (
    <Card sx={{ display: 'flex', margin: 2, height: '200px' }}>
      <CardMedia
        component="img"
        sx={{ width: 150, height: '100%', objectFit: 'cover' }}
        image={book.imageUrl || 'https://via.placeholder.com/150'}
        alt={`${book.title} cover`}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6">{book.title}</Typography>
          <Typography variant="body2" color="text.secondary">Автор: {book.author}</Typography>
          <Typography variant="body2" color="text.secondary">Цена: {book.price || 'Не указана'} €</Typography>
          <Typography variant="body2" color="text.secondary">Описание: {book.description || 'Нет описания'}</Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={buyBook} sx={{ mt: 2 }}>
          Купить
        </Button>
      </CardContent>
    </Card>
  );
}

// Компонент LoginForm
function LoginForm({ username, setUsername, password, setPassword, login, message }) {
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
}

// Компонент RegisterForm
function RegisterForm({ username, setUsername, password, setPassword, message, setMessage }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('User');

  const register = () => {
    if (!username || !password || !email || !firstName || !lastName || !role) {
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
        role,
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
}

// Компонент Home
function Home({ books, searchResults, searchQuery, setSearchQuery, searchBooks, token, logout }) {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>Добро пожаловать в библиотеку!</Typography>

        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            fullWidth
            label="Поиск книг"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                searchBooks();
              }
            }}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={searchBooks}
            style={{ height: '56px', marginLeft: '8px' }}
          >
            Поиск
          </Button>
        </Box>

        <Box>
          {(searchResults.length > 0 ? searchResults : books).map((book) => (
            <BookCard key={book.id} book={book} token={token} />
          ))}
          {((searchResults.length === 0 && books.length === 0) ||
            (searchResults.length === 0 && searchQuery)) && (
            <Typography>Ничего не найдено</Typography>
          )}
        </Box>

        <Button
          variant="contained"
          color="secondary"
          onClick={logout}
          style={{ marginTop: '20px' }}
        >
          Выйти
        </Button>
      </Paper>
    </Container>
  );
}

// Главный компонент App
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchBooks(storedToken);
    }
  }, []);

  const fetchBooks = (authToken = token) => {
    if (!authToken) return;
    axios
      .get('https://localhost:7098/api/books', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => setBooks(response.data))
      .catch((error) => {
        console.error('Ошибка загрузки книг:', error);
        setIsLoggedIn(false);
        setToken(null);
        localStorage.removeItem('token');
      });
  };

  const searchBooks = () => {
    if (!token) return;
    axios
      .get(`https://localhost:7098/api/books/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setSearchResults(response.data))
      .catch((error) => console.error('Ошибка поиска книг:', error));
  };

  const login = () => {
    if (!username || !password) {
      setMessage('Требуются имя пользователя и пароль!');
      return;
    }
    axios
      .post('https://localhost:7098/api/auth/login', { username, password })
      .then((response) => {
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setIsLoggedIn(true);
        setMessage('Вход успешен!');
        fetchBooks(newToken);
        navigate('/');
      })
      .catch((error) => {
        setMessage(`Ошибка входа: ${error.response?.data?.Message || error.message}`);
      });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('token');
    setMessage('Вы вышли из системы');
    setBooks([]);
    setSearchResults([]);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Library</Link>
          {isLoggedIn && <Link className="nav-link" to="/">Home</Link>}
        </div>
      </nav>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? (
            <Home
              books={books}
              searchResults={searchResults}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchBooks={searchBooks}
              token={token}
              logout={logout}
            />
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/login"
          element={<LoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            login={login}
            message={message}
          />}
        />
        <Route
          path="/register"
          element={<RegisterForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            message={message}
            setMessage={setMessage}
          />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default AppWrapper;