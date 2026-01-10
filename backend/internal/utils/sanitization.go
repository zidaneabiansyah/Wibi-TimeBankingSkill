package utils

import (
	"github.com/microcosm-cc/bluemonday"
)

var (
	// StrictPolicy removes all HTML tags
	StrictPolicy = bluemonday.StrictPolicy()

	// UGCPolicy allows basic formatting for user-generated content
	UGCPolicy = bluemonday.UGCPolicy()
)

// SanitizeHTML removes dangerous HTML tags and attributes
func SanitizeHTML(input string) string {
	return UGCPolicy.Sanitize(input)
}

// SanitizeStrict removes ALL HTML tags
func SanitizeStrict(input string) string {
	return StrictPolicy.Sanitize(input)
}
