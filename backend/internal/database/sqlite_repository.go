package database

import (
	"database/sql"
	"fmt"

	"github.com/Mocky-FS/Path-Trade-Tool/internal/models"
)

// SQLiteRepository implements CurrencyRepository for SQLite
type SQLiteRepository struct {
	db *sql.DB
}

// NewSQLiteRepository creates a new SQLite repository
func NewSQLiteRepository(db *sql.DB) CurrencyRepository {
	return &SQLiteRepository{db: db}
}

// GetAll retrieves all currencies from the database
func (r *SQLiteRepository) GetAll() ([]models.Currency, error) {
	query := `
		SELECT id, name, short_name, exalted_value, last_updated
		FROM currencies
		ORDER BY exalted_value DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query currencies: %w", err)
	}
	defer rows.Close()

	var currencies []models.Currency

	for rows.Next() {
		var c models.Currency
		if err := rows.Scan(&c.ID, &c.Name, &c.ShortName, &c.ExaltedValue, &c.LastUpdated); err != nil {
			return nil, fmt.Errorf("failed to scan currency: %w", err)
		}
		currencies = append(currencies, c)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return currencies, nil
}

// GetByShortName retrieves a single currency by its short name
func (r *SQLiteRepository) GetByShortName(shortName string) (*models.Currency, error) {
	query := `
		SELECT id, name, short_name, exalted_value, last_updated
		FROM currencies
		WHERE short_name = ?
	`

	var c models.Currency
	err := r.db.QueryRow(query, shortName).Scan(
		&c.ID, &c.Name, &c.ShortName, &c.ExaltedValue, &c.LastUpdated,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("currency not found: %s", shortName)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to get currency: %w", err)
	}

	return &c, nil
}