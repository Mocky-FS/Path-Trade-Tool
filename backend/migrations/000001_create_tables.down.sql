-- Drop tables in reverse order (because of foreign keys)
DROP INDEX IF EXISTS idx_price_history_recorded;
DROP INDEX IF EXISTS idx_price_history_currency;
DROP INDEX IF EXISTS idx_currencies_short_name;

DROP TABLE IF EXISTS price_history;
DROP TABLE IF EXISTS currencies;
