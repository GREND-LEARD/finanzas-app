import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { useAuthStore } from '../store/auth-store';

// --- Fetch Financial Goals ---
const fetchFinancialGoals = async (userId) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('financial_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false }); // Ordenar por creación, más recientes primero

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
    queryKey: ['financial_goals', userId],
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
    user_id: user.id,
    current_amount: goalData.current_amount || 0, // Iniciar en 0 si no se especifica
    status: goalData.status || 'active', // Iniciar como activa
    // target_date puede ser null/undefined si es opcional en el form
  };

  const { data, error } = await supabase
    .from('financial_goals')
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
      queryClient.invalidateQueries({ queryKey: ['financial_goals', userId] });
    },
    onError: (error) => {
      console.error('Mutation error adding financial goal:', error);
    }
  });
};

// --- Update Financial Goal ---
// Especialmente útil para actualizar current_amount o status
const updateFinancialGoal = async ({ id, ...updateData }) => {
   if (!id) throw new Error('ID de la meta es requerido para actualizar');
  
   // Aquí podríamos querer lógica adicional, por ejemplo, si se actualiza
   // current_amount, recalcular el status basado en target_amount?
   // Por ahora, actualizamos directamente lo que se pasa.
   // El trigger en DB ya maneja el cambio a 'completed' si current >= target.

   const { data, error } = await supabase
    .from('financial_goals')
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
      queryClient.invalidateQueries({ queryKey: ['financial_goals', userId] });
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
    .from('financial_goals')
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
      queryClient.invalidateQueries({ queryKey: ['financial_goals', userId] });
    },
     onError: (error) => {
      console.error('Mutation error deleting financial goal:', error);
    }
  });
}; 