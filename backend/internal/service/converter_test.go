package service

import (
	"testing"
	"time"

	"github.com/Mocky-FS/Path-Trade-Tools/internal/models"
)

// MockRepository for testing
type MockRepository struct {
	currencies map[string]*models.Currency
}

func (m *MockRepository) GetAll() ([]models.Currency, error) {
	result := make([]models.Currency, 0, len(m.currencies))
	for _, c := range m.currencies {
		result = append(result, *c)
	}
	return result, nil
}

func (m *MockRepository) GetByShortName(shortName string) (*models.Currency, error) {
	if currency, ok := m.currencies[shortName]; ok {
		return currency, nil
	}
	return nil, nil
}

func TestConvert_DivineToExalted(t *testing.T) {
	// Setup mock repo
	mockRepo := &MockRepository{
		currencies: map[string]*models.Currency{
			"divine": {
				ID:           1,
				Name:         "Divine Orb",
				ShortName:    "divine",
				ExaltedValue: 400.0,
				LastUpdated:  time.Now(),
			},
			"exalt": {
				ID:           2,
				Name:         "Exalted Orb",
				ShortName:    "exalt",
				ExaltedValue: 1.0,
				LastUpdated:  time.Now(),
			},
		},
	}

	// Create service
	converter := NewConverterService(mockRepo)

	// Test conversion
	result, err := converter.Convert("divine", "exalt", 3)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if result.Result != 1200.0 {
		t.Errorf("Expected 1200, got %f", result.Result)
	}

	if result.ExchangeRate != 400.0 {
		t.Errorf("Expected exchange rate 400, got %f", result.ExchangeRate)
	}
}

func TestConvert_DivineToChaos(t *testing.T) {
	mockRepo := &MockRepository{
		currencies: map[string]*models.Currency{
			"divine": {
				ID:           1,
				Name:         "Divine Orb",
				ShortName:    "divine",
				ExaltedValue: 400.0,
				LastUpdated:  time.Now(),
			},
			"chaos": {
				ID:           3,
				Name:         "Chaos Orb",
				ShortName:    "chaos",
				ExaltedValue: 0.5,
				LastUpdated:  time.Now(),
			},
		},
	}

	converter := NewConverterService(mockRepo)
	result, err := converter.Convert("divine", "chaos", 3)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// 3 Divine = 1200 Exalted = 2400 Chaos
	if result.Result != 2400.0 {
		t.Errorf("Expected 2400, got %f", result.Result)
	}
}

func TestConvert_InvalidAmount(t *testing.T) {
	mockRepo := &MockRepository{
		currencies: map[string]*models.Currency{},
	}

	converter := NewConverterService(mockRepo)
	_, err := converter.Convert("divine", "chaos", 0)

	if err == nil {
		t.Error("Expected error for zero amount, got nil")
	}
}