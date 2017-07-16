let Socket = null;

export const AddEvents = ({socket, dispatch}) => {
    socket.on('connect', () => {
        Socket = socket;
        console.log('New connect into chat id:', socket.id);
        dispatch({
            type: 'ADD_ID_SOCKET',
            id: socket.id
        });
        initialListUserChat(socket, dispatch);
        addsUserIntoTotalChat(socket, dispatch);
        addsMessageIntoTotalChat(socket, dispatch);
    });

    socket.on('disconnect', (message) => {
        console.log('disconnect')
    });
};


export const AddsUserIntoTotalChat = ({name}) => {
    Socket.emit("ADDS_USER_INTO_TOTAL_CHAT", {name})
};

export const AddsMessageIntoTotalChat = (message) => {
    return (dispatch, state) => {
        message = {
            text: message, id: Socket.id, ...state().users[Socket.id]
        };
        Socket.emit("MESSAGE_FOR_TOTAL_CHAT", message)
    }
};

const initialListUserChat = (socket, dispatch) => {
    socket.on('ROOM_TOTAL_CHAT_LIST_USERS', (list) => {
        dispatch({
            type: 'ROOM_TOTAL_CHAT_LIST_USERS',
            list
        })
    })
};

const addsUserIntoTotalChat = (socket, dispatch) => {
    socket.on('ADDS_USER_INTO_TOTAL_CHAT', ({name, id}) => {
        dispatch({
            type: 'ADDS_USER_INTO_TOTAL_CHAT',
            name,
            id
        })
    })
};
const addsMessageIntoTotalChat = (socket, dispatch) => {
    socket.on('MESSAGE_FOR_TOTAL_CHAT', (message) => {
        dispatch({
            type: 'MESSAGE_FOR_TOTAL_CHAT',
            message
        })
    })
};