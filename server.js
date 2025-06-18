const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const csv = require('csvtojson');
const fs = require('fs');
const bodyParser = require('body-parser');
const College = require('./college');
require('dotenv').config();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5501', 'http://127.0.0.1:5501', 'http://localhost:3800'],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://myAtlasDBUser:gJjlIxGqpR26avE5@cluster0.7i2ldxy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const PORT = process.env.PORT || 3800;

// MongoDB connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/filter', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'filter.html'));
});

app.get('/csvData', async (req, res) => {
    console.log('Received request for /csvData');
    try {
        const csvFilePath = path.join(__dirname, 'engineering colleges in India.csv');
        const jsonArray = await csv().fromFile(csvFilePath);
        await College.insertMany(jsonArray, { ordered: false });
        console.log('Data inserted successfully');
        res.status(200).json(jsonArray);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error processing data');
    }
});

app.get('/colleges', async (req, res) => {
    console.log('Received request for /colleges');
    try {
        const colleges = await College.find({}, {
            'College Name': 1,
            'Campus Size': 1,
            'Total Student Enrollments': 1,
            'Total Faculty': 1,
            'Established Year': 1,
            'Rating': 1,
            'University': 1,
            'Courses': 1,
            'Facilities': 1,
            'City': 1,
            'State': 1,
            'Country': 1,
            'College Type': 1,
            'Average Fees': 1,
        });
        console.log('Colleges data:', colleges);
        res.status(200).json(colleges);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Sign Up
app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const user = new User({ email, password });
        await user.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error during signup' });
    }
});

// Sign In
app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        res.status(200).json({ message: 'Sign in successful' });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Error during signin' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

