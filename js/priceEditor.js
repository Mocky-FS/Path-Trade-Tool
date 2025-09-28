/**
 * Éditeur de prix avec interface modale
 */

import { CONFIG, MESSAGES } from './config.js';

export class PriceEditor {
    constructor(storageManager, onPricesUpdated) {
        this.storage = storageManager;
        this.onPricesUpdated = onPricesUpdated;
        
        this.elements = this.initializeElements();
        this.bindEvents();
    }

    /**
     * Initialise les références aux éléments DOM
     * @returns {Object} Références des éléments
     */
    initializeElements() {
        return {
            modal: document.getElementById('priceModal'),
            editor: document.getElementById('priceEditor'),
            editBtn: document.getElementById('editPricesBtn'),
            saveBtn: document.getElementById('savePricesBtn'),
            cancelBtn: document.getElementById('cancelPricesBtn'),
            exportBtn: document.getElementById('exportPricesBtn'),
            importBtn: document.getElementById('importPricesBtn'),
            fileInput: document.getElementById('fileInput'),
            title: document.querySelector('.main-title')
        };
    }

    /**
     * Lie les événements de l'éditeur
     */
    bindEvents() {
        this.elements.editBtn.addEventListener('click', () => this.openEditor());
        this.elements.saveBtn.addEventListener('click', () => this.savePrices());
        this.elements.cancelBtn.addEventListener('click', () => this.closeEditor());
        this.elements.exportBtn.addEventListener('click', () => this.exportPrices());
        this.elements.importBtn.addEventListener('click', () => this.elements.fileInput.click());
        this.elements.fileInput.addEventListener('change', (e) => this.importPrices(e));
        
        // Fermer le modal en cliquant sur l'arrière-plan
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeEditor();
            }
        });
    }

    /**
     * Ouvre l'éditeur de prix
     */
    openEditor() {
        this.renderEditor();
        this.elements.modal.style.display = 'block';
        
        // Focus sur le premier input
        setTimeout(() => {
            const firstInput = this.elements.editor.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    /**
     * Ferme l'éditeur de prix
     */
    closeEditor() {
        this.elements.modal.style.display = 'none';
    }

    /**
     * Rend l'interface de l'éditeur
     */
    renderEditor() {
        const items = this.storage.getAllItems();
        this.elements.editor.innerHTML = '';

        Object.entries(items)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([itemName, price]) => {
                const priceItem = this.createPriceItem(itemName, price);
                this.elements.editor.appendChild(priceItem);
            });
    }

    /**
     * Crée un élément d'édition de prix
     * @param {string} itemName - Nom de l'item
     * @param {number} price - Prix actuel
     * @returns {HTMLElement} Élément DOM
     */
    createPriceItem(itemName, price) {
        const div = document.createElement('div');
        div.className = 'price-item';

        const inputId = this.sanitizeId(itemName);
        
        div.innerHTML = `
            <label for="${inputId}">${itemName}:</label>
            <input 
                type="number" 
                id="${inputId}" 
                value="${price}" 
                min="0.01" 
                step="0.01"
                data-item-name="${itemName}"
            >
            <span class="currency-label">${CONFIG.CURRENCY_UNIT}</span>
        `;

        // Animation d'apparition
        div.style.opacity = '0';
        div.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            div.style.transition = 'all 0.3s ease';
            div.style.opacity = '1';
            div.style.transform = 'translateX(0)';
        }, Math.random() * 300);

        return div;
    }

    /**
     * Sanitise un ID pour éviter les caractères problématiques
     * @param {string} str - Chaîne à sanitiser
     * @returns {string} ID sanitisé
     */
    sanitizeId(str) {
        return `price_${str.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }

    /**
     * Sauvegarde les prix modifiés
     */
    savePrices() {
        const inputs = this.elements.editor.querySelectorAll('input[data-item-name]');
        const updatedItems = {};
        
        inputs.forEach(input => {
            const itemName = input.dataset.itemName;
            const price = parseFloat(input.value) || 0;
            
            if (price >= 0) {
                updatedItems[itemName] = price;
            }
        });

        // Mettre à jour le storage
        if (this.storage.updateAllItems(updatedItems)) {
            this.showSuccessMessage(MESSAGES.PRICES_SAVED);
            this.closeEditor();
            
            // Notifier les autres composants
            if (this.onPricesUpdated) {
                this.onPricesUpdated();
            }
        }
    }

    /**
     * Exporte les prix vers un fichier JSON
     */
    exportPrices() {
        try {
            const dataStr = this.storage.exportPrices();
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = this.storage.generateFileName();
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
    }

    /**
     * Importe les prix depuis un fichier JSON
     * @param {Event} event - Événement de changement de fichier
     */
    importPrices(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedItems = JSON.parse(e.target.result);
                
                if (this.validateImportedData(importedItems)) {
                    if (this.storage.updateAllItems(importedItems)) {
                        this.showSuccessMessage(MESSAGES.PRICES_IMPORTED);
                        
                        // Notifier les autres composants
                        if (this.onPricesUpdated) {
                            this.onPricesUpdated();
                        }
                    }
                } else {
                    throw new Error('Format de données invalide');
                }
            } catch (error) {
                console.error('Erreur d\'importation:', error);
                this.showErrorMessage(MESSAGES.IMPORT_ERROR);
            }
        };

        reader.onerror = () => {
            this.showErrorMessage(MESSAGES.IMPORT_ERROR);
        };

        reader.readAsText(file);
        
        // Réinitialiser l'input file
        event.target.value = '';
    }

    /**
     * Valide les données importées
     * @param {Object} data - Données à valider
     * @returns {boolean} True si les données sont valides
     */
    validateImportedData(data) {
        if (typeof data !== 'object' || data === null) {
            return false;
        }

        return Object.entries(data).every(([key, value]) => 
            typeof key === 'string' && 
            typeof value === 'number' && 
            value >= 0
        );
    }

    /**
     * Affiche un message de succès temporaire
     * @param {string} message - Message à afficher
     */
    showSuccessMessage(message) {
        const originalText = this.elements.title.textContent;
        const originalColor = this.elements.title.style.color;
        
        this.elements.title.textContent = message;
        this.elements.title.style.color = '#00ff00';
        
        setTimeout(() => {
            this.elements.title.textContent = originalText;
            this.elements.title.style.color = originalColor || '#d4af37';
        }, CONFIG.ANIMATION_DELAY);
    }

    /**
     * Affiche un message d'erreur
     * @param {string} message - Message d'erreur
     */
    showErrorMessage(message) {
        alert(message); // Peut être remplacé par une notification plus élégante
    }
}