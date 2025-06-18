import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { useAuthStore } from '../store/auth-store';

// --- Fetch Financial Goals ---
const fetchFinancialGoals = async (userId) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('metas_financieras')
    .select('*')
    .eq('usuario_id', userId)
    .order('fecha_creacion', { ascending: false }); // Ordenar por creación, más recientes primero

  if (error) {
    console.error('Error fetching financial goals:', error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useFinancialGoals = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: ['metas_financieras', userId],
    queryFn: () => fetchFinancialGoals(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};

// --- Add Financial Goal ---
const addFinancialGoal = async (goalData) => {
  const { user } = useAuthStore.getState();
  if (!user) throw new Error('Usuario no autenticado');

  // Asegurar valores por defecto si no se proveen
  const goalPayload = {
    ...goalData,
    usuario_id: user.id,
    monto_actual: goalData.monto_actual || 0, // Iniciar en 0 si no se especifica
    estado: goalData.estado || 'activa', // Iniciar como activa
    // fecha_objetivo puede ser null/undefined si es opcional en el form
  };

  const { data, error } = await supabase
    .from('metas_financieras')
    .insert([goalPayload])
    .select();

  if (error) {
    console.error('Error adding financial goal:', error);
    throw new Error(error.message);
  }
  return data?.[0];
};

export const useAddFinancialGoal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;

  return useMutation({ 
    mutationFn: addFinancialGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas_financieras', userId] });
    },
    onError: (error) => {
      console.error('Mutation error adding financial goal:', error);
    }
  });
};

// --- Update Financial Goal ---
// Especialmente útil para actualizar monto_actual o estado
const updateFinancialGoal = async ({ id, ...updateData }) => {
   if (!id) throw new Error('ID de la meta es requerido para actualizar');
  
   // Aquí podríamos querer lógica adicional, por ejemplo, si se actualiza
   // monto_actual, recalcular el estado basado en monto_objetivo?
   // Por ahora, actualizamos directamente lo que se pasa.
   // El trigger en DB ya maneja el cambio a 'completada' si monto_actual >= monto_objetivo.

   const { data, error } = await supabase
    .from('metas_financieras')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating financial goal:', error);
    throw new Error(error.message);
  }
  return data?.[0];
};

export const useUpdateFinancialGoal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;

  return useMutation({
    mutationFn: updateFinancialGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas_financieras', userId] });
    },
     onError: (error) => {
      console.error('Mutation error updating financial goal:', error);
    }
  });
};

// --- Delete Financial Goal ---
const deleteFinancialGoal = async (id) => {
  if (!id) throw new Error('ID de la meta es requerido para eliminar');

  const { error } = await supabase
    .from('metas_financieras')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting financial goal:', error);
    throw new Error(error.message);
  }
  return id;
};

export const useDeleteFinancialGoal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;

  return useMutation({
    mutationFn: deleteFinancialGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas_financieras', userId] });
    },
     onError: (error) => {
      console.error('Mutation error deleting financial goal:', error);
    }
  });
}; 