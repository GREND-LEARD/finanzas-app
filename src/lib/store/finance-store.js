import { create } from 'zustand';
import { supabase } from '../supabase/client';

export const useFinanceStore = create((set, get) => ({
  transactions: [],
  categories: [],
  isLoading: false,
  error: null,
  
  // Obtener todas las transacciones del usuario actual
  fetchTransactions: async () => {
    const userId = get().userId;
    if (!userId) return;
    
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      set({ transactions: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Agregar una nueva transacción
  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select();
        
      if (error) throw error;
      
      set((state) => ({ 
        transactions: [data[0], ...state.transactions],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Actualizar una transacción existente
  updateTransaction: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      set((state) => ({
        transactions: state.transactions.map(
          (item) => (item.id === id ? data[0] : item)
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Eliminar una transacción
  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set((state) => ({
        transactions: state.transactions.filter((item) => item.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Obtener categorías
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      set({ categories: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Calcular totales para el dashboard
  getFinanceSummary: () => {
    const transactions = get().transactions;
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = income - expenses;
    
    // Agrupar gastos por categoría
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
      
    return {
      income,
      expenses,
      balance,
      expensesByCategory
    };
  }
})); 