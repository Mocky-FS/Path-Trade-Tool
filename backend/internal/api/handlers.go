package api

import (
	"log"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/Mocky-FS/Path-Trade-Tools/internal/database"
	"github.com/Mocky-FS/Path-Trade-Tools/internal/service"
)

// Handler holds dependencies for API handlers
type Handler struct {
	repo      database.CurrencyRepository
	converter *service.ConverterService
}

// NewHandler creates a new API handler with dependencies
func NewHandler(repo database.CurrencyRepository, converter *service.ConverterService) *Handler {
	return &Handler{
		repo:      repo,
		converter: converter,
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

// ConvertCurrency converts an amount from one currency to another
// GET /api/convert?from=divine&to=exalt&amount=3
func (h *Handler) ConvertCurrency(c fiber.Ctx) error {
	// Get query parameters
	from := c.Query("from")
	to := c.Query("to")
	amountStr := c.Query("amount")

	// Validate inputs
	if from == "" || to == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Parameters 'from' and 'to' are required",
		})
	}

	if amountStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Parameter 'amount' is required",
		})
	}

	// Convert amount to float
	amount, err := strconv.ParseFloat(amountStr, 64)
	if err != nil || amount <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Parameter 'amount' must be a valid number greater than 0",
		})
	}

	// Call the converter service
	result, err := h.converter.Convert(from, to, amount)
	if err != nil {
		log.Printf("Conversion error: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Return the conversion result
	return c.JSON(result)
}