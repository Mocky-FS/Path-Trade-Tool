package models

import "time"

// Currency represents a PoE2 currency with its value in Exalted Orbs
type Currency struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	ShortName    string    `json:"short_name"`
	ExaltedValue float64   `json:"exalted_value"`
	LastUpdated  time.Time `json:"last_updated"`
}