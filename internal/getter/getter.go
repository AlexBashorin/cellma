package getter

import (
	"fmt"
	"log"
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

		w.Header().Set("Content-Type", "video/mp4")
		w.Header().Set("Content-Disposition", "inline; filename=video.mp4")

		w, err := conn.NextWriter(messageType)
		if err != nil {
			log.Fatal(err)
			return
		}
		w.Write(byteData)

		if err := conn.WriteMessage(messageType, byteData); err != nil {
			return
		}
	}
}
