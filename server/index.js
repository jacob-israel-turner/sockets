const express = require('express')
const Server = require('http').Server
const socketIo = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser')

const port = 9001

const app = express()
const http = Server(app)
const io = socketIo(http)

const messages = [];

app.use(cors())
app.use(bodyParser.json())

app.get('/messages', (req, res) => res.json(messages))

io.on('connection', (socket) => {
  const {id} = socket;
  console.log(`Client with ID ${id} connected`)

  socket.on('disconnect', () => console.log(`Client with ID${id} disconnected`))

  socket.on('chat', addChat.bind(null, socket))
})

function addChat(socket, chat) {
  const {id: connectionId} = socket
  try {
    const {userName, message} = chat;
    if (!userName, !message) throw new Erorr('INVALID MESSAGE')
    messages.push({
      userName,
      message,
      timestamp: new Date().getTime()
    })
    console.log(`There are now ${messages.length} messages`)
    io.emit('chat', messages[messages.length - 1]) // Change to socket.broadcast.emit
  } catch(e) {console.log(`Invalid chat from ${connectionId}`)}
}

http.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
