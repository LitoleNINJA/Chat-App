const express = require('express');
const cors = require('cors');
const path = require('path');
require('./server/config/db')();
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

require('./routes/api')(app);

// -------------------------------------------------
const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'client', 'build', 'index.html'));
    });
}
// -------------------------------------------------

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
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

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
    });

    socket.on('typing', (room) => {
        socket.in(room).emit('typing');
    });

    socket.on('not typing', (room) => {
        socket.in(room).emit('not typing');
    });

    socket.on('send message', (message, group) => {
        group.members.forEach(member => {
            if(member !== message.sender.userId) {
                socket.in(member).emit('message recieved', message);
        }});
    });

    socket.on('disconnect', (userData) => {
        socket.leave(userData._id);
    });
});
