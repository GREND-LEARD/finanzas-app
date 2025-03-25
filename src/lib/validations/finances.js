import { z } from 'zod';

export const transactionSchema = z.object({
  description: z
    .string()
    .min(3, { message: 'La descripción debe tener al menos 3 caracteres' })
    .max(100, { message: 'La descripción no puede exceder 100 caracteres' }),
  amount: z
    .number({ message: 'El monto debe ser un número válido' })
    .positive({ message: 'El monto debe ser mayor a cero' }),
  date: z.date({
    required_error: 'La fecha es requerida',
    invalid_type_error: 'Formato de fecha inválido',
  }),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Debe seleccionar un tipo válido (ingreso o gasto)' }),
  }),
  category: z.string().min(1, { message: 'La categoría es requerida' }),
  notes: z.string().optional(),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(50, { message: 'El nombre no puede exceder 50 caracteres' }),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Debe seleccionar un tipo válido (ingreso o gasto)' }),
  }),
  color: z.string().optional(),
  icon: z.string().optional(),
}); 