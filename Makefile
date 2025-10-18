.PHONY: run build test clean

# Run the server
run: build
	cd backend && ./bin/server.exe

# Build the binary
build:
	cd backend && go build -o bin/server.exe cmd/server/main.go

# Run tests
test:
	cd backend && go test ./...

# Clean build files
clean:
	rm -rf backend/bin

# Create new migration
migration:
	@read -p "Migration name: " name; \
	cd backend/migrations && \
	last=$$(ls -1 | grep "^[0-9]" | tail -1 | cut -d_ -f1 || echo "000000"); \
	next=$$(printf "%06d" $$((10#$$last + 1))); \
	touch "$${next}_$${name}.up.sql" "$${next}_$${name}.down.sql"; \
	echo "✅ Created backend/migrations/$${next}_$${name}.up.sql"; \
	echo "✅ Created backend/migrations/$${next}_$${name}.down.sql"
