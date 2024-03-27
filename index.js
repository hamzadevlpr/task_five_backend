
const express = require('express');
const app = express();
const connector = require('./connection.js');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
app.use(cors());
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }

});





connector.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
}
);
app.use(express.json());

app.get('/', (req, res) => {
    connector.query('SELECT * FROM users', (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    const user = { email, password };

    connector.query('SELECT * FROM user WHERE email = ?', email, (err, rows) => {
        if (err) {
            console.error('Error checking for user:', err);
            return res.status(500).send('Error checking for user');
        }
        if (rows.length > 0) {
            return res.status(400).send('Email already exists');
        }

        connector.query('INSERT INTO user SET ?', user, (err, result) => {
            if (err) {
                return res.status(500).send('Error adding user');
            }
            res.status(200).send({ message: 'User signed up successfully', user });
        });
    });
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    connector.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], (err, rows) => {
        if (err) {
            return res.status(500).send('Error checking for user');
        }
        if (rows.length === 0) {
            return res.status(400).send(`User doesn't exist or password is incorrect`);
        }
        res.status(200).send({ message: 'User logged in successfully', user: rows[0] });
    });
});



app.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    connector.query('SELECT * FROM users WHERE id = ?', userId, (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
}
);

app.post('/add', (req, res) => {
    const { id, name, email, phone, dob, hobby, street, country, city, state, postCode, userId } = req.body;
    console.log(req.body)
    const user = { id, name, email, phone, dob, hobby, street, country, city, state, postCode, userId };

    connector.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) {
            res.status(500).send('Error adding user');
            return;
        }
        res.status(200).send('User added successfully');
    });
});

// get user data based on user id 
app.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    connector.query('SELECT * FROM users WHERE userId = ?', userId, (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

app.put('/update/:userId', (req, res) => {
    const userId = req.params.userId;
    const { name, email, phone, dob, hobby, street, country, city, state, postCode } = req.body;
    const updatedUser = { name, email, phone, dob, hobby, street, country, city, state, postCode };
    connector.query('UPDATE users SET ? WHERE id = ?', [updatedUser, userId], (err, result) => {
        if (err) {
            res.status(500).send('Error updating user');
            return;
        }
        res.status(200).send('User updated successfully');
    });
});

app.delete('/delete/:userId', (req, res) => {
    const userId = req.params.userId;
    connector.query('DELETE FROM users WHERE id = ?', userId, (err, result) => {
        if (err) {
            res.status(500).send('Error deleting user');
            return;
        }
        res.status(200).send('User deleted successfully');
    });
});

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: 'hamzamalikllc@gmail.com',
        pass: 'wclshmisdrkvybpp',
    },
    authMethod: "PLAIN"
});

const secrets = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ";
app.post('/forget', async (req, res) => {
    const { email } = req.body;

    try {
        const results = await new Promise((resolve, reject) => {
            connector.query('SELECT * FROM user WHERE email = ?', email, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });

        if (results.length === 0) {
            res.status(404).json({ error: 'Email not found' });
            return;
        }

        const token = jwt.sign({ email }, secrets, { expiresIn: '1d' });

        const info = await transporter.sendMail({
            from: `Muhammad Hamza Malik <hamzamalikllc@gmail.com>`,
            to: email,
            subject: "Password Reset ✔",
            text: "Hello, Please click the following link to reset your password: [Reset Link]",
            html: `<b>Hello,</b><p>Please click the following link to reset your password: <a href='http://localhost:5173/new-password/${token}' class="inline-flex w-full items-center justify-center rounded-md px-3.5 py-2.5 font-semibold leading-7 text-gray-600 bg-gray-200 hover:bg-gray-300">Reset Link</a></p>`,
        });

        console.log("Message sent: %s", info.messageId);

        res.json({ message: 'Reset password link has been sent to your email' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ error: 'Failed to send reset password email' });
    }
});

app.post('/new-password/:token', async (req, res) => {
    // get token from params 
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const payload = jwt.verify(token, secrets);
        const { email } = payload;

        connector.query('UPDATE user SET password = ? WHERE email = ?', [newPassword, email], (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Failed to update password' });
                return;
            }
            res.json({ message: 'Password updated successfully' });
        });

    } catch (err) {
        console.error('JWT verification error:', err);
        res.status(400).json({ error: 'Invalid or expired token' });
    }
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('send', (data) => {
        console.log(data);
        socket.broadcast.emit('recieve', data.message);
    });
    socket.on('user_updated', (userId) => {
        console.log('User updated:', userId);
        socket.broadcast.emit('user_updated', userId);
    });
    socket.on('user_deleted', (userId) => {
        console.log('User deleted:', userId);
        socket.broadcast.emit('user_deleted', userId);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


server.listen(3000, () => {
    console.log('listening on port :3000');
}
);