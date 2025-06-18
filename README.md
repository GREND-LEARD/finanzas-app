# Finanzas App

Aplicación para gestionar finanzas personales con visualización de datos, presupuestos y metas financieras.

## Características

- ✅ Autenticación de usuarios con Supabase
- ✅ Gestión de transacciones (ingresos y gastos)
- ✅ Categorización de transacciones
- ✅ Control de presupuestos
- ✅ Metas financieras
- ✅ Panel de estadísticas
- ✅ Reportes y análisis
- ✅ Tema claro/oscuro
- ✅ Soporte para múltiples monedas

## Tecnologías

- Next.js 14 (App Router)
- React
- Tailwind CSS
- Supabase (Autenticación y Base de Datos)
- React Query
- Zustand
- Chart.js

## Configuraciones Personalizables

La aplicación permite a los usuarios personalizar su experiencia:

- **Moneda:** Selecciona entre diferentes divisas (MXN, USD, EUR, GBP, etc.)
- **Tema:** Modo oscuro o claro
- **Formato regional:** Configura el formato de números y fechas según tu ubicación
- **Día de inicio de semana:** Lunes o domingo

Estas configuraciones se guardan automáticamente en el navegador y se aplican a todos los componentes.

## Estructura del Proyecto

- `/src/app` - Páginas y rutas de la aplicación
- `/src/components` - Componentes de UI reutilizables
- `/src/lib` - Utilidades, hooks y configuraciones
- `/src/utils` - Funciones utilitarias y helpers
- `/src/lib/store` - Estados globales con Zustand
- `/src/sql` - Scripts SQL para configurar la base de datos

## Configuración de la Base de Datos

Para configurar la base de datos en Supabase, consulta la documentación en `README-supabase.md`.

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/finanzas-app.git
cd finanzas-app
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Crea un archivo `.env.local` en la raíz del proyecto:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
```

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

5. Navegar a `http://localhost:3000`

## Pantallas

La aplicación cuenta con las siguientes páginas:

- **Inicio:** Landing page con información general
- **Dashboard:** Vista general de finanzas con estadísticas
- **Transacciones:** Gestión de ingresos y gastos
- **Categorías:** Administración de categorías para transacciones
- **Presupuestos:** Control y seguimiento de presupuestos mensuales
- **Metas Financieras:** Gestión de metas de ahorro
- **Reportes:** Análisis detallado de finanzas
- **Configuración:** Personalización de la aplicación
