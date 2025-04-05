import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalFormSchema } from '../../lib/schemas/goal-form-schema';
import { formatDateForInput } from '../../lib/utils/format';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function GoalForm({
  onSubmit,
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
  } = useForm({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: '',
      target_amount: '',
      current_amount: '', // Iniciar vacío, opcional
      target_date: '', // Iniciar vacío, opcional
    },
  });

  useEffect(() => {
    // Llenar el formulario si estamos editando
    if (isEditing && defaultValues) {
      reset({
        name: defaultValues.name || '',
        target_amount: defaultValues.target_amount || '',
        current_amount: defaultValues.current_amount != null ? defaultValues.current_amount : '', // Manejar 0 correctamente
        target_date: defaultValues.target_date ? formatDateForInput(defaultValues.target_date) : '',
      });
    } else if (!isEditing) {
      // Resetear a valores por defecto si cambiamos de editar a crear
      reset({
        name: '',
        target_amount: '',
        current_amount: '',
        target_date: '',
      });
    }
  }, [isEditing, defaultValues, reset]);

  const processSubmit = (data) => {
    // Zod ya da los tipos correctos (number, Date)
    // Convertir target_date a null si está vacío, antes de enviar
    const payload = {
      ...data,
      target_date: data.target_date ? data.target_date : null,
      // current_amount será undefined si está vacío, el hook lo manejará a 0
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <Input
        label="Nombre de la Meta"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Ej: Ahorrar para entrada de casa"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Monto Objetivo"
          type="number"
          step="0.01"
          {...register('target_amount')}
          error={errors.target_amount?.message}
          placeholder="10000.00"
        />
        <Input
          label="Monto Actual (Opcional)"
          type="number"
          step="0.01"
          {...register('current_amount')}
          error={errors.current_amount?.message}
          placeholder="0.00"
        />
      </div>

      <Input
        label="Fecha Objetivo (Opcional)"
        type="date"
        {...register('target_date')}
        error={errors.target_date?.message}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {isEditing ? 'Actualizar' : 'Crear'} Meta
        </Button>
      </div>
    </form>
  );
} 