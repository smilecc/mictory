// Code generated by "stringer -type=ErrorCode"; DO NOT EDIT.

package result

import "strconv"

func _() {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	var x [1]struct{}
	_ = x[Ok-0]
	_ = x[ValidateFail-1]
	_ = x[UsernameExist-2]
	_ = x[LoginFail-3]
}

const _ErrorCode_name = "OkValidateFailUsernameExistLoginFail"

var _ErrorCode_index = [...]uint8{0, 2, 14, 27, 36}

func (i ErrorCode) String() string {
	if i < 0 || i >= ErrorCode(len(_ErrorCode_index)-1) {
		return "ErrorCode(" + strconv.FormatInt(int64(i), 10) + ")"
	}
	return _ErrorCode_name[_ErrorCode_index[i]:_ErrorCode_index[i+1]]
}
