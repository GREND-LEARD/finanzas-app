// Script para crear el archivo .env.local con las credenciales de Supabase
const fs = require('fs');
const path = require('path');

// Ruta al archivo .env.local en la raíz del proyecto
const envFilePath = path.join(__dirname, '..', '.env.local');

// Contenido que se escribirá en el archivo
const envContent = `# Supabase
# Reemplaza estos valores con tus credenciales de Supabase
# Puedes encontrarlos en https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-key

`;

try {
  // Escribir el archivo
  fs.writeFileSync(envFilePath, envContent, 'utf8');
  console.log(`\x1b[32m✓ Archivo .env.local creado exitosamente en ${envFilePath}\x1b[0m`);
  console.log('\x1b[36mImportante: Ahora debes editar el archivo .env.local y reemplazar los valores de las variables con tus credenciales de Supabase\x1b[0m');
} catch (error) {
  console.error('\x1b[31m✗ Error al crear el archivo .env.local:\x1b[0m', error);
  console.log('\x1b[33mAlternativa: Crea manualmente un archivo .env.local en la raíz del proyecto con el siguiente contenido:\x1b[0m');
  console.log(`
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-key
  `);
} 