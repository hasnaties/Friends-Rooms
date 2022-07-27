const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const {generateLocationMessage, generateMessage} = require('./utils/messages')

const app = express();
const server = http.createServer(app)
const io = socketIo(server)


const router = express.Router()

const viewsDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(viewsDirectoryPath))

// -- Alternative to line above --
// router.get('/', (req, res) => {
//     res.sendFile( viewsDirectoryPath + '/index.html');
// })
// app.use(router)

io.on('connection', (socket) => {

    socket.on('join', (params, callback) => {
        
        const {user, error} = addUser({id: socket.id, ...params});
        if (error) {
            return callback(error)
        }

        socket.join(user.room);
        socket.emit('welcome', generateMessage('admin', "Welcome!"));
        socket.broadcast.to(user.room).emit('receiveMessage', generateMessage('admin', `${user.username} has joined the room!`))
        callback();

        //sending back the room list
        io.to(user.room).emit('roomList', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
    })

    
    socket.on('sendMessage', (msg) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('receiveMessage', generateMessage(user.username, msg));
    })

    socket.on('sendLocation', (position, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, position))
        callback('Message is sent.')
    })

    socket.on('disconnect', () => {

        const user = removeUser(socket.id);
        if (user) {
            socket.broadcast.to(user.room).emit('receiveMessage', generateMessage(`${user.username} has left the room!`));
            //updating the room list
            io.to(user.room).emit('roomList', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });            
        }
    })
})

const port = process.env.PORT;
server.listen(port, ()=>{
    console.log(`Server is up on port: ${port}` );
})