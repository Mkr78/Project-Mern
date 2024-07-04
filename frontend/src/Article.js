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
import { useNavigate } from 'react-router-dom';

const Article = ({ onLogout }) => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/articles', {
        headers: { Authorization: token }
      });
      setArticles(res.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      if (err.response.status === 401 || err.response.status === 403) {
        onLogout();
        navigate('/login');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;

  const filteredArticles = articles.filter(article =>
    article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <Container>
      <Button variant="contained" color="secondary" onClick={onLogout} style={{ marginTop: '1rem' }}>
        Déconnexion
      </Button>
      <h1>Articles</h1>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        margin="normal"
        fullWidth
        style={{ marginTop: '2rem' }}
      />
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
                <Button size="small" color="primary">
                  Buy
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" marginTop="2rem">
        <Pagination
          count={Math.ceil(filteredArticles.length / articlesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default Article;
