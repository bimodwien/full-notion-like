package server

import (
	"errors"
	"log"
	"net/http"

	"github.com/bimodwien/full-notion-like/services/sync/internal/auth"
	"github.com/bimodwien/full-notion-like/services/sync/internal/hub"
	"github.com/coder/websocket"
)

const maxMessageSize = 2 << 20

func wsHandler(webOrigin string, h *hub.Hub, access *auth.Access) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		workspaceID := r.PathValue("workspaceId")
		documentID := r.PathValue("documentId")
		role, err := access.Role(r, workspaceID, documentID)
		if err != nil {
			rejectAccess(w, err)
			return
		}

		conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
			OriginPatterns: []string{webOrigin},
		})
		if err != nil {
			return
		}
		defer conn.CloseNow()
		conn.SetReadLimit(maxMessageSize)

		log.Printf("ws open: %s (%s)", documentID, role)
		h.Serve(r.Context(), documentID, conn)
		log.Printf("ws closed: %s", documentID)
	}
}

func rejectAccess(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, auth.ErrUnauthorized):
		http.Error(w, "sign in to open this page", http.StatusUnauthorized)
	case errors.Is(err, auth.ErrForbidden):
		http.Error(w, "you are not a member of this workspace", http.StatusForbidden)
	case errors.Is(err, auth.ErrNotFound):
		http.Error(w, "page not found", http.StatusNotFound)
	default:
		log.Printf("access check failed: %v", err)
		http.Error(w, "could not check access", http.StatusBadGateway)
	}
}
