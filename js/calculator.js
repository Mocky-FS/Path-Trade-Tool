/**
 * Gestionnaire des calculs de profit
 */

import { CONFIG, PROFIT_STATUS, MESSAGES } from './config.js';

export class ProfitCalculator {
    constructor(storageManager) {
        this.storage = storageManager;
        this.selectedItems = {
            sell: null,
            buy: null
        };
        
        this.elements = this.initializeElements();
        this.bindEvents();
    }

    /**
     * Initialise les références aux éléments DOM
     * @returns {Object} Références des éléments
     */
    initializeElements() {
        return {
            sellQuantity: document.getElementById('sellQuantity'),
            buyQuantity: document.getElementById('buyQuantity'),
            sellUnitValue: document.getElementById('sellUnitValue'),
            buyUnitValue: document.getElementById('buyUnitValue'),
            sellTotalValue: document.getElementById('sellTotalValue'),
            buyTotalValue: document.getElementById('buyTotalValue'),
            finalResult: document.getElementById('finalResult'),
            profitIndicator: document.getElementById('profitIndicator')
        };
    }

    /**
     * Lie les événements de calcul
     */
    bindEvents() {
        this.elements.sellQuantity.addEventListener('input', () => this.calculateProfit());
        this.elements.buyQuantity.addEventListener('input', () => this.calculateProfit());
    }

    /**
     * Sélectionne un item pour la vente
     * @param {string} itemName - Nom de l'item
     */
    selectSellItem(itemName) {
        this.selectedItems.sell = itemName;
        const price = this.storage.getPrice(itemName);
        
        if (price !== null) {
            this.elements.sellUnitValue.textContent = `${price} ${CONFIG.CURRENCY_UNIT}`;
            this.calculateProfit();
        }
    }

    /**
     * Sélectionne un item pour l'achat
     * @param {string} itemName - Nom de l'item
     */
    selectBuyItem(itemName) {
        this.selectedItems.buy = itemName;
        const price = this.storage.getPrice(itemName);
        
        if (price !== null) {
            this.elements.buyUnitValue.textContent = `${price} ${CONFIG.CURRENCY_UNIT}`;
            this.calculateProfit();
        }
    }

    /**
     * Calcule le total pour un item
     * @param {string} itemType - Type d'item ('sell' ou 'buy')
     * @returns {number} Total calculé
     */
    calculateItemTotal(itemType) {
        const item = this.selectedItems[itemType];
        if (!item) return 0;

        const price = this.storage.getPrice(item);
        const quantity = parseInt(this.elements[`${itemType}Quantity`].value) || 0;

        if (price === null || quantity <= 0) return 0;

        return price * quantity;
    }

    /**
     * Met à jour l'affichage du total pour un item
     * @param {string} itemType - Type d'item ('sell' ou 'buy')
     * @param {number} total - Total à afficher
     */
    updateTotalDisplay(itemType, total) {
        const element = this.elements[`${itemType}TotalValue`];
        element.textContent = `${total} ${CONFIG.CURRENCY_UNIT}`;
        
        // Animation de mise à jour
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    /**
     * Détermine le statut du profit
     * @param {number} profit - Montant du profit
     * @returns {string} Statut du profit
     */
    getProfitStatus(profit) {
        if (profit > 0) return PROFIT_STATUS.PROFIT;
        if (profit < 0) return PROFIT_STATUS.LOSS;
        return PROFIT_STATUS.NEUTRAL;
    }

    /**
     * Met à jour l'affichage du résultat final
     * @param {number} profit - Montant du profit
     */
    updateResultDisplay(profit) {
        const status = this.getProfitStatus(profit);
        const { finalResult, profitIndicator } = this.elements;

        // Formatage du montant
        const formattedProfit = profit > 0 ? `+${profit}` : `${profit}`;
        finalResult.textContent = `${formattedProfit} ${CONFIG.CURRENCY_UNIT}`;

        // Application du style selon le statut
        finalResult.className = `result ${status}`;
        
        // Indicateur de profit/perte
        profitIndicator.textContent = MESSAGES.PROFIT_INDICATOR[status];
        profitIndicator.style.color = this.getStatusColor(status);

        // Animation du résultat
        finalResult.style.transform = 'scale(1.1)';
        setTimeout(() => {
            finalResult.style.transform = 'scale(1)';
        }, 300);
    }

    /**
     * Récupère la couleur associée au statut
     * @param {string} status - Statut du profit
     * @returns {string} Code couleur CSS
     */
    getStatusColor(status) {
        const colors = {
            [PROFIT_STATUS.PROFIT]: '#00ff00',
            [PROFIT_STATUS.LOSS]: '#ff4444',
            [PROFIT_STATUS.NEUTRAL]: '#ffff00'
        };
        return colors[status] || '#ffffff';
    }

    /**
     * Calcule et affiche le profit total
     */
    calculateProfit() {
        const sellTotal = this.calculateItemTotal('sell');
        const buyTotal = this.calculateItemTotal('buy');

        // Mise à jour des totaux
        this.updateTotalDisplay('sell', sellTotal);
        this.updateTotalDisplay('buy', buyTotal);

        // Calcul du profit/perte
        if (sellTotal > 0 || buyTotal > 0) {
            const profit = sellTotal - buyTotal;
            this.updateResultDisplay(profit);
        } else {
            this.elements.finalResult.textContent = MESSAGES.SELECT_ITEMS;
            this.elements.finalResult.className = 'result';
            this.elements.profitIndicator.textContent = '';
        }
    }

    /**
     * Met à jour les valeurs unitaires après modification des prix
     */
    updateUnitValues() {
        if (this.selectedItems.sell) {
            const sellPrice = this.storage.getPrice(this.selectedItems.sell);
            if (sellPrice !== null) {
                this.elements.sellUnitValue.textContent = `${sellPrice} ${CONFIG.CURRENCY_UNIT}`;
            }
        }

        if (this.selectedItems.buy) {
            const buyPrice = this.storage.getPrice(this.selectedItems.buy);
            if (buyPrice !== null) {
                this.elements.buyUnitValue.textContent = `${buyPrice} ${CONFIG.CURRENCY_UNIT}`;
            }
        }

        this.calculateProfit();
    }

    /**
     * Réinitialise le calculateur
     */
    reset() {
        this.selectedItems = { sell: null, buy: null };
        
        // Réinitialiser les valeurs
        this.elements.sellQuantity.value = '1';
        this.elements.buyQuantity.value = '1';
        
        // Réinitialiser l'affichage
        this.elements.sellUnitValue.textContent = '-';
        this.elements.buyUnitValue.textContent = '-';
        this.elements.sellTotalValue.textContent = `0 ${CONFIG.CURRENCY_UNIT}`;
        this.elements.buyTotalValue.textContent = `0 ${CONFIG.CURRENCY_UNIT}`;
        this.elements.finalResult.textContent = MESSAGES.SELECT_ITEMS;
        this.elements.finalResult.className = 'result';
        this.elements.profitIndicator.textContent = '';
    }
}