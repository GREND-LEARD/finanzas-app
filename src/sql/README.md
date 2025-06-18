# Configuración de la Base de Datos en Supabase

Este directorio contiene los scripts SQL necesarios para configurar la base de datos de nuestra aplicación de finanzas en Supabase.

## Instrucciones de Configuración

### Pasos para Configurar la Base de Datos

1. Inicia sesión en tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona o crea un nuevo proyecto
3. Ve a la sección **SQL Editor** en el menú lateral
4. Haz clic en **New query** (Nueva consulta)
5. Copia y pega el contenido del archivo `setup-db.sql` en el editor
6. Haz clic en **Run** (Ejecutar) para crear todas las tablas y configuraciones

## Estructura de la Base de Datos

La base de datos consta de las siguientes tablas principales:

| Tabla | Descripción |
|-------|-------------|
| `categorias` | Almacena las categorías para clasificar transacciones |
| `transacciones` | Registra ingresos y gastos |
| `presupuestos` | Define presupuestos por categoría y período |
| `metas_financieras` | Guarda metas de ahorro y objetivos financieros |

### Características Implementadas

- **Políticas de seguridad (RLS)** para protección de datos por usuario
- **Índices** optimizados para mejorar el rendimiento de consultas frecuentes
- **Triggers** para actualización automática de fechas y estados
- **Funciones personalizadas** para cálculos financieros
- **Datos iniciales** con categorías predefinidas

## Diagrama de la Base de Datos

```
┌───────────────────┐       ┌───────────────────┐
│    categorias     │       │   transacciones   │
├───────────────────┤       ├───────────────────┤
│ id (PK)           │       │ id (PK)           │
│ nombre            │       │ usuario_id (FK)   │
│ icono             │◄──────┤ categoria_id (FK) │
│ color             │       │ descripcion       │
│ fecha_creacion    │       │ monto             │
│ fecha_actualizacion│       │ tipo              │
└───────────────────┘       │ fecha             │
        ▲                   │ notas             │
        │                   │ fecha_creacion    │
        │                   │ fecha_actualizacion│
┌───────────────────┐       └───────────────────┘
│   presupuestos    │                
├───────────────────┤                
│ id (PK)           │       ┌───────────────────┐
│ usuario_id (FK)   │       │ metas_financieras │
│ categoria_id (FK) ├───────┤───────────────────┤
│ nombre            │       │ id (PK)           │
│ monto             │       │ usuario_id (FK)   │
│ fecha_inicio      │       │ nombre            │
│ fecha_fin         │       │ monto_objetivo    │
│ fecha_creacion    │       │ monto_actual      │
│ fecha_actualizacion│       │ fecha_objetivo    │
└───────────────────┘       │ estado            │
                           │ fecha_creacion    │
                           │ fecha_actualizacion│
                           └───────────────────┘
```

## Mantenimiento

### Funciones Disponibles

- `obtener_monto_gastado_presupuesto(presupuesto_id)`: Calcula el monto gastado en un presupuesto específico
- `actualizar_estado_meta()`: Actualiza automáticamente el estado de una meta financiera según su avance

### Actualizaciones Futuras

Para añadir nuevas tablas o modificar las existentes, crea un nuevo archivo SQL con un nombre descriptivo como `update-v2.sql` y sigue el mismo proceso de ejecución en el SQL Editor de Supabase.

## Después de configurar la base de datos

Después de ejecutar el script SQL con éxito, debes configurar las variables de entorno en el archivo `.env.local` de tu aplicación:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-key
```

Puedes encontrar estos valores en la sección "API" en la configuración del proyecto en Supabase. 