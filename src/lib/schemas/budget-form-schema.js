import { z } from 'zod';

export const budgetFormSchema = z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    .trim(),
  monto: z.preprocess(
    // Permitir string, intentar convertir a número
    (val) => typeof val === 'string' ? parseFloat(val.replace(/[,.]/g, '')) : val,
    z.number({ invalid_type_error: 'El monto debe ser un número' })
      .positive({ message: 'El monto del presupuesto debe ser positivo' })
  ),
  categoria_id: z.string()
    .uuid({ message: 'Debes seleccionar una categoría válida' })
    .min(1, { message: 'La categoría es obligatoria' }), // Asegurarse que no esté vacío
  fecha_inicio: z.preprocess(
    (arg) => typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined,
    z.date({ errorMap: () => ({ message: 'Fecha de inicio inválida' }) })
  ),
  fecha_fin: z.preprocess(
    (arg) => typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined,
    z.date({ errorMap: () => ({ message: 'Fecha de fin inválida' }) })
  ),
}).refine(data => data.fecha_fin >= data.fecha_inicio, {
  message: "La fecha de fin no puede ser anterior a la fecha de inicio",
  path: ["fecha_fin"], // Asociar el error al campo 'fecha_fin'
});

// Opcional: Tipo para TypeScript
// export type BudgetFormData = z.infer<typeof budgetFormSchema>; 