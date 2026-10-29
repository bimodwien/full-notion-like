package hub

import "testing"

func TestReadOnlyAllows(t *testing.T) {
	tests := []struct {
		name string
		msg  []byte
		want bool
	}{
		{"sync step 1", []byte{0, 0, 9}, true},
		{"sync step 2", []byte{0, 1, 9}, false},
		{"sync update", []byte{0, 2, 9}, false},
		{"sync without step", []byte{0}, false},
		{"awareness", []byte{1, 9}, true},
		{"query awareness", []byte{3}, true},
		{"auth", []byte{2, 0}, false},
		{"empty", []byte{}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := readOnlyAllows(tt.msg); got != tt.want {
				t.Errorf("readOnlyAllows(%v) = %v, want %v", tt.msg, got, tt.want)
			}
		})
	}
}
