/**
 * Système d'autocomplétion pour les champs de recherche
 */

import { CONFIG } from './config.js';

export class Autocomplete {
    constructor(inputElement, suggestionsElement, storageManager, onItemSelected) {
        this.input = inputElement;
        this.suggestions = suggestionsElement;
        this.storage = storageManager;
        this.onItemSelected = onItemSelected;
        this.highlightedIndex = -1;
        
        this.init();
    }

    /**
     * Initialise les événements d'autocomplétion
     */
    init() {
        this.input.addEventListener('input', this.handleInput.bind(this));
        this.input.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Fermer les suggestions en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.suggestions.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    /**
     * Gère la saisie dans le champ de recherche
     * @param {Event} event - Événement input
     */
    handleInput(event) {
        const query = event.target.value;
        this.highlightedIndex = -1;
        
        if (query.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.showSuggestions(query);
    }

    /**
     * Gère les événements clavier
     * @param {KeyboardEvent} event - Événement clavier
     */
    handleKeydown(event) {
        const suggestionItems = this.suggestions.querySelectorAll('.suggestion-item');
        
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.highlightedIndex = Math.min(
                    this.highlightedIndex + 1, 
                    suggestionItems.length - 1
                );
                this.updateHighlight(suggestionItems);
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
                this.updateHighlight(suggestionItems);
                break;
                
            case 'Enter':
                event.preventDefault();
                if (this.highlightedIndex >= 0 && suggestionItems[this.highlightedIndex]) {
                    const itemName = suggestionItems[this.highlightedIndex].dataset.itemName;
                    this.selectItem(itemName);
                }
                break;
                
            case 'Escape':
                this.hideSuggestions();
                this.highlightedIndex = -1;
                break;
        }
    }

    /**
     * Affiche les suggestions basées sur la requête
     * @param {string} query - Terme de recherche
     */
    showSuggestions(query) {
        const matches = this.storage.searchItems(query, CONFIG.MAX_SUGGESTIONS);
        
        this.suggestions.innerHTML = '';
        
        if (matches.length === 0) {
            this.hideSuggestions();
            return;
        }

        matches.forEach((match, index) => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = match.displayText;
            div.dataset.itemName = match.name;
            div.addEventListener('click', () => this.selectItem(match.name));
            this.suggestions.appendChild(div);
        });

        this.suggestions.style.display = 'block';
    }

    /**
     * Cache les suggestions
     */
    hideSuggestions() {
        this.suggestions.style.display = 'none';
        this.highlightedIndex = -1;
    }

    /**
     * Met à jour la surbrillance des suggestions
     * @param {NodeList} suggestionItems - Liste des éléments de suggestion
     */
    updateHighlight(suggestionItems) {
        suggestionItems.forEach((item, index) => {
            item.classList.toggle('highlighted', index === this.highlightedIndex);
        });
    }

    /**
     * Sélectionne un item
     * @param {string} itemName - Nom de l'item sélectionné
     */
    selectItem(itemName) {
        this.input.value = itemName;
        this.hideSuggestions();
        
        if (this.onItemSelected) {
            this.onItemSelected(itemName);
        }
    }

    /**
     * Réinitialise le champ de recherche
     */
    reset() {
        this.input.value = '';
        this.hideSuggestions();
    }
}