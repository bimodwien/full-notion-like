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
		code, denied := closeCode(err)
		if err != nil && !denied {
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
		if denied {
			conn.Close(code, "access denied")
			return
		}
		conn.SetReadLimit(maxMessageSize)

		canWrite := role == "OWNER" || role == "EDITOR"
		log.Printf("ws open: %s (%s)", documentID, role)
		h.Serve(r.Context(), documentID, conn, canWrite)
		log.Printf("ws closed: %s", documentID)
	}
}

func rejectAccess(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, auth.ErrUnauthorized):
		http.Error(w, "sign in to open this page", http.StatusUnauthorized)
	default:
		log.Printf("access check failed: %v", err)
		http.Error(w, "could not check access", http.StatusBadGateway)
	}
}

// closeCode picks a close code for denials that retrying won't fix. Browsers
// hide a rejected upgrade's HTTP status, and y-websocket stops on 4400-4499.
func closeCode(err error) (websocket.StatusCode, bool) {
	switch {
	case errors.Is(err, auth.ErrForbidden):
		return 4403, true
	case errors.Is(err, auth.ErrNotFound):
		return 4404, true
	}
	return 0, false
}
