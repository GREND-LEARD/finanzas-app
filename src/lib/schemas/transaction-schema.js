import { z } from 'zod';

export const transactionSchema = z.object({
  descripcion: z.string()
    .min(3, { message: 'La descripción debe tener al menos 3 caracteres' })
    .max(100, { message: 'La descripción no puede exceder los 100 caracteres' })
    .trim(),
  monto: z.preprocess(
    // Preprocesar para intentar convertir a número antes de validar
    (val) => {
      if (typeof val === 'string') {
        // Corrected regex: remove extra escapes
        const num = parseFloat(val.replace(/[,.]/g, '')); 
        return isNaN(num) ? val : num;
      }
      return val;
    },
    z.number({ invalid_type_error: 'El monto debe ser un número' })
      .positive({ message: 'El monto debe ser positivo' })
      // Puedes añadir .finite() si es necesario
  ),
  tipo: z.enum(['ingreso', 'gasto'], { 
    errorMap: () => ({ message: 'Selecciona un tipo válido (Ingreso o Gasto)' }) 
  }),
  fecha: z.preprocess(
    (arg) => {
      // Permitir string o Date, intentar convertir string a Date
      if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    }, 
    z.date({ errorMap: () => ({ message: 'Por favor, introduce una fecha válida' }) })
  ),
  // Asegúrate que esto coincida con tu DB: UUID o TEXT?
  categoria_id: z.string().uuid({ message: 'Selecciona una categoría válida' }).nullable().optional(), 
  // Add optional notes field
  notas: z.string().optional(), 
});

