import React, {useState, useEffect, useRef} from "react";
import "./chat.css";
import Picker, {SKIN_TONE_MEDIUM_DARK} from "emoji-picker-react";
import moment from "moment";
import images from "../../constants";
import {Message, Status} from "../../interfaces";

interface ChatProps {
    addMessage: (message: Message) => void
    addStatus: (status: Status) => void
    roomId: number,
    socket: any,
    userName: string,
    users: string[],
    messages: Message[],
    status: Status[]
}

const Chat = ({status, users, socket, userName, messages, addMessage, addStatus}: ChatProps) => {

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        //@ts-ignore
        messagesEndRef.current.scrollIntoView({behavior: "smooth"});
    };

    const [messageValue, setMessageValue] = useState<string>("");
    const [filterUser, setFilterUser] = useState<string>("");
    const [smileOpen, setSmileOpen] = useState<boolean>(false);
    const [isWrite, setIsWrite] = useState<boolean>(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (!isWrite) {
            setIsWrite(true);
            const status = {userName, action: true};
            socket.emit("ROOM:CHANGE_STATUS", status);
            addStatus(status);
            setTimeout(() => {
                const status = {userName, action: false};
                setIsWrite(false);
                socket.emit("ROOM:CHANGE_STATUS", status);
                addStatus(status);
            }, 1000);
        }
    }, [messageValue]);

    const onEmojiClick = (event: any, emojiObject: any) => {
        setChosenEmoji(emojiObject);
    };

    useEffect(() => {
        // @ts-ignore
        chosenEmoji !== null && setMessageValue(`${messageValue}${chosenEmoji?.emoji}`);
    }, [chosenEmoji]);

    const submit = () => {
        if (messageValue !== "") {
            const obj = {
                userName,
                text: messageValue,
                time: moment().format("LT"),
            };
            socket.emit("ROOM:NEW_MESSAGE", obj);
            addMessage(obj);
            setMessageValue("");
        }
    };

    const handleKeypress = (e: { key: string; }) => {
        if (e.key === "Enter") {
            submit();
        }
    };

    const statusMoment = (userName: string) => {
        const name = status.filter((item) => item.userName === userName);
        if (name.length !== 0 && name[0].userName) {
            if (name[0].userName && name[0].action) {
                return <img className='points' src={images.points} alt={"пишет"}/>;
            }
            else {
                return "";
            }
        }
    };

    const checkMessage = (message: Message, index: number) => {
        if (message.userName === userName) {
            return <div key={index + message.text} className={"wrapperMess myMess"}>
                <div className='wrapperMyMessage item'>
                    <div className="myMessage message">
                        {message.text}
                    </div>
                </div>
                <div className={"infoMess"}>{message.userName} {message.time}</div>
            </div>;
        }
        else {
            return <div key={index + message.text} className={"wrapperMess anotherMess"}>
                <div className='wrapperAnotherMessage item'>
                    <div className="anotherMessage message">
                        {message.text}
                    </div>
                </div>
                <div className={"infoMess"}>{message.userName} {message.time}</div>
            </div>;
        }
    };

    return (
        <div className="ChatContainer">
            <img onClick={scrollToBottom} style={{position: "fixed", right: 15, bottom: 15, height: 30, width: 30}}
                 src={images.scrollDown} alt="scrollDown"/>
            <div className='windowChat'>
                <div className="leftPath">
                    <div className='wrapperFilter'>
                        <input placeholder={"Поиск"} onChange={e => setFilterUser(e.target.value)} type="text"/>
                        <img style={{height: 25, width: "auto", position: "absolute", right: 9, bottom: 9}}
                             src={images.filter} alt="avatar"/>
                    </div>
                    <div className="wrapperListUser">
                        {users && users.filter((name) => !name.toLowerCase().indexOf(filterUser.toLowerCase())).map((name, index) =>
                            <div key={index + name} className="item">
                                <img className='avatar' style={{height: 25, width: "auto"}} src={images.avatar}
                                     alt="avatar"/>
                                <div className='description'>
                                    <div>{name}</div>
                                    <div
                                        style={{fontSize: 10, position: "absolute", bottom: -10}}>{statusMoment(name)}</div>
                                </div>
                            </div>)}
                    </div>
                </div>
                <div className="rightPath">
                    <div className='header'>Имя канала</div>
                    <div className='chatWrapper'>
                        <div className='chat'>
                            {
                                messages && messages.map((message, index) => checkMessage(message, index))
                            }
                            <div ref={messagesEndRef} className="list-bottom"></div>
                        </div>
                    </div>
                    <div className='footer'>
                        <input onKeyPress={handleKeypress} value={messageValue} placeholder={"Enter your message here"}
                               onChange={event => setMessageValue(event.target.value)} type="text"/>
                        <div onClick={() => setSmileOpen(!smileOpen)}><img style={{height: 25}} src={images.happy} alt="smile"/>
                        </div>
                        <img onClick={submit} src={images.send} alt="send"/>
                    </div>
                    <div className={"smileWrapper"}>
                        {smileOpen && <div>
                            <Picker onEmojiClick={onEmojiClick} disableAutoFocus={true} skinTone={SKIN_TONE_MEDIUM_DARK}
                                    groupNames={{smileys_people: "PEOPLE"}}/>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
