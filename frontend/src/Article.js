import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Article = () => {
    const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
  });

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


  return (
    <div>
        <h1>Product Management</h1>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={newArticle.name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={newArticle.description}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={newArticle.price}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={newArticle.stock}
        onChange={handleInputChange}
      />
      <button onClick={addArticle}>Add Article</button>
      <ul>
        {articles.map(article => (
          <li key={article._id}>
            <h2>{article.name}</h2>
            <p>{article.description}</p>
            <p>Price: {article.price}</p>
            <p>Stock: {article.stock}</p>
            <button onClick={() => deleteArticle(article._id)}>Delete</button>
            <button onClick={() => updateArticle(article._id, { ...article, stock: article.stock - 1 })}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  )

}

export default Article;