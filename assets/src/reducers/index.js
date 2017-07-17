import {createReducer} from "redux-create-reducer";
import {combineReducers} from "redux";

const initialUsers = {};


export const users = createReducer(initialUsers, {
    ['ADDS_USER_INTO_TOTAL_CHAT'](state, {name, id}) {
        state[id] = {
            name
        };
        return {...state};
    },
    ['ROOM_TOTAL_CHAT_LIST_USERS'](state, {list}) {
        return {...list};
    }
});

const initialMessages = [];
export const messages = createReducer(initialMessages, {
    ['MESSAGE_FOR_TOTAL_CHAT'](state, {message}) {
        state.push(message);
        return [...state];
    },
    ['LIST_MESSAGE'](state, {list}) {
        return {...list};
    }
});
const initialSocket = {
    id: null
};
export const socket = createReducer(initialSocket, {
    ['ADD_ID_SOCKET'](state, {id}) {
        state.id = id;
        return {...state};
    },
});

const rootReducer = combineReducers({
    users,
    messages,
    socket
});

export default rootReducer