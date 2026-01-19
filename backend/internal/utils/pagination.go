package utils

import (
	"encoding/base64"
	"encoding/json"
	"strconv"
	"time"
)

// CursorPagination provides efficient pagination using cursors instead of OFFSET
//
// Benefits over OFFSET pagination:
//   - O(1) performance regardless of page number
//   - Consistent results even with concurrent inserts/deletes
//   - No "skipping" issues when data changes between requests
//   - More efficient database queries using indexes
//
// How it works:
//   - Client sends cursor (encoded last item marker)
//   - Server queries: WHERE id > cursor_id ORDER BY id LIMIT n
//   - Server returns next cursor for subsequent requests
//
// Example API Response:
//
//	{
//	  "items": [...],
//	  "next_cursor": "eyJpZCI6MTAwLCJ0cyI6MTcwNS...}",
//	  "has_more": true
//	}

// Cursor represents a pagination cursor
type Cursor struct {
	ID        uint      `json:"id"`
	Timestamp time.Time `json:"ts,omitempty"`
	SortValue string    `json:"sv,omitempty"` // For custom sort fields
}

// EncodeCursor encodes a cursor to a base64 string for API response
func EncodeCursor(cursor *Cursor) string {
	if cursor == nil {
		return ""
	}

	data, err := json.Marshal(cursor)
	if err != nil {
		return ""
	}

	return base64.URLEncoding.EncodeToString(data)
}

// DecodeCursor decodes a cursor from a base64 string
func DecodeCursor(encoded string) (*Cursor, error) {
	if encoded == "" {
		return nil, nil
	}

	data, err := base64.URLEncoding.DecodeString(encoded)
	if err != nil {
		return nil, err
	}

	var cursor Cursor
	if err := json.Unmarshal(data, &cursor); err != nil {
		return nil, err
	}

	return &cursor, nil
}

// CursorFromID creates a simple ID-based cursor
func CursorFromID(id uint) string {
	return EncodeCursor(&Cursor{ID: id})
}

// CursorFromIDAndTime creates a cursor with ID and timestamp
func CursorFromIDAndTime(id uint, ts time.Time) string {
	return EncodeCursor(&Cursor{ID: id, Timestamp: ts})
}

// PaginatedResult represents a paginated response with cursor
type PaginatedResult[T any] struct {
	Items      []T    `json:"items"`
	NextCursor string `json:"next_cursor,omitempty"`
	HasMore    bool   `json:"has_more"`
	Total      int64  `json:"total,omitempty"` // Optional: only if count is requested
}

// PaginationParams represents pagination parameters from request
type PaginationParams struct {
	Cursor    string
	Limit     int
	SortBy    string
	SortOrder string // "asc" or "desc"
}

// DefaultLimit is the default number of items per page
const DefaultLimit = 20

// MaxLimit is the maximum allowed items per page
const MaxLimit = 100

// ParsePaginationParams parses pagination parameters from query string
//
// Query params:
//   - cursor: Base64 encoded cursor from previous response
//   - limit: Number of items (default: 20, max: 100)
//   - sort_by: Field to sort by (default: id)
//   - sort_order: asc or desc (default: desc for most recent first)
func ParsePaginationParams(cursor, limitStr, sortBy, sortOrder string) PaginationParams {
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = DefaultLimit
	}
	if limit > MaxLimit {
		limit = MaxLimit
	}

	if sortBy == "" {
		sortBy = "id"
	}

	if sortOrder != "asc" && sortOrder != "desc" {
		sortOrder = "desc"
	}

	return PaginationParams{
		Cursor:    cursor,
		Limit:     limit,
		SortBy:    sortBy,
		SortOrder: sortOrder,
	}
}

// BuildCursorQuery returns the WHERE clause and values for cursor-based query
//
// Usage with GORM:
//
//	params := ParsePaginationParams(...)
//	cursor, _ := DecodeCursor(params.Cursor)
//	where, args := BuildCursorQuery(cursor, params.SortBy, params.SortOrder)
//	db.Where(where, args...).Order(orderBy).Limit(params.Limit+1).Find(&items)
func BuildCursorQuery(cursor *Cursor, sortBy, sortOrder string) (string, []interface{}) {
	if cursor == nil {
		return "", nil
	}

	// For descending order (newer first), we want items with ID < cursor
	// For ascending order (older first), we want items with ID > cursor
	operator := "<"
	if sortOrder == "asc" {
		operator = ">"
	}

	if sortBy == "id" {
		return sortBy + " " + operator + " ?", []interface{}{cursor.ID}
	}

	// For timestamp-based sorting with ID tiebreaker
	if !cursor.Timestamp.IsZero() {
		return "(" + sortBy + " " + operator + " ? OR (" + sortBy + " = ? AND id " + operator + " ?))",
			[]interface{}{cursor.Timestamp, cursor.Timestamp, cursor.ID}
	}

	// For other sort values with ID tiebreaker
	if cursor.SortValue != "" {
		return "(" + sortBy + " " + operator + " ? OR (" + sortBy + " = ? AND id " + operator + " ?))",
			[]interface{}{cursor.SortValue, cursor.SortValue, cursor.ID}
	}

	return "id " + operator + " ?", []interface{}{cursor.ID}
}

// BuildOrderClause returns the ORDER BY clause
func BuildOrderClause(sortBy, sortOrder string) string {
	if sortBy == "" {
		sortBy = "id"
	}
	if sortOrder != "asc" && sortOrder != "desc" {
		sortOrder = "desc"
	}

	// Add ID as secondary sort for consistency
	if sortBy != "id" {
		return sortBy + " " + sortOrder + ", id " + sortOrder
	}

	return sortBy + " " + sortOrder
}

// ProcessResults determines if there are more items and creates next cursor
//
// This is a helper that:
//  1. Fetches limit+1 items to check if there are more
//  2. Trims to actual limit
//  3. Creates next cursor from last item
//
// Usage:
//
//	// Fetch limit+1 items
//	db.Limit(params.Limit + 1).Find(&items)
//
//	// Process results
//	items, nextCursor, hasMore := ProcessResults(items, params.Limit)
func ProcessResultsWithID[T interface{ GetID() uint }](items []T, limit int) ([]T, string, bool) {
	hasMore := len(items) > limit
	if hasMore {
		items = items[:limit] // Trim extra item
	}

	nextCursor := ""
	if hasMore && len(items) > 0 {
		lastItem := items[len(items)-1]
		nextCursor = CursorFromID(lastItem.GetID())
	}

	return items, nextCursor, hasMore
}

// IDGetter interface for items that have an ID
type IDGetter interface {
	GetID() uint
}
