const express = require('express');
const app = express();
const csv = require('csvtojson');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const College = require('./college');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://myAtlasDBUser:gJjlIxGqpR26avE5@cluster0.7i2ldxy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const PORT = process.env.PORT || 3800;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Database has been connected');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signin.html'));
});

app.get('/csvData', (req, res) => {
    console.log('Received request for /csvData');
    const csvFilePath = path.join(__dirname, process.env.CSV_FILE_PATH || 'engineering colleges in India.csv');
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            College.insertMany(jsonObj)
                .then(() => {
                    console.log('Data inserted successfully');
                    res.status(200).json(jsonObj);
                })
                .catch(err => {
                    console.error('Error inserting data:', err);
                    res.status(500).send('Error inserting data');
                });
        })
        .catch(err => {
            console.error('Error reading CSV file:', err);
            res.status(500).send('Error reading CSV file');
        });
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

