import React, {useState, useEffect, useRef} from 'react';
import './notifications.css';

interface NotificationsProps {
    status: string;
    value: string;
    setStatus: (value:string) => void
    setError: (value:string) => void
}

const Notifications = ({value,setError,status,setStatus}:NotificationsProps) => {

    const [isRun,setIsRun] = useState<boolean>(false)

    const getColor = () => {
        switch(status) {
            case 'error':
                return 'red'
            case 'new':
                return 'green'
            case 'exit':
                return 'blue'
            default:
                return 'black'
        }
    }

    useEffect(() => {
        value !== '' && setIsRun(true)
        value !== '' && setTimeout(() => {
            setError('')
            setIsRun(false)
            setStatus('')
        },2000)
    },[value])

    return (<div className="notificationWrapper">
        {isRun && value !== '' && <div className={`notification`} style={{color:getColor()}}>{value}</div>}
    </div>)
}

export default Notifications;
