const express = require('express');

var cors = require('cors')

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

const rooms = new Map()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) //парсинг ссылки

app.post('/rooms', (req, res) => {
    const { roomId } = req.body
    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
                ['users', new Map()],
                ['messages', []]
            ])
        )
    }
    res.json([...rooms.values()])
});

app.get('/rooms', (req, res) => {
    const roomId = 1;
    const obj = {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [],
    }
    res.json(obj)
});


io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({ userName }) => {
        socket.join(1);
        rooms && rooms.get(1) && rooms.get(1).get('users').set(socket.id, userName)
        const users = [...rooms.get(1).get('users').values()]
        socket.to(1).broadcast.emit('ROOM:SET_USERS', users)
        socket.to(1).broadcast.emit('ROOM:JOIN_SOME_USER', userName)
    })
    socket.on('ROOM:NEW_MESSAGE', ({ userName, text, time }) => {
        const obj = {
            userName,
            text,
            time
        }
        rooms.get(1).get('messages').push(obj)
        socket.to(1).broadcast.emit('ROOM:NEW_MESSAGE', obj)
    })
    socket.on('ROOM:CHANGE_STATUS', (data) => {
        socket.to(1).broadcast.emit('ROOM:CHANGE_STATUS', data)
    })
    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            socket.to(1).broadcast.emit('ROOM:DISCONNECT_SOME_USER', value.get('users').get(socket.id))

            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()]
                socket.to(1).broadcast.emit('ROOM:SET_USERS', users)
            }

        });
    })
})



server.listen(8080, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log('server listening')
})

