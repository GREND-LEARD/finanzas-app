import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';

// Hook para obtener todas las categorías
export function useCategories() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre');
        
      if (error) throw error;
      return data;
    },
  });
}

// Hook para agregar una categoría
export function useAddCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category) => {
      const { data, error } = await supabase
        .from('categorias')
        .insert([category])
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categorias']);
    },
  });
}

// Hook para actualizar una categoría
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('categorias')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categorias']);
    },
  });
}

// Hook para eliminar una categoría
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categorias']);
    },
  });
} 