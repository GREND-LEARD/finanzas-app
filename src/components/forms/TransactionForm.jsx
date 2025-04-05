import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '../../lib/schemas/transaction-schema.js';
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
    category_id: '',
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
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues,
  });

  React.useEffect(() => {
    if (isEditing && defaultValues) {
      const formattedDefaults = {
        ...defaultValues,
        date: defaultValues.date ? formatDateForInput(defaultValues.date) : formatDateForInput(new Date()),
        amount: defaultValues.amount ? Math.abs(defaultValues.amount) : '',
        category_id: defaultValues.category_id || '',
      };
      reset(formattedDefaults);
    } else {
      reset({
        description: '',
        amount: '',
        date: formatDateForInput(new Date()),
        type: 'expense',
        category_id: '',
        notes: '',
      });
    }
  }, [isEditing, defaultValues, reset]);

  const transactionType = watch('type');

  const filteredCategories = categories.filter(
    (category) => category.type === transactionType
  );

  const processSubmit = (data) => {
    const finalAmount = data.type === 'expense' ? -Math.abs(data.amount) : Math.abs(data.amount);

    onSubmit({
      ...data,
      amount: finalAmount,
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
          {...register('amount')}
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
          {...register('category_id')}
          error={errors.category_id?.message}
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