import React, {useEffect, useState} from 'react';
import SignIn from './components/auth/SignIn';
import Chat from './components/chat/Chat';
import reducer from './reducer'
import {Message, Status, User} from './interfaces'

import io from 'socket.io-client'
import axios from "axios";
import Notification from "./components/notifications/Not";

export const socket = io('http://localhost:9999');

const App = () => {

    const [state, dispatch] = React.useReducer(reducer, {
        isAuth: false,
        roomId: null,
        userName: null,
        status: [],
        users: [],
        messages: []
    })

    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        socket.on('ROOM:SET_USERS', (users: User[]) => setUsers(users))
        socket.on('ROOM:NEW_MESSAGE', (message: Message) => addMessage(message))
        socket.on('ROOM:CHANGE_STATUS', (status: Status) => addStatus(status))
        socket.on('ROOM:JOIN_SOME_USER', (name: string) => MessageNewUser(name,'new'))
        socket.on('ROOM:DISCONNECT_SOME_USER', (name: string) => MessageNewUser(name,'exit'))
    }, []);

    const setUsers = (users: User[]) => {
        dispatch({
            type: 'SET_USERS',
            payload: users
        })
    }

    const addStatus = (status: Status) => {
        dispatch({
            type: 'SET_STATUS',
            payload: status
        })
    }

    const addMessage = (message: Message) => {
        dispatch({
            type: 'NEW_MESSAGE',
            payload: message
        })
    }

    const MessageNewUser = (user:string,status:string) => {
        setStatus(status)
        user !== null && setError(status === 'new' ? `К нам зашел ${user}`: `От нас ушел ${user}`)
    }

    const onLogin = async (user: User) => {
        dispatch({
            type: 'IS_AUTH',
            payload: user
        });
        socket.emit('ROOM:JOIN', user)
        const res = await axios.get(`/rooms`)
        dispatch({
            type: 'SET_DATA',
            payload: res.data
        })
    }

    return <>
        <Notification value={error} status={status} setStatus={setStatus} setError={setError}/>
        {!state.isAuth ?
            <SignIn socket={socket} onLogin={onLogin}/>
            :
            <Chat
                addStatus={addStatus}
                addMessage={addMessage}
                status={state.status}
                roomId={state.roomId}
                socket={socket}
                userName={state.userName}
                users={state.users}
                messages={state.messages}
            />}
    </>
}

export default App
