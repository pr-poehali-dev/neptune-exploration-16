-- Обновляем существующие 4 трека с реальными аудио
UPDATE t_p35572628_neptune_exploration_.tracks SET audio_url = 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/bucket/92c6cf87-698c-4368-8f6c-191a55e33000.mp3' WHERE id = 1;
UPDATE t_p35572628_neptune_exploration_.tracks SET audio_url = 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/bucket/6d5a5059-5e74-4387-9129-cedf43e1f7e1.mp3' WHERE id = 2;
UPDATE t_p35572628_neptune_exploration_.tracks SET audio_url = 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/bucket/e01e5266-920d-4b34-b657-ac0401819485.mp3' WHERE id = 3;
UPDATE t_p35572628_neptune_exploration_.tracks SET audio_url = 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/bucket/77b4d102-b45d-4907-829e-17d27966fbe2.mp3' WHERE id = 4;

-- Добавляем оставшиеся 5 треков
INSERT INTO t_p35572628_neptune_exploration_.tracks (title, album, year, cover_url, audio_url, sort_order) VALUES
  ('Трек 5', 'Сингл', '2024', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/5b9d41ba-9b0a-4959-aa53-b18bfd770e78.jpg', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/bucket/1aac8ddf-3efa-45eb-a790-08e2e0236a15.mp3', 5),
  ('Трек 6', 'Сингл', '2024', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/5b9d41ba-9b0a-4959-aa53-b18bfd770e78.jpg', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/bucket/ae38da7f-c919-42e1-b465-d3fb90a0bedb.mp3', 6),
  ('Трек 7', 'Сингл', '2024', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/5b9d41ba-9b0a-4959-aa53-b18bfd770e78.jpg', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/bucket/ac8fdc0e-9fb1-4f9d-a075-54482dda0835.mp3', 7),
  ('Трек 8', 'Сингл', '2024', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/5b9d41ba-9b0a-4959-aa53-b18bfd770e78.jpg', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/bucket/9cbb2ed8-9dcb-4651-8c75-10e02581bc10.mp3', 8),
  ('Трек 9', 'Сингл', '2024', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/5b9d41ba-9b0a-4959-aa53-b18bfd770e78.jpg', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/bucket/6f8e1e6f-c488-4c3e-affb-a23914f3aff9.mp3', 9);
