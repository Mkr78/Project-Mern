const express = require('express');

const { json } = require('express');
const { connect, Schema, model } = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

require('dotenv').config()

const CONNECTION_URL = process.env.DBURL;
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY;

console.log('Starting server...');

connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const articleSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
});

const userSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'ROLE_USER' }
});

const Article = model('Article', articleSchema);
const User = model('User', userSchema);

app.use(cors());
app.use(json());

app.get('/', (req, res) => {
    console.log('GET /');
    res.send('Server is running');
});

// Vérification de token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        console.log('No token provided');
        return res.status(401).send('Access Denied');
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log('Invalid token');
            return res.status(403).send('Invalid Token');
        }
        req.user = user;
        next();
    });
};

// Vérification du rôle admin
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'ROLE_ADMIN') {
        console.log('Access Denied: Admins only');
        return res.status(403).send('Access Denied: Admins only');
    }
    next();
};

// Article Routes
app.get('/articles', authenticateToken, async (req, res) => {
    try {
        console.log('GET /articles');
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.status(500).send('Server error');
    }
});

app.post('/articles', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        console.log('POST /articles', req.body);  // Log before saving
        const newArticle = new Article(req.body);
        await newArticle.save();
        console.log('Article saved:', newArticle);  // Log after saving
        res.json(newArticle);
    } catch (err) {
        console.error('Error adding article:', err);
        res.status(500).send('Server error');
    }
});

app.put('/articles/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        console.log('PUT /articles/:id', req.params.id, req.body);
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedArticle);
    } catch (err) {
        console.error('Error updating article:', err);
        res.status(500).send('Server error');
    }
});

app.delete('/articles/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        console.log('DELETE /articles/:id', req.params.id);
        await Article.findByIdAndDelete(req.params.id);
        res.json({ message: 'Article deleted' });
    } catch (err) {
        console.error('Error deleting article:', err);
        res.status(500).send('Server error');
    }
});

// User Routes
app.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        console.log('POST /register', username);  // Log before registering
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        console.log('Saving user:', newUser);  // Log before saving
        await newUser.save();
        console.log('User registered:', newUser);  // Log after saving
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Server error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('POST /login', username);  // Log before login
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            console.log('Invalid credentials');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
