package database

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

// InitDB initializes the database connection and runs migrations
func InitDB(dbPath string) (*sql.DB, error) {
	// Open database
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, err
	}

	// Test connection
	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("✅ Database connection established")

	// Run migrations
	if err := RunMigrations(db); err != nil {
		return nil, err
	}

	return db, nil
}
