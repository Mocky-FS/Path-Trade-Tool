package api

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/Mocky-FS/Path-Trade-Tool/internal/database"
)

// Handler holds dependencies for API handlers
type Handler struct {
	repo database.CurrencyRepository
}

// NewHandler creates a new API handler with dependencies
func NewHandler(repo database.CurrencyRepository) *Handler {
	return &Handler{
		repo: repo,
	}
}

// GetAllPrices returns all currency prices
// GET /api/prices
func (h *Handler) GetAllPrices(c fiber.Ctx) error {
	currencies, err := h.repo.GetAll()
	if err != nil {
		log.Printf("Error fetching currencies: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch prices",
		})
	}

	// Transform to a map with short_name as key for easier frontend usage
	response := make(map[string]interface{})
	for _, currency := range currencies {
		response[currency.ShortName] = fiber.Map{
			"name":          currency.Name,
			"exalted_value": currency.ExaltedValue,
			"last_updated":  currency.LastUpdated,
		}
	}

	return c.JSON(response)
}

// GetPriceByName returns a single currency price by short name
// GET /api/prices/:currency
func (h *Handler) GetPriceByName(c fiber.Ctx) error {
	shortName := c.Params("currency")

	currency, err := h.repo.GetByShortName(shortName)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Currency not found",
		})
	}

	return c.JSON(fiber.Map{
		"name":          currency.Name,
		"short_name":    currency.ShortName,
		"exalted_value": currency.ExaltedValue,
		"last_updated":  currency.LastUpdated,
	})
}