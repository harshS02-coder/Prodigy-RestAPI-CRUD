const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const users = new Map(); // in-memory storage

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Create User
app.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const id = uuidv4();
    const user = { id, name, email, age };
    users.set(id, user);
    res.status(201).json({ success: true, user });
});

// Read All Users
app.get('/users', (req, res) => {
    res.status(200).json({ success: true, users: Array.from(users.values()) });
});

// Read Single User
app.get('/users/:id', (req, res) => {
    const user = users.get(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
});

// Update User
app.put('/users/:id', (req, res) => {
    const user = users.get(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { name, email, age } = req.body;
    if (email && !isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const updatedUser = { ...user, ...req.body };
    users.set(req.params.id, updatedUser);
    res.status(200).json({ success: true, user: updatedUser });
});

// Delete User
app.delete('/users/:id', (req, res) => {
    const exists = users.has(req.params.id);
    if (!exists) return res.status(404).json({ success: false, message: "User not found" });

    users.delete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted" });
});

app.listen(4500, () => {
    console.log("Server running at http://localhost:4500");
});
