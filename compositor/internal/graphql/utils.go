package graph

import (
	"encoding/base64"
	"github.com/google/uuid"
)

// EncodeCursor encodes an ID to a cursor
func EncodeCursor(id uuid.UUID) string {
	return base64.StdEncoding.EncodeToString([]byte(id.String()))
}

// DecodeCursor decodes a cursor to an ID
func DecodeCursor(cursor *string) *string {
	if cursor == nil {
		return nil
	}
	decoded, err := base64.StdEncoding.DecodeString(*cursor)
	if err != nil {
		return nil
	}
	decodedStr := string(decoded)
	return &decodedStr
}
