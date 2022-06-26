const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app)
const io = socketIo(server)


const router = express.Router()

const viewsDirectoryPath = path.join(__dirname, '../views')
app.use(express.static(viewsDirectoryPath))

// -- Alternative to line above --
// router.get('/', (req, res) => {
//     res.sendFile(viewsDirectoryPath + '/index.html');
// })
// app.use(router)

io.on('connection', (socket) => {
    socket.emit('welcome', "Welcome!");
    
    socket.on('sendMessage', (msg) => {
        io.emit('receiveMessage', msg)
    })
})

const port = process.env.PORT || 3000;
server.listen(port, ()=>{
    console.log(`Server is up on port: ${port}` );
})