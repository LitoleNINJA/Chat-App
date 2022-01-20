const express = require('express');
const cors = require('cors');
require('./server/config/db')();
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

require('./routes/api')(app);

app.use((err, req, res, next) => {
    res.send({
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('setup', userData);
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    });

    socket.on('typing', (room) => {
        socket.in(room).emit('typing', room);
    });

    socket.on('not typing', (room) => {
        socket.in(room).emit('not typing', room);
    });

    socket.on('new message', (message) => {
        const group = message.groupId;
        group.members.forEach(member => {
            if(member.__id === message.sender.__id) {
            socket.in(member.__id).emit('new message', message);
        }
        });
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        socket.leave(userData.__id);
    });

});
