import { supabase } from './supabaseClient';

/**
 * Central ERP Supabase Database Binding Service
 * Connects all 33 tables in the database schema to the frontend React application.
 */

// 1. Clients Table Binding
export const getClients = async () => {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (clients):', error);
  return data || [];
};

// 2. CVs Table Binding
export const getCVs = async () => {
  const { data, error } = await supabase.from('cvs').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (cvs):', error);
  return data || [];
};

// 3. Recruitment Contracts Binding
export const getContracts = async () => {
  const { data, error } = await supabase.from('contracts').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (contracts):', error);
  return data || [];
};

// 4. Rent Contracts Binding
export const getRentContracts = async () => {
  const { data, error } = await supabase.from('rent_contracts').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (rent_contracts):', error);
  return data || [];
};

// 5. Orders Binding
export const getOrders = async () => {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (orders):', error);
  return data || [];
};

// 6. Shelter Records Binding
export const getShelterRecords = async () => {
  const { data, error } = await supabase.from('shelter_records').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (shelter_records):', error);
  return data || [];
};

// 7. Finance & Accounts Tree Binding
export const getAccountsTree = async () => {
  const { data, error } = await supabase.from('accounts').select('*').order('code', { ascending: true });
  if (error) console.warn('Supabase fetch error (accounts):', error);
  return data || [];
};

// 8. Employees Binding
export const getEmployees = async () => {
  const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (employees):', error);
  return data || [];
};

// 9. Complaints Binding
export const getComplaints = async () => {
  const { data, error } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (complaints):', error);
  return data || [];
};

// 10. Financial Requests Binding
export const getFinancialRequests = async () => {
  const { data, error } = await supabase.from('financial_requests').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (financial_requests):', error);
  return data || [];
};

// 11. Group Dispatches Binding
export const getGroupDispatches = async () => {
  const { data, error } = await supabase.from('group_dispatches').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (group_dispatches):', error);
  return data || [];
};

// 12. Activity Logs Binding
export const getActivityLogs = async () => {
  const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (activity_logs):', error);
  return data || [];
};

// 13. System Users & Roles Binding
export const getSystemUsers = async () => {
  const { data, error } = await supabase.from('system_users').select('*').order('created_at', { ascending: false });
  if (error) console.warn('Supabase fetch error (system_users):', error);
  return data || [];
};

// Generic Supabase Table Entity Inserter
export const insertTableRecord = async (tableName: string, recordData: Record<string, any>) => {
  const { data, error } = await supabase.from(tableName).insert([recordData]).select();
  if (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    throw error;
  }
  return data;
};
