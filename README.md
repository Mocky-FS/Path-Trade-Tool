# 📊 Path of Exile 2 Profit Calculator

Welcome to the Path of Exile 2 Profit Calculator! This tool helps you optimize your trades by calculating potential profits based on item prices.

## ✨ Features

-   **Intuitive Profit Calculation:** Enter the items you wish to sell and buy, and the tool will automatically calculate your profit or loss.
-   **Smart Autocompletion:** Quickly find items using the autocompletion feature.
-   **Price Editor:** Easily modify item prices to adapt to the current market.
-   **Save and Load Functionality:** Save your custom prices locally in your browser and import/export them via JSON files.
-   **Visual Profit Indicator:** Get a clear overview of your transactions with profit, loss, or break-even indicators.

## 🚀 How to Use

1.  **Launch the Tool:** Open `index.html` in your browser (the easiest way is to use an extension like Live Server for VS Code).
2.  **Manage Prices:**
    -   Click on "📝 EDIT PRICES" to adjust item values.
    -   Use "💾 SAVE PRICES" to store your changes locally.
    -   "📁 LOAD PRICES" allows you to import an existing JSON price file, and the tool will also generate a JSON file that you can export to save your prices.
3.  **Calculate Profits:**
    -   In the "💰 ITEM TO SELL" section, start typing the name of the item you want to sell. Autocompletion will help you find it.
    -   Set the quantity of the item to sell.
    -   Do the same for the "💸 COST TO BUY" section.
    -   The "⚖️ RESULT" will automatically display, indicating your profit or loss.

## 🛠️ Development

This project is built with standard web technologies (HTML, CSS, JavaScript) and uses a modular approach for easy maintenance.

### File Structure

-   `index.html`: The main structure of the application.
-   `js/`: Contains all JavaScript scripts.
    -   `app.js`: Main entry point of the application.
    -   `autocomplete.js`: Manages autocompletion logic.
    -   `calculator.js`: Contains the profit calculation logic.
    -   `config.js`: Global application configurations.
    -   `priceEditor.js`: Manages the price editing interface.
    -   `storage.js`: Handles data persistence via `localStorage`.
    -   `defaultItems.json`: Contains the list of default items and their prices.
-   `styles/`: Contains CSS files for layout and styling.

## 🤝 Contribution

Contributions are welcome! If you have ideas for improvement, bug fixes, or new features to suggest, feel free to submit a pull request or open an issue.

# Path-Trade-Tool
