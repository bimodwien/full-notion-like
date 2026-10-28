package main

import (
	"log"
	"net/http"
	"time"

	"github.com/bimodwien/full-notion-like/services/sync/internal/config"
	"github.com/bimodwien/full-notion-like/services/sync/internal/hub"
	"github.com/bimodwien/full-notion-like/services/sync/internal/server"
)

func main() {
	cfg := config.Load()

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           server.New(cfg, hub.New()),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("sync listening on :%s", cfg.Port)
	log.Fatal(srv.ListenAndServe())
}
