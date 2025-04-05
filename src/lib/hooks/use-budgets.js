import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { useAuthStore } from '../store/auth-store';

// --- Fetch Budgets ---
const fetchBudgets = async (userId) => {
  if (!userId) return [];

  // 1. Fetch basic budget data and related category info
  const { data: budgets, error: fetchError } = await supabase
    .from('budgets')
    .select(`
      *,
      categories ( name, color, icon ) 
    `)
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (fetchError) {
    console.error('Error fetching budgets:', fetchError);
    throw new Error(fetchError.message);
  }

  if (!budgets || budgets.length === 0) {
    return []; // No budgets found
  }

  // 2. For each budget, fetch the spent amount using the RPC function
  const budgetsWithSpentAmount = await Promise.all(
    budgets.map(async (budget) => {
      const { data: spentAmount, error: rpcError } = await supabase.rpc(
        'get_budget_spent_amount',
        { p_budget_id: budget.id } // Pass budget id to the function
      );

      if (rpcError) {
        console.error(`Error fetching spent amount for budget ${budget.id}:`, rpcError);
        // Decide how to handle error: return budget without spent amount, or throw?
        // For now, return with spentAmount = null or 0 to avoid breaking the list
        return { ...budget, spent_amount: 0 }; 
      }
      
      // console.log(`Budget ${budget.id} spent:`, spentAmount);
      return { ...budget, spent_amount: spentAmount || 0 }; // Add spent_amount to the object
    })
  );

  // console.log('[fetchBudgets] Data with spent amount:', budgetsWithSpentAmount); 
  return budgetsWithSpentAmount;
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