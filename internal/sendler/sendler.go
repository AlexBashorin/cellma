package sendler

import (
	"fmt"
	"net/http"
)

func SendVideoStream(w http.ResponseWriter, r *http.Request) {
	fmt.Println("it was sent")
}
