import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetFormSchema } from '../../lib/schemas/budget-form-schema';
import { formatDateForInput } from '../../lib/utils/format';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

export default function BudgetForm({
  onSubmit,
  categories = [], // Recibe las categorías (ya filtradas por tipo 'expense' preferiblemente)
  isLoading = false,
  isEditing = false,
  defaultValues = null, // Para editar
  onCancel, // Función para cerrar/cancelar
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control, // Necesario para componentes controlados si los hubiera
  } = useForm({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: '',
      amount: '',
      category_id: '',
      start_date: formatDateForInput(new Date()), // Valor inicial para fecha inicio
      end_date: formatDateForInput(new Date()), // Valor inicial para fecha fin
    },
  });

  useEffect(() => {
    // Llenar el formulario si estamos editando
    if (isEditing && defaultValues) {
      reset({
        name: defaultValues.name || '',
        amount: defaultValues.amount ? Math.abs(defaultValues.amount) : '',
        category_id: defaultValues.category_id || '',
        start_date: defaultValues.start_date ? formatDateForInput(defaultValues.start_date) : formatDateForInput(new Date()),
        end_date: defaultValues.end_date ? formatDateForInput(defaultValues.end_date) : formatDateForInput(new Date()),
      });
    } else if (!isEditing) {
      // Resetear a valores por defecto si cambiamos de editar a crear
      reset({
        name: '',
        amount: '',
        category_id: '',
        start_date: formatDateForInput(new Date()),
        end_date: formatDateForInput(new Date()),
      });
    }
  }, [isEditing, defaultValues, reset]);

  const processSubmit = (data) => {
    // Los datos ya vienen validados y con tipos correctos (Date, number) por Zod
    // onSubmit se encargará de llamar a la mutación correcta
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <Input
        label="Nombre del Presupuesto"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Ej: Comida mensual, Transporte Agosto"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Monto Presupuestado"
          type="number"
          step="0.01"
          {...register('amount')}
          error={errors.amount?.message}
          placeholder="500.00"
        />

        <Select
          label="Categoría"
          {...register('category_id')}
          error={errors.category_id?.message}
        >
          <option value="">Selecciona una categoría...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Input
          label="Fecha de Inicio"
          type="date"
          {...register('start_date')}
          error={errors.start_date?.message}
        />
         <Input
          label="Fecha de Fin"
          type="date"
          {...register('end_date')}
          error={errors.end_date?.message}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {isEditing ? 'Actualizar' : 'Crear'} Presupuesto
        </Button>
      </div>
    </form>
  );
} 