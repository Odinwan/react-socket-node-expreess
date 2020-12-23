export interface User {
    roomId: number,
    userName: string,
    time:string
}

export interface Message {
    userName:string;
    text:string;
    time:string;
}


export interface Status {
    userName:string,
    action: boolean
}

export interface Reducer {
    isAuth: boolean,
    roomId: number,
    userName: string,
    status: Status[],
    users: User[],
    messages: Message[]
}
export interface ActionInterface {
    type: string;
    payload: any;
}
