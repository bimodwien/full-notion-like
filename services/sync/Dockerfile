# Build from the repo root: docker build -f services/sync/Dockerfile -t nobimotion-sync .

FROM golang:1.27-alpine AS builder
WORKDIR /src
# Download modules first so code changes don't redo it.
COPY services/sync/go.mod services/sync/go.sum ./
RUN go mod download
COPY services/sync/ .
# Static binary: runs on an image with no libc at all.
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/sync .

# Distroless: just the binary, no shell or package manager; runs as a non-root user.
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /out/sync /sync
ENTRYPOINT ["/sync"]
