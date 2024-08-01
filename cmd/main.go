package main

import (
	"log"
	"net/http"

	"cellma/internal/getter"
	"cellma/internal/jwt_auth"
	"cellma/internal/sendler"
)

func main() {

	// fs := http.FileServer(http.Dir("/app/cmd/static"))
	fs := http.FileServer(http.Dir("./static"))

	// router := mux.NewRouter()

	// router.PathPrefix("./static/").Handler(http.StripPrefix("./static/", http.FileServer(http.Dir("./static"))))

	// router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "./static/")
	// })

	http.Handle("/", fs)

	http.HandleFunc("/login", jwt_auth.LoginHandler)
	http.HandleFunc("/protected", jwt_auth.ProtectedHandler)

	http.HandleFunc("/getstream", getter.GetStreamData)
	http.HandleFunc("/sendstream", sendler.SendVideoStream)

	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}
}
