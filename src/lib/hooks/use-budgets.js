import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { useAuthStore } from '../store/auth-store';

// --- Fetch Budgets ---
const fetchBudgets = async (userId) => {
  if (!userId) return []; // No intentar buscar si no hay userId

  const { data, error } = await supabase
    .from('budgets')
    .select(`
      *,
      categories ( name, color, icon ) 
    `)
    .eq('user_id', userId)
    .order('start_date', { ascending: false }); // Ordenar por fecha de inicio, más recientes primero

  if (error) {
    console.error('Error fetching budgets:', error);
    throw new Error(error.message);
  }
  
  // console.log('[fetchBudgets] Data:', data); // Log para depuración
  return data || [];
};

export const useBudgets = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: ['budgets', userId], // Clave de query incluye userId
    queryFn: () => fetchBudgets(userId),
    enabled: !!userId, // Solo ejecutar la query si hay un userId
    staleTime: 1000 * 60 * 5, // Considerar los datos frescos por 5 minutos
    gcTime: 1000 * 60 * 10, // Mantener en caché por 10 minutos
  });
};

// --- Add Budget ---
const addBudget = async (budgetData) => {
  const { user } = useAuthStore.getState(); // Obtener el estado más reciente
  if (!user) throw new Error('Usuario no autenticado');

  const budgetPayload = {
    ...budgetData,
    user_id: user.id,
    // category_id ya debería estar en budgetData
    // start_date y end_date ya deberían estar en budgetData
  };

  const { data, error } = await supabase
    .from('budgets')
    .insert([budgetPayload])
    .select(); // Devolver la fila insertada

  if (error) {
    console.error('Error adding budget:', error);
    throw new Error(error.message);
  }
  return data?.[0]; // Devolver el primer (y único) presupuesto insertado
};

export const useAddBudget = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;

  return useMutation({ 
    mutationFn: addBudget,
    onSuccess: () => {
      // Invalidar y refetchear la query de presupuestos cuando se añade uno nuevo
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] });
    },
    onError: (error) => {
      console.error('Mutation error adding budget:', error);
      // Aquí podrías mostrar un toast de error
    }
  });
};

// --- Update Budget ---
const updateBudget = async ({ id, ...updateData }) => {
   if (!id) throw new Error('ID del presupuesto es requerido para actualizar');
  
   const { data, error } = await supabase
    .from('budgets')
    .update(updateData)
    .eq('id', id)
    .select(); // Devolver la fila actualizada

  if (error) {
    console.error('Error updating budget:', error);
    throw new Error(error.message);
  }
  return data?.[0];
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;

  return useMutation({
    mutationFn: updateBudget,
    onSuccess: (updatedBudget) => {
      // Invalidar la query general
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] });
      
      // Opcional: Actualizar directamente el caché si prefieres
      // queryClient.setQueryData(['budgets', userId], (oldData) => 
      //  oldData?.map(budget => budget.id === updatedBudget.id ? updatedBudget : budget)
      // );
    },
     onError: (error) => {
      console.error('Mutation error updating budget:', error);
    }
  });
};

// --- Delete Budget ---
const deleteBudget = async (id) => {
  if (!id) throw new Error('ID del presupuesto es requerido para eliminar');

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting budget:', error);
    throw new Error(error.message);
  }
  return id; // Devolver el ID eliminado para posible uso en onSuccess
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;

  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: (deletedBudgetId) => {
      // Invalidar la query general
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] });
      
      // Opcional: Eliminar del caché directamente
      // queryClient.setQueryData(['budgets', userId], (oldData) => 
      //  oldData?.filter(budget => budget.id !== deletedBudgetId)
      // );
    },
     onError: (error) => {
      console.error('Mutation error deleting budget:', error);
    }
  });
}; 