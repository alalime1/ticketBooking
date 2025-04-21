// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage
let users = [];
let events = [];
let bookings = [];

// Utility: Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

// -------- USER ROUTES -------- //
app.post('/api/users/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    users.push({ id: generateId(), username, password });
    res.json({ message: 'Registered successfully' });
});

app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', userId: user.id });
});

// -------- EVENT ROUTES -------- //
app.get('/api/events', (req, res) => {
    res.json(events);
});

app.post('/api/events', (req, res) => {
    const { title, location, date, category } = req.body;
    const event = { id: generateId(), title, location, date, category };
    events.push(event);
    res.status(201).json(event);
});

// -------- BOOKING ROUTES -------- //
app.post('/api/bookings', (req, res) => {
    const { userId, eventId, seats } = req.body;
    const booking = { id: generateId(), userId, eventId, seats };
    bookings.push(booking);
    res.status(201).json(booking);
});

app.get('/api/bookings/:userId', (req, res) => {
    const userBookings = bookings.filter(b => b.userId === req.params.userId);
    res.json(userBookings);
});

app.delete('/api/bookings/:bookingId', (req, res) => {
    bookings = bookings.filter(b => b.id !== req.params.bookingId);
    res.json({ message: 'Booking cancelled' });
});

// -------- SERVER LISTEN -------- //
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
