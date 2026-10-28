package hub

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/coder/websocket"
)

func TestServeRelaysToOtherClientsOnly(t *testing.T) {
	h := New()
	url := startServer(t, h)
	a := dial(t, url+"/doc1")
	b := dial(t, url+"/doc1")
	waitForClients(t, h, "/doc1", 2)

	send(t, a, "hello")

	if got := receive(t, b); got != "hello" {
		t.Fatalf("b got %q, want %q", got, "hello")
	}
	expectSilence(t, a)
}

func TestServeKeepsDocumentsApart(t *testing.T) {
	h := New()
	url := startServer(t, h)
	a := dial(t, url+"/doc1")
	c := dial(t, url+"/doc2")
	waitForClients(t, h, "/doc1", 1)
	waitForClients(t, h, "/doc2", 1)

	send(t, a, "hello")

	expectSilence(t, c)
}

func TestServeRemovesEmptyRoom(t *testing.T) {
	h := New()
	url := startServer(t, h)
	a := dial(t, url+"/doc1")
	waitForClients(t, h, "/doc1", 1)

	a.Close(websocket.StatusNormalClosure, "")

	waitForClients(t, h, "/doc1", 0)
	h.mu.Lock()
	defer h.mu.Unlock()
	if len(h.rooms) != 0 {
		t.Fatalf("hub still holds %d rooms", len(h.rooms))
	}
}

func startServer(t *testing.T, h *Hub) string {
	t.Helper()
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.Accept(w, r, nil)
		if err != nil {
			return
		}
		defer conn.CloseNow()
		h.Serve(r.Context(), r.URL.Path, conn)
	}))
	t.Cleanup(srv.Close)
	return "ws" + strings.TrimPrefix(srv.URL, "http")
}

func dial(t *testing.T, url string) *websocket.Conn {
	t.Helper()
	conn, _, err := websocket.Dial(context.Background(), url, nil)
	if err != nil {
		t.Fatalf("dial %s: %v", url, err)
	}
	t.Cleanup(func() { conn.CloseNow() })
	return conn
}

func send(t *testing.T, conn *websocket.Conn, msg string) {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	if err := conn.Write(ctx, websocket.MessageBinary, []byte(msg)); err != nil {
		t.Fatalf("send: %v", err)
	}
}

func receive(t *testing.T, conn *websocket.Conn) string {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	_, msg, err := conn.Read(ctx)
	if err != nil {
		t.Fatalf("receive: %v", err)
	}
	return string(msg)
}

// expectSilence fails if conn receives anything within a short window.
func expectSilence(t *testing.T, conn *websocket.Conn) {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()
	if _, msg, err := conn.Read(ctx); err == nil {
		t.Fatalf("unexpected message %q", msg)
	}
}

// waitForClients polls because Dial returns before the server has joined the room.
func waitForClients(t *testing.T, h *Hub, documentID string, want int) {
	t.Helper()
	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		if h.clientCount(documentID) == want {
			return
		}
		time.Sleep(5 * time.Millisecond)
	}
	t.Fatalf("%s never reached %d clients", documentID, want)
}

func (h *Hub) clientCount(documentID string) int {
	h.mu.Lock()
	defer h.mu.Unlock()
	room, ok := h.rooms[documentID]
	if !ok {
		return 0
	}
	room.mu.Lock()
	defer room.mu.Unlock()
	return len(room.clients)
}
