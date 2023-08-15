package result

//go:generate go run -mod=mod golang.org/x/tools/cmd/stringer -type=ErrorCode

type ErrorCode int

const (
	Ok ErrorCode = iota
	Unauthorized
	AuthTokenExpired
	SystemError
	ValidateFail
	UsernameExist
	LoginFail
)
