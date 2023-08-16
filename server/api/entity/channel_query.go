package entity

type CreateChannelQuery struct {
	ChannelName string `json:"channelName" validate:"required|min_len:2"`
}
