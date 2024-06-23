package main

import (
	"log"
	"net/http"

	"cellma/internal/getter"
	"cellma/internal/sendler"
)

func main() {
	// fs := http.FileServer(http.Dir("/app/cmd/static"))
	fs := http.FileServer(http.Dir("./static"))

	http.Handle("/", fs)
	http.HandleFunc("/getstream", getter.GetStreamData)
	http.HandleFunc("/sendstream", sendler.SendVideoStream)

	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}
}
