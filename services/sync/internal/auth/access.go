package auth

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"time"
)

const accessCookie = "access_token"

var (
	ErrUnauthorized = errors.New("not signed in")
	ErrForbidden    = errors.New("not a member of this workspace")
	ErrNotFound     = errors.New("document not found")
)

type Access struct {
	apiURL string
	client *http.Client
}

func NewAccess(apiURL string) *Access {
	return &Access{
		apiURL: apiURL,
		client: &http.Client{Timeout: 5 * time.Second},
	}
}

// Role forwards the browser's session cookie to the API, so the JWT secret
// stays in the API and this service never verifies tokens itself.
func (a *Access) Role(r *http.Request, workspaceID, documentID string) (string, error) {
	cookie, err := r.Cookie(accessCookie)
	if err != nil {
		return "", ErrUnauthorized
	}
	endpoint := fmt.Sprintf("%s/workspaces/%s/documents/%s/access",
		a.apiURL, url.PathEscape(workspaceID), url.PathEscape(documentID))
	req, err := http.NewRequestWithContext(r.Context(), http.MethodGet, endpoint, nil)
	if err != nil {
		return "", err
	}
	req.AddCookie(cookie)

	res, err := a.client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	return readRole(res)
}

func readRole(res *http.Response) (string, error) {
	switch res.StatusCode {
	case http.StatusOK:
	case http.StatusUnauthorized:
		return "", ErrUnauthorized
	case http.StatusForbidden:
		return "", ErrForbidden
	case http.StatusBadRequest, http.StatusNotFound:
		return "", ErrNotFound
	default:
		return "", fmt.Errorf("access check: unexpected status %d", res.StatusCode)
	}

	var body struct {
		Role string `json:"role"`
	}
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		return "", fmt.Errorf("access check: %w", err)
	}
	return body.Role, nil
}
