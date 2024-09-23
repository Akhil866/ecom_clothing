const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');

// Firebase admin setup
let serviceAccount = require("./ecom-website-8b6ad-firebase-adminsdk-kbp26-5d89f565b4.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Declare path for static files
const staticPath = path.join(__dirname, "public");

// Initialize express.js
const app = express();

// Middlewares
app.use(express.static(staticPath));
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
});

// Signup route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(staticPath, "signup.html"));
});

app.post('/signup', async (req, res) => {
    try {
        console.log('Signup request body:', req.body); // Log incoming request body
        
        const { name, email, password, number, tac } = req.body;

        // Form validation
        if (name.length < 3) return res.status(400).json({ 'error': 'Name must be at least 3 characters long' });
        if (!email) return res.status(400).json({ 'error': 'Email is required' });
        if (password.length < 8) return res.status(400).json({ 'error': 'Password must be at least 8 characters long' });
        if (!number || !/^\d+$/.test(number) || number.length < 10) return res.status(400).json({ 'error': 'Invalid phone number' });
        if (!tac) return res.status(400).json({ 'error': 'You must agree to our terms and conditions' });

        // Check if the email already exists
        const userDoc = await db.collection('users').doc(email).get();
        if (userDoc.exists) {
            return res.status(400).json({ 'error': 'Email already exists' });
        }

        // Hash the password
        const hash = await bcrypt.hash(password, 10);

        // Save user data to the database
        await db.collection("users").doc(email).set({
            name,
            email,
            number,
            tac,
            password: hash // Save hashed password
        });

        // Send a success response
        return res.json({
            name,
            email,
            message: 'Signup successful!'
        });
    } catch (error) {
        console.error('Error in signup route:', error);
        return res.status(500).json({ 'error': 'Internal Server Error', 'details': error.message });
    }
});

// Login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(staticPath, "login.html"));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email.length || !password.length) {
        return res.json({ 'alert': 'Fill in all the inputs' });
    }

    try {
        const user = await db.collection('users').doc(email).get();

        if (!user.exists) {
            return res.json({ 'alert': 'Login email does not exist' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.data().password);
        if (isPasswordValid) {
            const data = user.data();
            return res.json({
                name: data.name,
                email: data.email,
                seller: data.seller
            });
        } else {
            return res.json({ 'alert': 'Password is incorrect' });
        }
    } catch (error) {
        console.error('Error in login route:', error);
        return res.status(500).json({ 'error': 'Internal Server Error', 'details': error.message });
    }
});

// Seller route
app.get('/seller', (req, res) => {
    res.sendFile(path.join(staticPath, "seller.html"));
});

// 404 route
app.get("/404", (req, res) => {
    res.sendFile(path.join(staticPath, "404.html"));
});

// Catch-all route for undefined routes
app.use((req, res) => {
    res.redirect('/404');
});

// Start the server
app.listen(3000, () => {
    console.log('Listening on port 3000....');
});
