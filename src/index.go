package main

import (
	"log"
	"net/http"

	"github.com/googollee/go-socket.io"
	"github.com/rs/cors"
	events "./socket"
)

func main() {
	mux := http.NewServeMux()

	// cors.Default() setup the middleware with default options being
	// all origins accepted with simple methods (GET, POST). See
	// documentation below for more options.

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}

	mux.HandleFunc("/socket.io/", func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding")
		}
		server.ServeHTTP(w, r)
	})
	//add events for socket [connect, disconnect ...]
	events.Add(server)

	mux.Handle("/", http.FileServer(http.Dir("./assets/build")))

	// provide default cors to the mux
	handler := cors.Default().Handler(mux)

	c := cors.AllowAll()

	// decorate existing handler with cors functionality set in c
	handler = c.Handler(handler)

	log.Println("Serving at localhost:5000...")
	log.Fatal(http.ListenAndServe(":5000", handler))
}