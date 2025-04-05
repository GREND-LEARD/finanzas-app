import { z } from 'zod';

export const budgetFormSchema = z.object({
  name: z.string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    .trim(),
  amount: z.preprocess(
    // Permitir string, intentar convertir a número
    (val) => typeof val === 'string' ? parseFloat(val.replace(/[,.]/g, '')) : val,
    z.number({ invalid_type_error: 'El monto debe ser un número' })
      .positive({ message: 'El monto del presupuesto debe ser positivo' })
  ),
  category_id: z.string()
    .uuid({ message: 'Debes seleccionar una categoría válida' })
    .min(1, { message: 'La categoría es obligatoria' }), // Asegurarse que no esté vacío
  start_date: z.preprocess(
    (arg) => typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined,
    z.date({ errorMap: () => ({ message: 'Fecha de inicio inválida' }) })
  ),
  end_date: z.preprocess(
    (arg) => typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined,
    z.date({ errorMap: () => ({ message: 'Fecha de fin inválida' }) })
  ),
}).refine(data => data.end_date >= data.start_date, {
  message: "La fecha de fin no puede ser anterior a la fecha de inicio",
  path: ["end_date"], // Asociar el error al campo 'end_date'
});

// Opcional: Tipo para TypeScript
// export type BudgetFormData = z.infer<typeof budgetFormSchema>; 