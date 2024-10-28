const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', ({ room }) => {
        socket.join(room);
        socket.room = room;
        console.log(`User joined room: ${room}`);

        socket.to(room).emit('message', `A new user has joined the room: ${room}`);
    });

    socket.on('chatMessage', (msg) => {
        io.to(socket.room).emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.to(socket.room).emit('message', 'A user has left the room');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
