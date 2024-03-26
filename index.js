
const express = require('express');
const app = express();
const connector = require('./connection.js');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
app.use(cors());

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
    const { id, name, email, phone, dob, hobby, street, country, city, state, postCode } = req.body;
    const user = { id, name, email, phone, dob, hobby, street, country, city, state, postCode };

    connector.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) {
            res.status(500).send('Error adding user');
            return;
        }
        res.status(200).send('User added successfully');
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