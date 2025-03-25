# Finanzas App

Una aplicación web para gestionar finanzas personales, visualizar datos mediante gráficos y llevar un control de ingresos y gastos.

## Características

- 📊 Dashboard con visualización de datos financieros
- 💰 Registro de ingresos y gastos
- 📁 Categorización de transacciones
- 📈 Gráficos interactivos de rendimiento financiero
- 🔒 Autenticación de usuarios con Supabase
- 📱 Diseño responsivo para todos los dispositivos

## Tecnologías utilizadas

- **Next.js**: Framework de React para el frontend
- **Supabase**: Base de datos y autenticación
- **React Query**: Gestión de estado del servidor y caché
- **Zustand**: Gestión de estado global
- **Recharts**: Visualización de datos con gráficos
- **React Hook Form + Zod**: Formularios y validación
- **TailwindCSS**: Estilos y componentes UI
- **date-fns**: Manipulación de fechas

## Configuración del proyecto

### Requisitos previos

- Node.js 16.8.0 o superior
- Una cuenta en [Supabase](https://supabase.com/)

### Instalación

1. Clona este repositorio
   ```
   git clone https://github.com/tu-usuario/finanzas-app.git
   cd finanzas-app
   ```

2. Instala las dependencias
   ```
   npm install
   ```

3. Configura las variables de entorno
   ```
   cp .env.local.example .env.local
   ```
   Y actualiza las variables con tus credenciales de Supabase.

4. Inicia el servidor de desarrollo
   ```
   npm run dev
   ```

## Estructura de la base de datos

La aplicación utiliza las siguientes tablas en Supabase:

- **users**: Gestionado por Supabase Auth
- **transactions**: Registro de ingresos y gastos
- **categories**: Categorías para clasificar transacciones

## Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-feature`)
3. Haz tus cambios y commitea (`git commit -m 'Agrega nueva feature'`)
4. Empuja a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT.
