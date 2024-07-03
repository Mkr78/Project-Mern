const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const CONNECTION_URL = process.env.DBURL || "mongodb+srv://admin:0139220337m@cluster0.ljpns1p.mongodb.net/nodeProject?retryWrites=true&w=majority&appName=Cluster0";
const PORT = 3001;

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const articleSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
});

const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
});

const Category = mongoose.model('Category', categorySchema);
const Article = mongoose.model('Article', articleSchema);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.status(500).send('Server error');
    }
});

app.post('/articles', async (req, res) => {
    try {
        const newArticle = new Article(req.body);
        await newArticle.save();
        res.json(newArticle);
    } catch (err) {
        console.error('Error adding article:', err);
        res.status(500).send('Server error');
    }
});

app.put('/articles/:id', async (req, res) => {
    try {
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedArticle);
    } catch (err) {
        console.error('Error updating article:', err);
        res.status(500).send('Server error');
    }
});

app.delete('/articles/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.json({ message: 'Article deleted' });
    } catch (err) {
        console.error('Error deleting article:', err);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
