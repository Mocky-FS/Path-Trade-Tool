# Path Trade Tools

> Convert Path of Exile 2 currency prices to Exalted Orbs and detect profitable trades.

![Version](https://img.shields.io/badge/version-2.0.0-blue) ![Go](https://img.shields.io/badge/Go-1.25.3-00ADD8) ![Angular](https://img.shields.io/badge/Angular-20-DD0031)

---

## What is this?

A desktop overlay + API that helps PoE2 players:
- Convert any currency to Exalted Orbs
- Detect bad deals
- Find profitable trades

**Example**: Trading 3 Annulments for 1 Divine?  
→ You lose 200 Exalted (-33%) ❌

---

## Quick Start

```bash
# Clone
git clone https://github.com/Mocky-FS/Path-Trade-Tool.git
cd Path-Trade-Tool
git checkout v2-development

# Run backend
cd backend
make run

# Test
curl http://localhost:8080/api/health
```

---

## Tech Stack

- **Backend**: Go 1.25.3 + Fiber v3 + SQLite
- **Frontend**: Angular 20 + Tauri 2.0 + Tailwind CSS

---

## Commands

```bash
make run      # Start server
make build    # Compile binary
make test     # Run tests
make clean    # Clean builds
```

---

## API

```bash
# Health
GET /api/health

# Prices
GET /api/prices

# Convert
GET /api/convert?from=divine&to=exalt&amount=3
```

---

## Roadmap

- [x] Backend API (Go + Fiber)
- [ ] Database schema
- [ ] Tauri overlay
- [ ] Auto-scraping
- [ ] Opportunity finder

Full roadmap: [GitHub Projects](https://github.com/users/Mocky-FS/projects/4)

---

## Contributing

🚧 Early development - contributions open in Phase 3+

For now:
- ⭐ Star the repo
- 🐛 Report bugs
- 💡 Suggest features

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## License

MIT License - see [LICENSE](LICENSE)

---

## Contact

- **GitHub**: [@Mocky-FS](https://github.com/Mocky-FS)
- **Issues**: [Report here](https://github.com/Mocky-FS/Path-Trade-Tool/issues)

---

⭐ **Star if useful!**