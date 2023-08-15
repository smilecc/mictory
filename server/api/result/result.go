package result

type Result[T interface{}] struct {
	Code    ErrorCode `json:"code"`
	Error   string    `json:"error"`
	Message string    `json:"message"`
	Data    T         `json:"data"`
}

func NewOkResult[T interface{}](data *T) Result[*T] {
	return Result[*T]{
		Code:    Ok,
		Error:   Ok.String(),
		Message: Ok.String(),
		Data:    data,
	}
}

func NewFailResult(code ErrorCode) Result[*interface{}] {
	return Result[*interface{}]{
		Code:  code,
		Error: code.String(),
		Data:  nil,
	}
}

func NewErrorResult(err error) Result[*interface{}] {
	return Result[*interface{}]{
		Code:  SystemError,
		Error: err.Error(),
		Data:  nil,
	}
}

func NewFailResultWithMessage(code ErrorCode, message string) Result[*interface{}] {
	return Result[*interface{}]{
		Code:    code,
		Error:   code.String(),
		Message: message,
		Data:    nil,
	}
}
