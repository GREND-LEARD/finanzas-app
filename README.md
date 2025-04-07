# Finanzas App

Una aplicación web para gestionar finanzas personales, visualizar datos mediante gráficos y llevar un control de ingresos y gastos.

## Características

- 📊 Dashboard con visualización de datos financieros
- 💰 Registro de ingresos y gastos
- 📁 Categorización de transacciones
- 📈 Gráficos interactivos de rendimiento financiero
- 🔒 Autenticación de usuarios con Supabase
- 📱 Diseño responsivo para todos los dispositivos
- 📤 Exportación de datos a CSV y PDF
- 📄 Funcionalidad de impresión de reportes

## Tecnologías Principales

- **Framework:** [Next.js](https://nextjs.org/) (con Turbopack para desarrollo)
- **Lenguaje:** JavaScript / TypeScript (según `jsconfig.json` y `next-env.d.ts`)
- **Base de Datos y Autenticación:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) con [PostCSS](https://postcss.org/)
- **Gestión de Estado:**
    - Cliente: [Zustand](https://github.com/pmndrs/zustand)
    - Servidor/Caché: [React Query (TanStack Query)](https://tanstack.com/query/latest)
- **Formularios:** [React Hook Form](https://react-hook-form.com/)
- **Validación:** [Zod](https://zod.dev/)
- **Linting:** [ESLint](https://eslint.org/)

## Librerías Clave Implementadas

- **Visualización de Datos:** [Recharts](https://recharts.org/)
- **Manejo de Fechas:** [date-fns](https://date-fns.org/)
- **Componentes UI y UX:**
    - Animaciones: [Framer Motion](https://www.framer.com/motion/)
    - Iconos: [React Icons](https://react-icons.github.io/react-icons/)
    - Notificaciones (Toasts): [React Hot Toast](https://react-hot-toast.com/)
    - Esqueletos de Carga: [React Loading Skeleton](https://github.com/dvtng/react-loading-skeleton)
- **Exportación/Importación de Datos:**
    - CSV: [PapaParse](https://www.papaparse.com/)
    - Excel (XLSX): [SheetJS (xlsx)](https://sheetjs.com/)
    - PDF: [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **Impresión:** [react-to-print](https://github.com/gregnb/react-to-print)
- **Autenticación (Tokens):** [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (Probablemente para manejo de sesiones/tokens del lado del servidor o cliente)
- **Core React/Next:** React, React DOM, Next.js

## Configuración del proyecto

### Requisitos previos

- Node.js (revisar versión en `package.json` o requerimientos del equipo)
- Una cuenta en [Supabase](https://supabase.com/)

### Instalación

1.  Clona este repositorio
    ```
    git clone <URL_DEL_REPOSITORIO>
    cd finanzas-app
    ```

2.  Instala las dependencias
    ```
    npm install
    ```
    O si usas `yarn` o `pnpm`:
    ```
    yarn install
    # o
    pnpm install
    ```

3.  Configura las variables de entorno
    Crea un archivo `.env.local` basándote en `.env.local.example` (si existe) o añade las siguientes variables:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=TU_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
    # Añadir otras variables necesarias (e.g., JWT_SECRET si usas jsonwebtoken en el backend)
    ```
    Actualiza las variables con tus credenciales de Supabase y otras configuraciones necesarias.

4.  Inicia el servidor de desarrollo
    ```
    npm run dev
    ```
    Esto iniciará la aplicación en modo desarrollo con Turbopack.

## Estructura de la base de datos (Ejemplo)

La aplicación utiliza las siguientes tablas en Supabase (pueden variar):

- **`users`**: Gestionado por Supabase Auth.
- **`accounts`**: Información de las cuentas de usuario (ej. bancarias, efectivo).
- **`transactions`**: Registro de ingresos y gastos asociados a cuentas y categorías.
- **`categories`**: Categorías para clasificar transacciones.

## Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1.  Haz un fork del proyecto
2.  Crea una rama para tu característica (`git checkout -b feature/nueva-feature`)
3.  Haz tus cambios y commitea (`git commit -m 'Agrega nueva feature'`)
4.  Empuja a la rama (`git push origin feature/nueva-feature`)
5.  Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT.
