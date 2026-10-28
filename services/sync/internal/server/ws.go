package server

import (
	"log"
	"net/http"

	"github.com/bimodwien/full-notion-like/services/sync/internal/hub"
	"github.com/coder/websocket"
)

const maxMessageSize = 2 << 20

func wsHandler(webOrigin string, h *hub.Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
			OriginPatterns: []string{webOrigin},
		})
		if err != nil {
			return
		}
		defer conn.CloseNow()
		conn.SetReadLimit(maxMessageSize)

		documentID := r.PathValue("documentId")
		log.Printf("ws open: %s", documentID)
		h.Serve(r.Context(), documentID, conn)
		log.Printf("ws closed: %s", documentID)
	}
}
