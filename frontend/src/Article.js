// article.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  TextField,
  Container,
  Grid,
  CardMedia,
  Pagination,
  Box
} from '@mui/material';

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await axios.get('http://localhost:3001/articles');
      setArticles(res.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
    }
  };

  const addArticle = async () => {
    try {
      const res = await axios.post('http://localhost:3001/articles', newArticle);
      setArticles([...articles, res.data]);
      setNewArticle({ name: '', description: '', price: 0, stock: 0 });
    } catch (err) {
      console.error('Error adding article:', err);
    }
  };

  const deleteArticle = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/articles/${id}`);
      setArticles(articles.filter(article => article._id !== id));
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  const updateArticle = async (id, updatedFields) => {
    try {
      const res = await axios.put(`http://localhost:3001/articles/${id}`, updatedFields);
      setArticles(articles.map(article => (article._id === id ? res.data : article)));
    } catch (err) {
      console.error('Error updating article:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle({ ...newArticle, [name]: value });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <Container>
      <h1>Product Management</h1>
      <TextField
        label="Name"
        name="name"
        value={newArticle.name}
        onChange={handleInputChange}
        variant="outlined"
        margin="normal"
        fullWidth
      />
      <TextField
        label="Description"
        name="description"
        value={newArticle.description}
        onChange={handleInputChange}
        variant="outlined"
        margin="normal"
        fullWidth
      />
      <TextField
        label="Price"
        name="price"
        value={newArticle.price}
        onChange={handleInputChange}
        variant="outlined"
        margin="normal"
        fullWidth
      />
      <TextField
        label="Stock"
        name="stock"
        value={newArticle.stock}
        onChange={handleInputChange}
        variant="outlined"
        margin="normal"
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={addArticle} style={{ marginTop: '1rem' }}>
        Add Article
      </Button>
      <Grid container spacing={2} style={{ marginTop: '2rem' }}>
        {currentArticles.map(article => (
          <Grid item xs={12} sm={6} md={4} key={article._id}>
            <Card>
              <CardMedia
                component="img"
                alt="Article image"
                height="140"
                image={`https://picsum.photos/200/300?random=${article._id}`}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {article.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {article.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {article.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock: {article.stock}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => updateArticle(article._id, { ...article, stock: article.stock - 1 })}>
                  Buy
                </Button>
                <Button size="small" color="secondary" onClick={() => deleteArticle(article._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" marginTop="2rem">
        <Pagination
          count={Math.ceil(articles.length / articlesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default Article;
