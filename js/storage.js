/**
 * Gestionnaire de stockage des données
 */

import { CONFIG } from './config.js';

export class StorageManager {
    constructor() {
        this.items = {};
    }

    async initialize() {
        try {
            const response = await fetch('./js/defaultItems.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const defaultItems = await response.json();
            this.items = { ...defaultItems };
            this.loadSavedPrices();
        } catch (error) {
            console.error('Erreur lors du chargement des DEFAULT_ITEMS:', error);
            this.items = {};
            console.log("StorageManager: Error loading default items, items set to empty.");
        }
    }

    /**
     * Charge les prix sauvegardés depuis le localStorage
     */
    loadSavedPrices() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                this.items = { ...this.items, ...JSON.parse(saved) };
                console.log("StorageManager: Saved prices loaded. Current items:", this.items);
            }
        } catch (error) {
            console.warn('Erreur lors du chargement des prix:', error);
            console.log("StorageManager: Error loading saved prices.");
        }
    }

    /**
     * Sauvegarde les prix dans le localStorage
     */
    savePrices() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.items));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return false;
        }
    }

    /**
     * Met à jour le prix d'un item
     * @param {string} itemName - Nom de l'item
     * @param {number} price - Nouveau prix
     */
    updatePrice(itemName, price) {
        if (typeof price === 'number' && price >= 0) {
            this.items[itemName] = price;
        }
    }

    /**
     * Récupère le prix d'un item
     * @param {string} itemName - Nom de l'item
     * @returns {number|null} Prix de l'item ou null si non trouvé
     */
    getPrice(itemName) {
        return this.items[itemName] || null;
    }

    /**
     * Récupère tous les items
     * @returns {Object} Tous les items avec leurs prix
     */
    getAllItems() {
        return { ...this.items };
    }

    /**
     * Met à jour tous les items
     * @param {Object} newItems - Nouveaux items
     */
    updateAllItems(newItems) {
        if (typeof newItems === 'object' && newItems !== null) {
            this.items = { ...newItems };
            return this.savePrices();
        }
        return false;
    }

    /**
     * Exporte les prix vers un objet JSON
     * @returns {string} JSON des prix
     */
    exportPrices() {
        return JSON.stringify(this.items, null, 2);
    }

    /**
     * Génère un nom de fichier avec la date
     * @returns {string} Nom de fichier
     */
    generateFileName() {
        const date = new Date().toISOString().split('T')[0];
        return `poe2_prices_${date}.json`;
    }

    /**
     * Filtre les items selon une requête de recherche
     * @param {string} query - Terme de recherche
     * @param {number} maxResults - Nombre maximum de résultats
     * @returns {Array} Items correspondants
     */
    searchItems(query, maxResults = CONFIG.MAX_SUGGESTIONS) {
        const lowerQuery = query.toLowerCase();
        return Object.keys(this.items)
            .filter(item => item.toLowerCase().includes(lowerQuery))
            .slice(0, maxResults)
            .map(item => ({
                name: item,
                price: this.items[item],
                displayText: `${item} (${this.items[item]} ${CONFIG.CURRENCY_UNIT})`
            }));
    }
}