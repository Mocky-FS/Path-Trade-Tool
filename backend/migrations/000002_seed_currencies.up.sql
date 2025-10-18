-- Seed main currencies with mock prices (in Exalted Orbs)
-- These are placeholder values for development
-- Real prices will be fetched via scraper in Phase 3

INSERT INTO currencies (name, short_name, exalted_value) VALUES
('Exalted Orb', 'exalt', 1.0),
('Divine Orb', 'divine', 400.0),
('Chaos Orb', 'chaos', 0.5),
('Orb of Annulment', 'annulment', 200.0),
('Orb of Regret', 'regret', 5.0),
('Gemcutter''s Prism', 'gcp', 2.0),
('Chromatic Orb', 'chroma', 0.1),
('Orb of Fusing', 'fusing', 1.5),
('Orb of Alchemy', 'alchemy', 0.8),
('Vaal Orb', 'vaal', 3.0);