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
