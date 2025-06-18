-- Aplicación de Finanzas Personales
-- Script para configurar la base de datos en Supabase

-- ===================================================================================
-- TABLAS PRINCIPALES
-- ===================================================================================

-- Tabla para categorías
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  icono TEXT,
  color TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla para transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  monto DECIMAL(12, 2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
  fecha DATE NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  notas TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla para presupuestos
CREATE TABLE IF NOT EXISTS presupuestos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  monto DECIMAL(12, 2) NOT NULL,
  categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla para metas financieras
CREATE TABLE IF NOT EXISTS metas_financieras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  monto_objetivo DECIMAL(12, 2) NOT NULL,
  monto_actual DECIMAL(12, 2) DEFAULT 0,
  fecha_objetivo DATE,
  estado TEXT NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa', 'completada', 'abandonada')),
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===================================================================================
-- ÍNDICES
-- ===================================================================================

-- Índices para transacciones
CREATE INDEX IF NOT EXISTS idx_transacciones_usuario_id ON transacciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones(fecha);
CREATE INDEX IF NOT EXISTS idx_transacciones_tipo ON transacciones(tipo);
CREATE INDEX IF NOT EXISTS idx_transacciones_categoria_id ON transacciones(categoria_id);

-- Índices para presupuestos
CREATE INDEX IF NOT EXISTS idx_presupuestos_usuario_id ON presupuestos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_presupuestos_categoria_id ON presupuestos(categoria_id);

-- Índices para metas financieras
CREATE INDEX IF NOT EXISTS idx_metas_financieras_usuario_id ON metas_financieras(usuario_id);

-- ===================================================================================
-- FUNCIONES
-- ===================================================================================

-- Función para calcular el monto gastado en un presupuesto
CREATE OR REPLACE FUNCTION obtener_monto_gastado_presupuesto(p_presupuesto_id UUID)
RETURNS DECIMAL(12, 2)
LANGUAGE plpgsql
AS $$
DECLARE
  monto_gastado DECIMAL(12, 2);
  registro_presupuesto RECORD;
BEGIN
  -- Obtener datos del presupuesto
  SELECT * INTO registro_presupuesto FROM presupuestos WHERE id = p_presupuesto_id;
  
  -- Calcular el monto gastado para el presupuesto
  SELECT COALESCE(SUM(monto), 0)
  INTO monto_gastado
  FROM transacciones
  WHERE usuario_id = registro_presupuesto.usuario_id
    AND tipo = 'gasto'
    AND fecha BETWEEN registro_presupuesto.fecha_inicio AND registro_presupuesto.fecha_fin
    AND (registro_presupuesto.categoria_id IS NULL OR categoria_id = registro_presupuesto.categoria_id);
  
  RETURN monto_gastado;
END;
$$;

-- Función para actualizar el estado de las metas financieras automáticamente
CREATE OR REPLACE FUNCTION actualizar_estado_meta()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el monto actual alcanza o supera el objetivo, marcar como completada
  IF NEW.monto_actual >= NEW.monto_objetivo AND NEW.estado = 'activa' THEN
    NEW.estado := 'completada';
  -- Si el monto se reduce por debajo del objetivo y estaba completada, volver a activa
  ELSIF NEW.monto_actual < NEW.monto_objetivo AND NEW.estado = 'completada' THEN
    NEW.estado := 'activa';
  END IF;
  NEW.fecha_actualizacion := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar la fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================================
-- TRIGGERS
-- ===================================================================================

-- Trigger para actualización automática del estado de metas
DROP TRIGGER IF EXISTS trg_actualizar_estado_meta ON metas_financieras;
CREATE TRIGGER trg_actualizar_estado_meta
BEFORE UPDATE OF monto_actual ON metas_financieras
FOR EACH ROW
EXECUTE FUNCTION actualizar_estado_meta();

-- Triggers para actualización automática de fechas
DROP TRIGGER IF EXISTS set_timestamp ON categorias;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON categorias
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();

DROP TRIGGER IF EXISTS set_timestamp ON transacciones;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON transacciones
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();

DROP TRIGGER IF EXISTS set_timestamp ON presupuestos;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON presupuestos
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();

DROP TRIGGER IF EXISTS set_timestamp ON metas_financieras;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON metas_financieras
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- ===================================================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ===================================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE presupuestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas_financieras ENABLE ROW LEVEL SECURITY;

-- Políticas para transacciones
CREATE POLICY transacciones_usuario_policy ON transacciones
  FOR ALL USING (auth.uid() = usuario_id);

-- Políticas para presupuestos
CREATE POLICY presupuestos_usuario_policy ON presupuestos
  FOR ALL USING (auth.uid() = usuario_id);

-- Políticas para metas financieras
CREATE POLICY metas_financieras_usuario_policy ON metas_financieras
  FOR ALL USING (auth.uid() = usuario_id);

-- Políticas para categorías (todos los usuarios pueden verlas)
CREATE POLICY categorias_select_policy ON categorias
  FOR SELECT USING (true);

-- ===================================================================================
-- DATOS INICIALES
-- ===================================================================================

-- Categorías predeterminadas
INSERT INTO categorias (nombre, icono, color) VALUES
('Alimentación', 'shopping-basket', '#4CAF50'),
('Transporte', 'car', '#2196F3'),
('Vivienda', 'home', '#795548'),
('Entretenimiento', 'movie', '#FF9800'),
('Salud', 'medical-services', '#F44336'),
('Educación', 'school', '#9C27B0'),
('Ropa', 'checkroom', '#607D8B'),
('Servicios', 'receipt', '#00BCD4'),
('Ahorro', 'savings', '#3F51B5'),
('Ingresos', 'payments', '#8BC34A'),
('Otros', 'category', '#9E9E9E')
ON CONFLICT (id) DO NOTHING; 