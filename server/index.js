import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {Server} from 'http'
import sio from 'socket.io'

const app = express()
const port = 9001
let messages = []

const http = Server(app)
const io = sio(http)

app.use(cors())
app.use(bodyParser.json())

app.get('/messages', (req, res) => res.json(messages))
app.post('/messages', (req, res) => {
  try {
    addChat(req.body)
    res.status(200).send()
  } catch(e) {
    console.log(e)
    res.status(400).send()
  }
})

io.on('connection', (socket) => {
  const {id} = socket;
  console.log(`Client with id ${id} connected!`)
  socket.on('chat', () => addChat(socket, chat))
})

function addChat(chat) {
  const {userName, message} = chat;
  if (!userName, !message) throw new Erorr('INVALID MESSAGE')
  messages.push({
    userName,
    message,
    timestamp: new Date().getTime()
  })
  console.log(`There are now ${messages.length} messages`);
  io.emit('chat', messages[messages.length - 1])
}

http.listen(port, () => console.log(`Listening on port ${port}`))
