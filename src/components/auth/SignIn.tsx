import React, {useState} from 'react';
import axios from 'axios'
import {User} from '../../interfaces'
import './SignIn.css';
import Notification from "../notifications/Not";
import moment from "moment";

interface SignInProps {
    socket: any,
    onLogin: (user: User) => void
}

const SignIn = ({onLogin}: SignInProps) => {

    const [userName, setName] = useState<string>('');
    const [roomId, setRoomId] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<string>('');


    const submit = () => {
        if (userName !== '') {
            setIsLoading(true)
            setTimeout(async () => {
                const time = moment().format('LT')
                const user: User = {roomId, userName,time}
                await axios
                    .post('/rooms', user)
                    .then((res) => {
                        onLogin(user)
                        setStatus('')
                        setError('')
                        setIsLoading(false)
                    })
            }, 1500)
        } else {
            setStatus('error')
            setError('Введите имя')
        }
    }
    const animationText = (value: string) => {
        return `${value}...`
    }
    return <div className="App">
        <Notification value={error} status={status} setStatus={setStatus} setError={setError}/>
        <div className="wrapperSignIn">
            <div className="containerForm">
                <div>Чат</div>
                <input type="text" value={userName} onChange={event => setName(event.target.value)}
                       placeholder="Ваше Имя"/>
                <button disabled={isLoading} className={error !== '' ? 'error' : ''}
                        onClick={submit}>{isLoading ? animationText('Вход') : 'Войти'}</button>
            </div>
        </div>
    </div>
}

export default SignIn;
