import React from 'react';
import { Container, Paper, Box, Typography, Button, TextField } from '@mui/material';
import BookCard from './BookCard';

const Home = ({ books = [], searchResults = [], searchQuery, setSearchQuery, searchBooks, token, logout }) => {
  // Входные props books и searchResults по умолчанию — пустые массивы

  // Выбираем, что показывать: результаты поиска или все книги
  const displayBooks = (Array.isArray(searchResults) && searchResults.length > 0)
    ? searchResults
    : (Array.isArray(books) ? books : []);

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
          {displayBooks.length > 0 ? (
            displayBooks.map((book) => (
              <BookCard key={book.id} book={book} token={token} />
            ))
          ) : (
            // Если нет книг и есть поисковый запрос — показать "ничего не найдено"
            searchQuery ? (
              <Typography>Ничего не найдено</Typography>
            ) : null
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
};

export default Home;
