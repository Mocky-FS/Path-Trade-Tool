package main

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/Mocky-FS/Path-Trade-Tools/internal/api"
	"github.com/Mocky-FS/Path-Trade-Tools/internal/database"
	"github.com/Mocky-FS/Path-Trade-Tools/internal/service"
)

func main() {
	// Initialize database
	db, err := database.InitDB("./data.db")
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	// Create repository (Infrastructure layer)
	repo := database.NewSQLiteRepository(db)

	// Create services (Application layer)
	converterService := service.NewConverterService(repo)

	// Create API handler (Presentation layer)
	handler := api.NewHandler(repo, converterService)

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Path Trade Tools API v2.0",
	})

	// Health check endpoint
	app.Get("/api/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":   "ok",
			"message":  "Path Trade Tools API is running",
			"version":  "2.0.0",
			"database": "connected",
		})
	})

	// Currency endpoints
	app.Get("/api/prices", handler.GetAllPrices)
	app.Get("/api/prices/:currency", handler.GetPriceByName)
	app.Get("/api/convert", handler.ConvertCurrency)

	// Start server
	log.Println("🚀 Server starting on http://localhost:8080")
	log.Println("📊 Endpoints:")
	log.Println("   GET /api/health")
	log.Println("   GET /api/prices")
	log.Println("   GET /api/prices/:currency")
	log.Println("   GET /api/convert?from=X&to=Y&amount=Z")

	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}