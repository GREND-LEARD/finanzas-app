import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '../../lib/validations/finances';
import { formatDateForInput } from '../../lib/utils/format';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

export default function TransactionForm({
  onSubmit,
  defaultValues = {
    description: '',
    amount: '',
    date: new Date(),
    type: 'expense',
    category: '',
    notes: '',
  },
  categories = [],
  isLoading = false,
  isEditing = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      ...defaultValues,
      date: defaultValues.date ? formatDateForInput(defaultValues.date) : formatDateForInput(new Date()),
      amount: defaultValues.amount ? Math.abs(defaultValues.amount).toString() : '',
    },
  });

  const transactionType = watch('type');

  // Filtrar categorías según el tipo de transacción
  const filteredCategories = categories.filter(
    (category) => category.type === transactionType
  );

  const processSubmit = (data) => {
    // Convertir amount a número
    const amount = Number(data.amount);
    // Si es un gasto, convertir a negativo
    const finalAmount = data.type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

    onSubmit({
      ...data,
      amount: finalAmount,
      date: new Date(data.date),
    });
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <Input
        label="Descripción"
        {...register('description')}
        error={errors.description?.message}
        placeholder="Ej: Compra de supermercado"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Monto"
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
          error={errors.amount?.message}
          placeholder="0.00"
        />

        <Input
          label="Fecha"
          type="date"
          {...register('date')}
          error={errors.date?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Tipo"
          {...register('type')}
          error={errors.type?.message}
        >
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </Select>

        <Select
          label="Categoría"
          {...register('category')}
          error={errors.category?.message}
        >
          <option value="">Seleccionar categoría</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <Input
        label="Notas (opcional)"
        {...register('notes')}
        error={errors.notes?.message}
        placeholder="Agregar detalles adicionales"
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isEditing ? 'Actualizar' : 'Agregar'} Transacción
        </Button>
      </div>
    </form>
  );
} 