package getter

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func GetStreamData(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not upgrade to WebSocket", http.StatusInternalServerError)
		return
	}
	defer conn.Close()

	var byteD []byte

	for {
		messageType, byteData, err := conn.ReadMessage()
		if err != nil {
			return
		}

		byteD = append(byteD, byteData...)
		fmt.Printf("was sent: %v", byteD)

		if err := conn.WriteMessage(messageType, byteData); err != nil {
			return
		}
	}
}
