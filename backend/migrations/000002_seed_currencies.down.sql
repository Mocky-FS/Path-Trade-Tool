-- Remove seed data
DELETE FROM currencies WHERE short_name IN (
    'exalt', 'divine', 'chaos', 'annulment', 'regret',
    'gcp', 'chroma', 'fusing', 'alchemy', 'vaal'
);