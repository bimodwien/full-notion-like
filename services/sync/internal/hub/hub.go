package hub

import (
	"context"
	"sync"

	"github.com/coder/websocket"
)

type Hub struct {
	mu    sync.Mutex
	rooms map[string]*Room
}

func New() *Hub {
	return &Hub{rooms: make(map[string]*Room)}
}

// Serve relays conn's messages to the other clients on the same document
// and blocks until the connection closes.
func (h *Hub) Serve(ctx context.Context, documentID string, conn *websocket.Conn) {
	c := newClient(conn)
	room := h.join(documentID, c)
	defer h.leave(documentID, c)

	go c.writeLoop(ctx)

	for {
		_, msg, err := conn.Read(ctx)
		if err != nil {
			return
		}
		room.broadcast(c, msg)
	}
}

func (h *Hub) join(documentID string, c *Client) *Room {
	h.mu.Lock()
	defer h.mu.Unlock()
	room, ok := h.rooms[documentID]
	if !ok {
		room = newRoom()
		h.rooms[documentID] = room
	}
	room.add(c)
	return room
}

func (h *Hub) leave(documentID string, c *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if room, ok := h.rooms[documentID]; ok && room.remove(c) {
		delete(h.rooms, documentID)
	}
}
