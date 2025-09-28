/**
 * Application principale - Point d'entrée et orchestration
 */

import { StorageManager } from './storage.js';
import { Autocomplete } from './autocomplete.js';
import { ProfitCalculator } from './calculator.js';
import { PriceEditor } from './priceEditor.js';

class PoE2ProfitCalculator {
    constructor() {
        this.storage = new StorageManager();
        this.calculator = null;
        this.sellAutocomplete = null;
        this.buyAutocomplete = null;
        this.priceEditor = null;
        
        this.init();
    }

    /**
     * Initialise l'application
     */
    async init() {
        await this.storage.initialize();
        
        if (Object.keys(this.storage.getAllItems()).length === 0) {
            this.showErrorMessage('Aucun item disponible. Veuillez importer des prix.');
        } else {
            // Attendre que le DOM soit chargé
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                this.initializeComponents();
            }
        }
    }

    async initializeComponents() {
        try {
            // Initialiser le calculateur de profit
            this.calculator = new ProfitCalculator(this.storage);

            // Initialiser l'autocomplétion pour la vente
            this.sellAutocomplete = new Autocomplete(
                document.getElementById('sellItem'),
                document.getElementById('sellSuggestions'),
                this.storage,
                (itemName) => this.calculator.selectSellItem(itemName)
            );

            // Initialiser l'autocomplétion pour l'achat
            this.buyAutocomplete = new Autocomplete(
                document.getElementById('buyItem'),
                document.getElementById('buySuggestions'),
                this.storage,
                (itemName) => this.calculator.selectBuyItem(itemName)
            );

            // Initialiser l'éditeur de prix
            this.priceEditor = new PriceEditor(
                this.storage,
                () => this.handlePricesUpdated()
            );

            // Charger l'exemple de test après un délai
            setTimeout(() => this.loadTestExample(), 500);

            console.log('✅ Application PoE2 Calculator initialisée avec succès');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.showErrorMessage('Erreur lors de l\'initialisation de l\'application');
        }
    }

    /**
     * Gère la mise à jour des prix
     */
    handlePricesUpdated() {
        // Mettre à jour les valeurs unitaires dans le calculateur
        this.calculator.updateUnitValues();
        
        console.log('🔄 Prix mis à jour');
    }

    /**
     * Charge l'exemple de test (Divine Orb vs Chaos Orb)
     */
    loadTestExample() {
        try {
            // Sélectionner Divine Orb pour la vente
            this.sellAutocomplete.selectItem('Divine Orb');
            this.calculator.selectSellItem('Divine Orb');

            // Sélectionner Chaos Orb pour l'achat
            this.buyAutocomplete.selectItem('Chaos Orb');
            this.calculator.selectBuyItem('Chaos Orb');

            // Définir la quantité d'achat à 200
            document.getElementById('buyQuantity').value = 200;
            
            // Recalculer
            this.calculator.calculateProfit();

            console.log('📝 Exemple de test chargé: Divine Orb vs 200 Chaos Orb');
        } catch (error) {
            console.warn('⚠️ Impossible de charger l\'exemple de test:', error);
        }
    }

    /**
     * Réinitialise l'application
     */
    reset() {
        if (this.calculator) {
            this.calculator.reset();
        }
        
        if (this.sellAutocomplete) {
            this.sellAutocomplete.reset();
        }
        
        if (this.buyAutocomplete) {
            this.buyAutocomplete.reset();
        }

        console.log('🔄 Application réinitialisée');
    }

    /**
     * Affiche un message d'erreur à l'utilisateur
     * @param {string} message - Message d'erreur
     */
    showErrorMessage(message) {
        // Créer une notification d'erreur élégante
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 3000;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;

        // Ajouter l'animation CSS
        if (!document.querySelector('#error-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'error-animation-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Supprimer après 5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    /**
     * Méthodes publiques pour l'interaction externe
     */
    getStorageManager() {
        return this.storage;
    }

    getCalculator() {
        return this.calculator;
    }

    getPriceEditor() {
        return this.priceEditor;
    }
}

// Initialiser l'application
const app = new PoE2ProfitCalculator();

// Exposer l'instance globalement pour le debugging
window.PoE2Calculator = app;

export default app;