package server

import (
	"net/http"

	"github.com/bimodwien/full-notion-like/services/sync/internal/auth"
	"github.com/bimodwien/full-notion-like/services/sync/internal/config"
	"github.com/bimodwien/full-notion-like/services/sync/internal/hub"
)

func New(cfg config.Config, h *hub.Hub) http.Handler {
	access := auth.NewAccess(cfg.APIURL)
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", health)
	mux.Handle("GET /ws/{workspaceId}/{documentId}", wsHandler(cfg.WebOrigin, h, access))
	return mux
}

func health(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok"))
}
