import {ActionInterface, Reducer} from "./interfaces";

export default (state:Reducer, action:ActionInterface) => {
    switch (action.type) {
        case  'IS_AUTH':
            return {
                ...state,
                isAuth:true,
                roomId:action.payload.roomId,
                userName:action.payload.userName,
            }
        case  'SET_DATA':
            return {
                ...state,
                users: action.payload.users,
                messages: action.payload.messages,
            }
        case  'SET_STATUS':
            if (state.userName != action.payload.userName) {
                return {
                    ...state,
                    status: [action.payload],
                }
            } else {
                return {
                    ...state,
                }
            }

        case  'SET_USERS':
            return {
                ...state,
                users:action.payload,
            }
        case  'NEW_MESSAGE':
            return {
                ...state,
                messages:[...state.messages,action.payload],
            }
        default:
            return state;
    }
}
