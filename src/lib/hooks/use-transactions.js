import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { useAuthStore } from '../store/auth-store';

// Hook para obtener las transacciones con filtrado, ordenación y paginación
export function useTransactions(
  filters = {}, 
  sortConfig = { field: 'date', direction: 'desc' },
  page = 1, // Página actual (1-indexado)
  pageSize = 10 // Número de items por página
) {
  const user = useAuthStore(state => state.user);
  
  // Incluir paginación en queryKey
  const queryKey = ['transactions', user?.id, filters, sortConfig, page, pageSize];
  
  return useQuery({
    queryKey,
    queryFn: async ({ queryKey }) => {
      const [_key, userId, currentFilters, currentSortConfig, currentPage, currentPageSize] = queryKey;
      
      // --- LOG INICIO queryFn ---
      console.log('[queryFn] Iniciando fetch', { userId, currentFilters, currentSortConfig, currentPage, currentPageSize });
      // --- FIN LOG ---
      
      if (!userId) {
        console.log('[queryFn] No userId, devolviendo vacío.');
        return { data: [], count: 0 };
      }
      
      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' }) // Move select and count here temporarily for debugging? No, keep original structure.
        .eq('user_id', userId);

      // --- LOG ANTES DE FILTROS ---
      console.log('[queryFn] Query inicial antes de filtros:', query);
      // --- FIN LOG ---

      if (currentFilters) {
        // --- LOG DENTRO DE FILTROS ---
        console.log('[queryFn] Aplicando filtros:', currentFilters);
        // --- FIN LOG ---

        // ... (Lógica de filtros .ilike, .eq, .gte, .lte - SIN CAMBIOS) ...
        // Búsqueda de texto
        if (currentFilters.search) {
          console.log('[queryFn] Aplicando filtro: search');
          query = query.ilike('description', `%${currentFilters.search}%`); 
        }
        // Tipo
        if (currentFilters.type && currentFilters.type !== 'all') {
          console.log('[queryFn] Aplicando filtro: type');
          query = query.eq('type', currentFilters.type);
        }
        // Categoría
        if (currentFilters.category && currentFilters.category !== 'all') {
          console.log('[queryFn] Aplicando filtro: category');
          query = query.eq('category_id', currentFilters.category);
        }
        // Fecha Desde
        if (currentFilters.dateFrom) {
          console.log('[queryFn] Aplicando filtro: dateFrom');
          query = query.gte('date', currentFilters.dateFrom);
        }
        // Fecha Hasta
        if (currentFilters.dateTo) { 
          console.log('[queryFn] Aplicando filtro: dateTo');
          query = query.lte('date', currentFilters.dateTo); 
        }
        // Monto Mínimo
        if (currentFilters.amountMin) {
          console.log('[queryFn] Aplicando filtro: amountMin');
          const amountMin = parseFloat(currentFilters.amountMin);
          if (!isNaN(amountMin)) query = query.gte('amount', amountMin);
        }
        // Monto Máximo
        if (currentFilters.amountMax) {
          console.log('[queryFn] Aplicando filtro: amountMax');
          const amountMax = parseFloat(currentFilters.amountMax);
          if (!isNaN(amountMax)) query = query.lte('amount', amountMax);
        }
        // --- LOG FIN FILTROS ---
        console.log('[queryFn] Fin bloque de aplicación de filtros.');
        // --- FIN LOG ---
      } else {
        // --- LOG SIN FILTROS ---
        console.log('[queryFn] No se aplicaron filtros (currentFilters es falsy).');
        // --- FIN LOG ---
      }

      // --- LOG ANTES DE CONTEO ---
      console.log('[queryFn] Query antes de conteo construida.');
      // --- FIN LOG ---
      
      // --- Obtener Conteo Total ---
      // IMPORTANTE: Separar la obtención del conteo de la query principal para Supabase v2+
      // Primero, construimos la query base con filtros
      let countQuery = supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true }) // Pedir solo el conteo
        .eq('user_id', userId);

      // Re-aplicar filtros a la query de conteo
      if (currentFilters) {
        if (currentFilters.search) { countQuery = countQuery.ilike('description', `%${currentFilters.search}%`); }
        if (currentFilters.type && currentFilters.type !== 'all') { countQuery = countQuery.eq('type', currentFilters.type); }
        if (currentFilters.category && currentFilters.category !== 'all') { countQuery = countQuery.eq('category_id', currentFilters.category); }
        if (currentFilters.dateFrom) { countQuery = countQuery.gte('date', currentFilters.dateFrom); }
        if (currentFilters.dateTo) { countQuery = countQuery.lte('date', currentFilters.dateTo); }
        if (currentFilters.amountMin) { const amountMin = parseFloat(currentFilters.amountMin); if (!isNaN(amountMin)) countQuery = countQuery.gte('amount', amountMin); }
        if (currentFilters.amountMax) { const amountMax = parseFloat(currentFilters.amountMax); if (!isNaN(amountMax)) countQuery = countQuery.lte('amount', amountMax); }
      }

      console.log('[queryFn] Realizando llamada a Supabase para CONTEO...');
      const { count, error: countError } = await countQuery;
      console.log('[queryFn] Llamada a Supabase para CONTEO completada.');
      // --- FIN LOG ---

      // --- LOG DESPUÉS DE CONTEO ---
      console.log('[queryFn] Respuesta Conteo:', { count, countError });
      // --- FIN LOG ---

      if (countError) {
        console.error("[queryFn] Error en conteo:", countError);
        throw countError;
      }
      
      if (count === 0) {
          console.log('[queryFn] Conteo es 0, devolviendo vacío.');
          return { data: [], count: 0 };
      }

      // --- Calcular Rango ---
      const from = (currentPage - 1) * currentPageSize;
      const to = from + currentPageSize - 1;

      // --- Aplicar Ordenación ---
      const sortField = currentSortConfig?.field || 'date';
      const sortAscending = (currentSortConfig?.direction || 'desc') === 'asc';
      
      // --- LOG ANTES DE DATOS ---
      console.log('[queryFn] Query antes de datos (con orden y rango):', { from, to, sortField, sortAscending });
      // --- FIN LOG ---
      
      // --- Obtener Datos Paginados ---
      // Reconstruir la query para obtener los datos, aplicando filtros, orden y rango
      let dataQuery = supabase
        .from('transactions')
        .select('*') // Seleccionar todas las columnas para los datos
        .eq('user_id', userId);

      // Re-aplicar filtros a la query de datos
       if (currentFilters) {
        if (currentFilters.search) { dataQuery = dataQuery.ilike('description', `%${currentFilters.search}%`); }
        if (currentFilters.type && currentFilters.type !== 'all') { dataQuery = dataQuery.eq('type', currentFilters.type); }
        if (currentFilters.category && currentFilters.category !== 'all') { dataQuery = dataQuery.eq('category_id', currentFilters.category); }
        if (currentFilters.dateFrom) { dataQuery = dataQuery.gte('date', currentFilters.dateFrom); }
        if (currentFilters.dateTo) { dataQuery = dataQuery.lte('date', currentFilters.dateTo); }
        if (currentFilters.amountMin) { const amountMin = parseFloat(currentFilters.amountMin); if (!isNaN(amountMin)) dataQuery = dataQuery.gte('amount', amountMin); }
        if (currentFilters.amountMax) { const amountMax = parseFloat(currentFilters.amountMax); if (!isNaN(amountMax)) dataQuery = dataQuery.lte('amount', amountMax); }
      }
      
      // Aplicar ordenación y rango
      dataQuery = dataQuery
        .order(sortField, { ascending: sortAscending })
        .range(from, to);

      console.log('[queryFn] Realizando llamada a Supabase para DATOS...');
      const { data, error: dataError } = await dataQuery;
      console.log('[queryFn] Llamada a Supabase para DATOS completada.');
      // --- FIN LOG ---
      
      if (dataError) {
        console.error("[queryFn] Error en datos:", dataError);
        throw dataError;
      }
      
      console.log('[queryFn] Devolviendo datos y conteo final.')
      return { data: data || [], count: count || 0 };
    },
    enabled: !!user,
    // keepPreviousData: true // Opcional: Mantiene datos anteriores mientras carga los nuevos
  });
}

// Hook para agregar una transacción (CON DEPURACIÓN)
export function useAddTransaction() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  
  return useMutation({
    mutationFn: async (transaction) => {
      // Asegurarse de que el usuario exista
      if (!user) {
        throw new Error("Usuario no autenticado para agregar transacción.");
      }
      
      const newTransaction = {
        ...transaction,
        user_id: user.id, // Asegurar que user_id se añade
      };
      
      // --- LOGS DETALLADOS --- 
      console.log('[useAddTransaction] Datos a insertar:', newTransaction);
      // --- FIN LOGS ---
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction]) // Supabase espera un array para insert
        .select(); // Es importante el .select() para obtener la fila insertada
        
      // --- LOGS DETALLADOS --- 
      console.log('[useAddTransaction] Respuesta Supabase - data:', data);
      console.log('[useAddTransaction] Respuesta Supabase - error:', error);
      // --- FIN LOGS ---
        
      if (error) {
          // Lanzar el error específico de Supabase para que sea capturado
          throw error; 
      }
      
      // Devolver la primera fila insertada (Supabase devuelve array)
      return data?.[0]; 
    },
    onSuccess: (data, variables, context) => {
      // Invalidar todas las queries de transacciones para este usuario
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    },
    // Opcional: Añadir onError aquí también para loggear si es necesario
    // onError: (error) => {
    //   console.error("[useAddTransaction] Error en mutationFn:", error);
    // }
  });
}

// Hook para actualizar una transacción
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  
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
    onSuccess: (data, variables, context) => {
      // Invalidar todas las queries de transacciones para este usuario
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    },
  });
}

// Hook para eliminar una transacción
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    },
    onSuccess: (data, variables, context) => {
      // Invalidar todas las queries de transacciones para este usuario
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    },
  });
}

// --- Function to Fetch ALL Filtered Transactions (for export) ---
export const fetchAllFilteredTransactions = async (userId, filters = {}, sortConfig = { field: 'date', direction: 'desc' }) => {
  if (!userId) {
    console.warn('[fetchAllFilteredTransactions] No userId provided.');
    return [];
  }

  console.log('[fetchAllFilteredTransactions] Fetching with:', { userId, filters, sortConfig });

  let query = supabase
    .from('transactions')
    // Select transaction fields AND category name
    .select(`
      *,
      categories ( name )
    `)
    .eq('user_id', userId);

  // Apply Filters (similar logic to useTransactions queryFn)
  if (filters.search) {
    query = query.ilike('description', `%${filters.search}%`);
  }
  if (filters.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category_id', filters.category);
  }
  if (filters.dateFrom) {
    query = query.gte('date', filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte('date', filters.dateTo);
  }
  if (filters.amountMin) {
    const amountMin = parseFloat(filters.amountMin);
    if (!isNaN(amountMin)) query = query.gte('amount', amountMin);
  }
  if (filters.amountMax) {
    const amountMax = parseFloat(filters.amountMax);
    if (!isNaN(amountMax)) query = query.lte('amount', amountMax);
  }

  // Apply Sorting
  const sortField = sortConfig?.field || 'date';
  const sortAscending = (sortConfig?.direction || 'desc') === 'asc';
  query = query.order(sortField, { ascending: sortAscending });

  // Execute the query WITHOUT pagination (.range())
  const { data, error } = await query;

  if (error) {
    console.error('[fetchAllFilteredTransactions] Error fetching data:', error);
    throw new Error(error.message);
  }

  console.log(`[fetchAllFilteredTransactions] Fetched ${data?.length || 0} records.`);
  return data || [];
}; 