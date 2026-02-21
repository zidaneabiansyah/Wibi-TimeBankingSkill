package logger

import (
	"os"
	"log/slog"
)

// log contains the slog instance
var log *slog.Logger

// Init initializes the logger
func Init(env string) {
	var handler slog.Handler

	if env == "production" {
		handler = slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelInfo,
		})
	} else {
		handler = slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelDebug,
		})
	}

	log = slog.New(handler)
	slog.SetDefault(log) // Set global default
}

// Info logs an informational message
func Info(msg string, args ...any) {
	if log == nil { return }
	log.Info(msg, args...)
}

// Error logs an error message
func Error(msg string, args ...any) {
	if log == nil { return }
	log.Error(msg, args...)
}

// Debug logs a debug message
func Debug(msg string, args ...any) {
	if log == nil { return }
	log.Debug(msg, args...)
}

// Warn logs a warning message
func Warn(msg string, args ...any) {
	if log == nil { return }
	log.Warn(msg, args...)
}

// With returns a Logger that includes the given attributes in each output operation.
func With(args ...any) *slog.Logger {
	if log == nil { return slog.Default() }
	return log.With(args...)
}
