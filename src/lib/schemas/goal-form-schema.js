import { z } from 'zod';

export const goalFormSchema = z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre de la meta debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    .trim(),
  monto_objetivo: z.preprocess(
    // Permitir string, intentar convertir a número
    (val) => typeof val === 'string' ? parseFloat(val.replace(/[,.]/g, '')) : val,
    z.number({ required_error: 'El monto objetivo es requerido', invalid_type_error: 'El monto objetivo debe ser un número' })
      .positive({ message: 'El monto objetivo debe ser positivo' })
  ),
  monto_actual: z.preprocess(
    // Permitir string, intentar convertir a número, manejar vacío como undefined
    (val) => {
      if (val === '' || val == null) return undefined; // Permitir campo vacío
      return typeof val === 'string' ? parseFloat(val.replace(/[,.]/g, '')) : val;
    },
    z.number({ invalid_type_error: 'El monto actual debe ser un número' })
      .nonnegative({ message: 'El monto actual no puede ser negativo' })
      .optional() // Hacerlo opcional en el schema
  ),
  fecha_objetivo: z.preprocess(
    // Permitir string o Date, manejar vacío/null como undefined
    (arg) => {
      if (arg === '' || arg == null) return undefined; // Permitir campo vacío/null
      // Intentar crear fecha solo si hay un valor no vacío
      if (typeof arg === 'string' || arg instanceof Date) {
        const date = new Date(arg);
        // Zod valida si la fecha es válida internamente
        return isNaN(date.getTime()) ? arg : date; // Devolver original si no es fecha válida para que falle Zod
      } 
      return undefined;
    }, 
    z.date({ errorMap: () => ({ message: 'Fecha objetivo inválida' }) }).nullable().optional() // Hacerlo opcional y permitir null
  ),
  // No incluimos 'estado' aquí, se manejará por defecto en el hook/DB
});

// Opcional: Tipo para TypeScript
// export type GoalFormData = z.infer<typeof goalFormSchema>; 