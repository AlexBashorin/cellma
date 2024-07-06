package dispatcher

type OtherUsers struct {
	UserID      string `json:"user_id"`
	ByteArrUser []byte `json:"byte_arr_user"`
}

type ResendData struct {
	UserGetterID string       `json:"user_getter_id"`
	OthUsers     []OtherUsers `json:"other_users"`
}

func Dispatcher(currentUserID string) []OtherUsers {
	var othUsers []OtherUsers

	return othUsers
}
