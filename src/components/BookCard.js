import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import axios from 'axios';

const BookCard = ({ book, token }) => {
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
};

export default BookCard;