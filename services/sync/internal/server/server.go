package server

import (
	"net/http"

	"github.com/bimodwien/full-notion-like/services/sync/internal/config"
	"github.com/bimodwien/full-notion-like/services/sync/internal/hub"
)

func New(cfg config.Config, h *hub.Hub) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", health)
	mux.Handle("GET /ws/{documentId}", wsHandler(cfg.WebOrigin, h))
	return mux
}

func health(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok"))
}
