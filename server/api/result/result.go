package result

type Result[T interface{}] struct {
	Code    ErrorCode `json:"code"`
	Error   string    `json:"error"`
	Message string    `json:"message"`
	Data    T         `json:"data"`
}

func NewSuccessResult[T interface{}](data *T) Result[*T] {
	return Result[*T]{
		Code:    Ok,
		Error:   Ok.String(),
		Message: Ok.String(),
		Data:    data,
	}
}

func NewErrorResult(code ErrorCode) Result[*interface{}] {
	return Result[*interface{}]{
		Code:  code,
		Error: code.String(),
		Data:  nil,
	}
}

func NewErrorResultWithMessage(code ErrorCode, message string) Result[*interface{}] {
	return Result[*interface{}]{
		Code:    code,
		Error:   code.String(),
		Message: message,
		Data:    nil,
	}
}
