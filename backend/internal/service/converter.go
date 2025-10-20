package service

import (
	"fmt"

	"github.com/Mocky-FS/Path-Trade-Tools/internal/database"
)

// ConverterService handles currency conversion logic
type ConverterService struct {
	repo database.CurrencyRepository
}

// NewConverterService creates a new converter service
func NewConverterService(repo database.CurrencyRepository) *ConverterService {
	return &ConverterService{
		repo: repo,
	}
}

// ConversionResult holds the result of a currency conversion
type ConversionResult struct {
	From         string  `json:"from"`
	To           string  `json:"to"`
	Amount       float64 `json:"amount"`
	Result       float64 `json:"result"`
	FromPrice    float64 `json:"from_price"`
	ToPrice      float64 `json:"to_price"`
	ExchangeRate float64 `json:"exchange_rate"`
}

// Convert converts an amount from one currency to another
// All conversions go through Exalted Orbs as the base currency
func (s *ConverterService) Convert(fromShortName, toShortName string, amount float64) (*ConversionResult, error) {
	// Validate amount
	if amount <= 0 {
		return nil, fmt.Errorf("amount must be greater than 0")
	}

	// Get source currency
	fromCurrency, err := s.repo.GetByShortName(fromShortName)
	if err != nil {
		return nil, fmt.Errorf("source currency '%s' not found", fromShortName)
	}

	// Get target currency
	toCurrency, err := s.repo.GetByShortName(toShortName)
	if err != nil {
		return nil, fmt.Errorf("target currency '%s' not found", toShortName)
	}

	// Convert: FROM → Exalted → TO
	// Step 1: Convert FROM to Exalted
	amountInExalted := amount * fromCurrency.ExaltedValue

	// Step 2: Convert Exalted to TO
	result := amountInExalted / toCurrency.ExaltedValue

	// Calculate exchange rate (how many TO for 1 FROM)
	exchangeRate := fromCurrency.ExaltedValue / toCurrency.ExaltedValue

	return &ConversionResult{
		From:         fromCurrency.ShortName,
		To:           toCurrency.ShortName,
		Amount:       amount,
		Result:       result,
		FromPrice:    fromCurrency.ExaltedValue,
		ToPrice:      toCurrency.ExaltedValue,
		ExchangeRate: exchangeRate,
	}, nil
}