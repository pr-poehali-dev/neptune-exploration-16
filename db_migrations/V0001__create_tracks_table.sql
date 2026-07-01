CREATE TABLE t_p35572628_neptune_exploration_.tracks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  album VARCHAR(255) DEFAULT 'Сингл',
  year VARCHAR(10),
  cover_url TEXT,
  audio_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p35572628_neptune_exploration_.tracks (title, album, year, cover_url, audio_url, sort_order) VALUES
  ('Между строк', 'Одиночество в сети', '2024', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/5b9d41ba-9b0a-4959-aa53-b18bfd770e78.jpg', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/bucket/92c6cf87-698c-4368-8f6c-191a55e33000.mp3', 1),
  ('Ночной город', 'Одиночество в сети', '2024', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/39217df6-afc5-4024-9a1b-44359fb2971d.jpg', NULL, 2),
  ('Последний шанс', 'Сингл', '2023', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/78d0219e-cb3f-4d8e-9ca4-ceae5aa45588.jpg', NULL, 3),
  ('Красная нить', 'Сингл', '2023', 'https://cdn.poehali.dev/projects/3db99594-6e5b-4c67-93a8-fc7896496478/files/258050f4-d7fa-4b9a-8f46-14e39849014c.jpg', NULL, 4);
