package hub

import (
	"context"

	"github.com/coder/websocket"
)

const sendBuffer = 64

type Client struct {
	conn *websocket.Conn
	send chan []byte
}

func newClient(conn *websocket.Conn) *Client {
	return &Client{conn: conn, send: make(chan []byte, sendBuffer)}
}

func (c *Client) writeLoop(ctx context.Context) {
	defer c.conn.CloseNow()
	for msg := range c.send {
		if err := c.conn.Write(ctx, websocket.MessageBinary, msg); err != nil {
			return
		}
	}
}
