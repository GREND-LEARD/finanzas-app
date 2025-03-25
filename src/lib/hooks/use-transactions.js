import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { useAuthStore } from '../store/auth-store';

// Hook para obtener las transacciones
export function useTransactions() {
  const user = useAuthStore(state => state.user);
  
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

// Hook para agregar una transacción
export function useAddTransaction() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  
  return useMutation({
    mutationFn: async (transaction) => {
      const newTransaction = {
        ...transaction,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
    },
  });
}

// Hook para actualizar una transacción
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
    },
  });
}

// Hook para eliminar una transacción
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
    },
  });
} 