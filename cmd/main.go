package main

import (
	"log"
	"net/http"

	"cellma/internal/sendler"
)

func main() {
	fs := http.FileServer(http.Dir("/app/cmd/static"))
	http.Handle("/", fs)
	http.HandleFunc("/sendstream", sendler.SendVideoStream)
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}
}
