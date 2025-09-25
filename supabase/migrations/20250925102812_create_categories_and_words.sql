-- Crear tablas para categorías y palabras del juego de impostores
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  word VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(word, category_id)
);

-- Insertar categorías iniciales
INSERT INTO categories (name) VALUES 
  ('Animales'),
  ('Comida'),
  ('Objetos del hogar'),
  ('Deportes'),
  ('Profesiones'),
  ('Países'),
  ('Películas'),
  ('Tecnología')
ON CONFLICT (name) DO NOTHING;

-- Insertar palabras para cada categoría
-- Animales
INSERT INTO words (word, category_id) 
SELECT word, (SELECT id FROM categories WHERE name = 'Animales')
FROM (VALUES 
  ('Perro'), ('Gato'), ('Elefante'), ('León'), ('Tigre'), 
  ('Oso'), ('Lobo'), ('Águila'), ('Delfín'), ('Pingüino')
) AS t(word)
ON CONFLICT (word, category_id) DO NOTHING;

-- Comida
INSERT INTO words (word, category_id) 
SELECT word, (SELECT id FROM categories WHERE name = 'Comida')
FROM (VALUES 
  ('Pizza'), ('Hamburguesa'), ('Pasta'), ('Sushi'), ('Tacos'), 
  ('Helado'), ('Chocolate'), ('Manzana'), ('Pan'), ('Queso')
) AS t(word)
ON CONFLICT (word, category_id) DO NOTHING;

-- Objetos del hogar
INSERT INTO words (word, category_id) 
SELECT word, (SELECT id FROM categories WHERE name = 'Objetos del hogar')
FROM (VALUES 
  ('Mesa'), ('Silla'), ('Televisión'), ('Refrigerador'), ('Cama'), 
  ('Sofá'), ('Lámpara'), ('Espejo'), ('Reloj'), ('Libro')
) AS t(word)
ON CONFLICT (word, category_id) DO NOTHING;

-- Deportes
INSERT INTO words (word, category_id) 
SELECT word, (SELECT id FROM categories WHERE name = 'Deportes')
FROM (VALUES 
  ('Fútbol'), ('Baloncesto'), ('Tenis'), ('Natación'), ('Ciclismo'), 
  ('Boxeo'), ('Golf'), ('Voleibol'), ('Béisbol'), ('Hockey')
) AS t(word)
ON CONFLICT (word, category_id) DO NOTHING;

-- Profesiones
INSERT INTO words (word, category_id) 
SELECT word, (SELECT id FROM categories WHERE name = 'Profesiones')
FROM (VALUES 
  ('Médico'), ('Profesor'), ('Ingeniero'), ('Chef'), ('Artista'), 
  ('Policía'), ('Bombero'), ('Piloto'), ('Abogado'), ('Músico')
) AS t(word)
ON CONFLICT (word, category_id) DO NOTHING;

-- Países
INSERT INTO words (word, category_id) 
SELECT word, (SELECT id FROM categories WHERE name = 'Países')
FROM (VALUES 
  ('España'), ('Francia'), ('Italia'), ('Alemania'), ('Brasil'), 
  ('Japón'), ('Australia'), ('Canadá'), ('México'), ('Argentina')
) AS t(word)
ON CONFLICT (word, category_id) DO NOTHING;

-- Películas
INSERT INTO words (word, category_id) 
SELECT word, (SELECT id FROM categories WHERE name = 'Películas')
FROM (VALUES 
  ('Titanic'), ('Avatar'), ('Batman'), ('Superman'), ('Frozen'), 
  ('Toy Story'), ('Shrek'), ('Cars'), ('Coco'), ('Moana')
) AS t(word)
ON CONFLICT (word, category_id) DO NOTHING;

-- Tecnología
INSERT INTO words (word, category_id) 
SELECT word, (SELECT id FROM categories WHERE name = 'Tecnología')
FROM (VALUES 
  ('Computadora'), ('Teléfono'), ('Tablet'), ('Robot'), ('Drone'), 
  ('Cámara'), ('Auriculares'), ('Teclado'), ('Mouse'), ('Monitor')
) AS t(word)
ON CONFLICT (word, category_id) DO NOTHING;

-- Habilitar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (permitir lectura a todos, escritura solo autenticados)
CREATE POLICY "Allow read access to categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow read access to words" ON words
  FOR SELECT USING (true);

-- Opcional: permitir inserción/actualización solo a usuarios autenticados
CREATE POLICY "Allow insert to categories for authenticated users" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow insert to words for authenticated users" ON words
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
