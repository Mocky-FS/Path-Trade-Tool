/**
 * Configuration globale et données des items
 */

export const CONFIG = {
    STORAGE_KEY: 'poe2_prices',
    MAX_SUGGESTIONS: 10,
    ANIMATION_DELAY: 2000,
    CURRENCY_UNIT: 'Orbes Exaltées'
};

export const PROFIT_STATUS = {
    PROFIT: 'profit',
    LOSS: 'loss',
    NEUTRAL: 'neutral'
};

export const MESSAGES = {
    PRICES_SAVED: '✅ PRIX SAUVEGARDÉS !',
    PRICES_IMPORTED: '✅ PRIX IMPORTÉS !',
    IMPORT_ERROR: '❌ Erreur lors de l\'importation du fichier !',
    SELECT_ITEMS: 'Sélectionnez des items pour calculer',
    PROFIT_INDICATOR: {
        [PROFIT_STATUS.PROFIT]: '✅ PROFIT !',
        [PROFIT_STATUS.LOSS]: '❌ PERTE',
        [PROFIT_STATUS.NEUTRAL]: '⚖️ ÉQUILIBRE'
    }
};