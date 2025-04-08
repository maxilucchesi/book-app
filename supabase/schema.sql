-- Crear tablas para la aplicación de biblioteca personal

-- Tabla de libros
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('por_empezar', 'leyendo', 'terminado', 'abandonado')),
  read_year INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla de wishlist
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Políticas de seguridad (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Políticas para books
CREATE POLICY "Usuarios pueden ver sus propios libros"
  ON books FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios libros"
  ON books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios libros"
  ON books FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios libros"
  ON books FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para wishlist
CREATE POLICY "Usuarios pueden ver sus propios items de wishlist"
  ON wishlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios items de wishlist"
  ON wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios items de wishlist"
  ON wishlist FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios items de wishlist"
  ON wishlist FOR DELETE
  USING (auth.uid() = user_id);

-- Índices para mejorar el rendimiento
CREATE INDEX books_user_id_idx ON books(user_id);
CREATE INDEX wishlist_user_id_idx ON wishlist(user_id);
