package hub

import "sync"

type Room struct {
	mu      sync.Mutex
	clients map[*Client]struct{}
}

func newRoom() *Room {
	return &Room{clients: make(map[*Client]struct{})}
}

func (r *Room) add(c *Client) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.clients[c] = struct{}{}
}

// remove reports whether the room is empty afterwards.
func (r *Room) remove(c *Client) bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.drop(c)
	return len(r.clients) == 0
}

func (r *Room) broadcast(from *Client, msg []byte) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for c := range r.clients {
		if c == from {
			continue
		}
		select {
		case c.send <- msg:
		default:
			// A full queue means a slow client; dropping it keeps the room fast,
			// and y-websocket resyncs when it reconnects.
			r.drop(c)
		}
	}
}

// drop must be called with mu held.
func (r *Room) drop(c *Client) {
	if _, ok := r.clients[c]; ok {
		delete(r.clients, c)
		close(c.send)
	}
}
