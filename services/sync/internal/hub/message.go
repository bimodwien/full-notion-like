package hub

// y-websocket puts the message type in the first byte and, for sync
// messages, the sync step in the second. All values fit in one byte.
const (
	messageSync           = 0
	messageAwareness      = 1
	messageQueryAwareness = 3

	syncStep1 = 0
)

// readOnlyAllows reports whether a client without write access may send msg:
// asking for the document and sharing presence, but never changing content.
func readOnlyAllows(msg []byte) bool {
	if len(msg) == 0 {
		return false
	}
	switch msg[0] {
	case messageSync:
		return len(msg) >= 2 && msg[1] == syncStep1
	case messageAwareness, messageQueryAwareness:
		return true
	}
	return false
}
