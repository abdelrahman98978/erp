import { supabase, isDummySupabase } from './supabaseClient';

/**
 * Central ERP Supabase Database Binding Service
 * Connects all tables in the database schema to the frontend React application.
 *
 * Returns { data, error, count } shape to make failures visible to the UI.
 * Callers should display actual error states instead of empty arrays.
 */

// --- Generic CRUD Operations ---

export type ListOptions = {
  order?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
  select?: string;
  companyId?: string;
};

/**
 * Get records from any table with optional filtering, ordering, and pagination.
 * Returns a discriminated { data, error, count } so the UI can react to failures.
 */
export const getTableRecords = async (
  tableName: string,
  options: ListOptions = {}
): Promise<{ data: any[] | null; error: string | null; count: number | null }> => {
  if (isDummySupabase) {
    return { data: [], error: null, count: 0 };
  }

  try {
    const selectColumns = options.select ?? '*';
    let query = supabase.from(tableName).select(selectColumns, { count: 'exact' });

    if (options.companyId && options.companyId !== 'all') {
      query = query.eq('company_id', options.companyId);
    }

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });
    }

    if (options.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending ?? false,
      });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    if (options.limit) {
      const from = options.offset || 0;
      const to = from + options.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    if (error) {
      console.warn(`Supabase fetch notice (${tableName}):`, error.message);
      return { data: [], error: error.message, count: null };
    }
    return { data: (data as any[]) ?? [], error: null, count };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Offline mode active', count: 0 };
  }
};

/**
 * Insert a record into a table. Returns a discriminated { data, error } result.
 */
export const insertTableRecord = async (
  tableName: string,
  recordData: Record<string, any>
): Promise<{ data: any | null; error: string | null }> => {
  const { data, error } = await supabase
    .from(tableName)
    .insert([recordData])
    .select()
    .single();
  if (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    return { data: null, error: error.message };
  }
  return { data, error: null };
};

/**
 * Update a record by id. Returns a discriminated { data, error } result.
 */
export const updateTableRecord = async (
  tableName: string,
  id: string | number,
  recordData: Record<string, any>
): Promise<{ data: any | null; error: string | null }> => {
  const { data, error } = await supabase
    .from(tableName)
    .update(recordData)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error(`Error updating ${tableName}:`, error);
    return { data: null, error: error.message };
  }
  return { data, error: null };
};

/**
 * Delete a record by id. Returns { success, error } result.
 */
export const deleteTableRecord = async (
  tableName: string,
  id: string | number
): Promise<{ success: boolean; error: string | null }> => {
  const { error } = await supabase.from(tableName).delete().eq('id', id);
  if (error) {
    console.error(`Error deleting from ${tableName}:`, error);
    return { success: false, error: error.message };
  }
  return { success: true, error: null };
};

// --- Specialized Bindings ---

export const getClients = (options: ListOptions = {}) => getTableRecords('clients', options);
export const getCVs = (options: ListOptions = {}) => getTableRecords('cvs', options);
export const getContracts = (options: ListOptions = {}) => getTableRecords('contracts', options);
export const getRentContracts = (options: ListOptions = {}) =>
  getTableRecords('rent_contracts', options);
export const getOrders = (options: ListOptions = {}) => getTableRecords('orders', options);
export const getShelterRecords = (options: ListOptions = {}) =>
  getTableRecords('shelter_records', options);
export const getAccountsTree = (options: ListOptions = {}) =>
  getTableRecords('accounts', { order: { column: 'code', ascending: true }, ...options });
export const getEmployees = (options: ListOptions = {}) => getTableRecords('employees', options);
export const getComplaints = (options: ListOptions = {}) => getTableRecords('complaints', options);
export const getFinancialRequests = (options: ListOptions = {}) =>
  getTableRecords('financial_requests', options);
export const getGroupDispatches = (options: ListOptions = {}) =>
  getTableRecords('group_dispatches', options);
export const getActivityLogs = (options: ListOptions = {}) =>
  getTableRecords('activity_logs', options);
export const getSystemUsers = (options: ListOptions = {}) =>
  getTableRecords('system_users', options);
export const getAttendances = (options: ListOptions = {}) =>
  getTableRecords('attendances', options);
export const getBranchCommunications = (options: ListOptions = {}) =>
  getTableRecords('branch_communications', options);
export const getCustodies = (options: ListOptions = {}) => getTableRecords('custodies', options);
export const getVouchers = (options: ListOptions = {}) => getTableRecords('vouchers', options);
export const getCostCenters = (options: ListOptions = {}) => getTableRecords('cost_centers', options);
export const getZatcaInvoices = (options: ListOptions = {}) =>
  getTableRecords('zatca_invoices', options);
export const getWebsiteVisitors = (options: ListOptions = {}) =>
  getTableRecords('website_visitors', options);
export const getWhatsappMessages = (options: ListOptions = {}) =>
  getTableRecords('whatsapp_messages', options);
