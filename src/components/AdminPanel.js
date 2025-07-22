import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Container,
  Paper,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AdminPanel = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: '',
    imageUrl: '',
    description: '',
  });
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBooks = () => {
    axios
      .get('https://localhost:7098/api/books', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setBooks(response.data))
      .catch((error) => console.error('Ошибка загрузки книг:', error));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = () => {
    axios
      .post('https://localhost:7098/api/books', newBook, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchBooks();
        setNewBook({ title: '', author: '', isbn: '', publicationYear: '', imageUrl: '', description: '' });
      })
      .catch((error) => console.error('Ошибка добавления книги:', error));
  };

  const saveEdit = () => {
    axios
      .put(
        `https://localhost:7098/api/books/${editingBook.id}`,
        editingBook,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        fetchBooks();
        setEditingBook(null);
      })
      .catch((error) => console.error('Ошибка обновления книги:', error));
  };

  const deleteBook = (id) => {
    axios
      .delete(`https://localhost:7098/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchBooks())
      .catch((error) => console.error('Ошибка удаления книги:', error));
  };

  const deleteAllBooks = () => {
    if (window.confirm('Вы уверены, что хотите удалить все книги?')) {
      axios
        .delete('https://localhost:7098/api/books', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => fetchBooks())
        .catch((error) => console.error('Ошибка массового удаления книг:', error));
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Админ-панель
        </Typography>

        {/* Поиск */}
        <Box mb={3} display="flex" gap={2}>
          <TextField
            label="Поиск по заголовку или автору"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Box>

        {/* Форма добавления/редактирования */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            {editingBook ? 'Редактирование книги' : 'Добавление книги'}
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mb={2}>
            {['title', 'author', 'isbn', 'publicationYear', 'imageUrl', 'description'].map((field) => (
              <TextField
                key={field}
                label={
                  field === 'isbn' ? 'ISBN' :
                  field === 'publicationYear' ? 'Год публикации' :
                  field === 'imageUrl' ? 'URL изображения' :
                  field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={
                  editingBook ? editingBook[field] : newBook[field]
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (editingBook) {
                    setEditingBook({ ...editingBook, [field]: value });
                  } else {
                    setNewBook({ ...newBook, [field]: value });
                  }
                }}
                fullWidth
              />
            ))}
            <Box display="flex" gap={2}>
              {editingBook ? (
                <>  
                  <Button variant="contained" color="primary" onClick={saveEdit}>
                    Сохранить
                  </Button>
                  <Button variant="outlined" onClick={() => setEditingBook(null)}>
                    Отмена
                  </Button>
                </>
              ) : (
                <Button variant="contained" color="primary" onClick={addBook}>
                  Добавить книгу
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Список книг */}
        <List>
          {filteredBooks.map((book) => (
            <ListItem
              key={book.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => setEditingBook(book)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteBook(book.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={book.title}
                secondary={`Автор: ${book.author}`}
              />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="secondary" onClick={deleteAllBooks} style={{ marginTop: '16px' }}>
          Удалить все книги
        </Button>
      </Paper>
    </Container>
  );
};

export default AdminPanel;
