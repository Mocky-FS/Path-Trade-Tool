package database

import "github.com/Mocky-FS/Path-Trade-Tool/internal/models"

// CurrencyRepository defines methods to interact with currency data
// This is a "port" in Clean Architecture (interface)
type CurrencyRepository interface {
	GetAll() ([]models.Currency, error)
	GetByShortName(shortName string) (*models.Currency, error)
}