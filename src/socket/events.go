package socket

import (
	"github.com/googollee/go-socket.io"
	"log"
)

const (
	MESSAGE_FOR_TOTAL_CHAT     = "MESSAGE_FOR_TOTAL_CHAT"
	ADDS_USER_INTO_TOTAL_CHAT  = "ADDS_USER_INTO_TOTAL_CHAT"
	ROOM_TOTAL_CHAT            = "ROOM_TOTAL_CHAT"
	ROOM_TOTAL_CHAT_LIST_USERS = "ROOM_TOTAL_CHAT_LIST_USERS"
)

type user struct {
	Name string `json:"name"`
	Id   string `json:"id"`
}

type message struct {
	*user
	Text string `json:"text"`
}

var Users = []user{
}
var Messages = []message{
}

func addNewUser(user user) {
	Users = append(Users, user)
}
func addMessages(message message) {
	Messages = append(Messages, message)
}
func deleteUser(userId string) {
	users := []user{}
	for index, user := range Users {
		if user.Id == userId {
			if len(Users) > 1 {
				users = append(Users[:index], Users[index+1:]...)
			} else {
				users = append(Users[:index])
			}
			log.Println("remove user:", Users)
		}
	}

	Users = users
}

func Add(server *socketio.Server) {
	server.On("connection", func(so socketio.Socket) {
		log.Println("on connection")
		////added user to total chat
		so.Join(ROOM_TOTAL_CHAT)
		so.Emit(ROOM_TOTAL_CHAT_LIST_USERS, Users)

		so.On(ADDS_USER_INTO_TOTAL_CHAT, func(msg user) {
			newUser := user{
				Name: msg.Name,
				Id:   so.Id(),
			}
			addNewUser(newUser)
			//send myself
			so.Emit(ADDS_USER_INTO_TOTAL_CHAT, newUser)
			so.BroadcastTo(ROOM_TOTAL_CHAT, ADDS_USER_INTO_TOTAL_CHAT, newUser)

			log.Println(ADDS_USER_INTO_TOTAL_CHAT, "messages:", msg)
		})
		//message total chat
		so.On(MESSAGE_FOR_TOTAL_CHAT, func(msg message) {
			addMessages(msg)
			so.Emit(MESSAGE_FOR_TOTAL_CHAT, msg)
			so.BroadcastTo(ROOM_TOTAL_CHAT, MESSAGE_FOR_TOTAL_CHAT, msg)
			log.Println(MESSAGE_FOR_TOTAL_CHAT, " recieved message", msg)
		})

		so.On("disconnection", func(rrr string) {
			deleteUser(so.Id())
			so.BroadcastTo(ROOM_TOTAL_CHAT, ROOM_TOTAL_CHAT_LIST_USERS, Users)
			log.Println("disconnected from chat", so.Id())
		})
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})
}
