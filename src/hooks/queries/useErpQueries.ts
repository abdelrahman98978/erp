import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTableRecords,
  insertTableRecord,
  updateTableRecord,
  deleteTableRecord,
  ListOptions,
} from '../../services/erpSupabaseService';
import { useCompany } from '../../contexts/CompanyContext';
import {
  MOCK_CLIENTS,
  MOCK_ORDERS,
  MOCK_RECRUITMENT_CONTRACTS,
  MOCK_RENT_CONTRACTS,
  MOCK_SHELTER_ITEMS,
  MOCK_EMPLOYEES,
} from '../../data/mockData';

import { realErpDataStore, getDataMode } from '../../services/realErpDataStore';

// --- Generic Table Hook with Cache Invalidation and Fallback ---
export function useTableData<T = any>(
  tableName: string,
  options: ListOptions = {},
  fallbackData: T[] = []
) {
  const { activeCompanyId } = useCompany();
  const effectiveCompanyId = options.companyId || (activeCompanyId !== 'all' ? activeCompanyId : undefined);

  return useQuery({
    queryKey: [tableName, effectiveCompanyId, options, getDataMode()],
    queryFn: async () => {
      const isProduction = getDataMode() === 'production_real';
      const effectiveFallback = isProduction ? [] : fallbackData;
      const records = await realErpDataStore.getRecords<any>(tableName, effectiveFallback);
      if (effectiveCompanyId && records.length > 0) {
        return records.filter((item: any) => !item.company_id && !item.companyId || item.company_id === effectiveCompanyId || item.companyId === effectiveCompanyId || item.companyId === 'all') as T[];
      }
      return records as T[];
    },
  });
}

// --- Specific Entity Query Hooks ---

export function useClients(options: ListOptions = {}) {
  return useTableData('clients', options, MOCK_CLIENTS);
}

export function useOrders(options: ListOptions = {}) {
  return useTableData('orders', options, MOCK_ORDERS);
}

export function useRecruitmentContracts(options: ListOptions = {}) {
  return useTableData('contracts', options, MOCK_RECRUITMENT_CONTRACTS);
}

export function useRentContracts(options: ListOptions = {}) {
  return useTableData('rent_contracts', options, MOCK_RENT_CONTRACTS);
}

export function useShelterRecords(options: ListOptions = {}) {
  return useTableData('shelter_records', options, MOCK_SHELTER_ITEMS);
}

export function useEmployees(options: ListOptions = {}) {
  return useTableData('employees', options, MOCK_EMPLOYEES);
}

export function useComplaints(options: ListOptions = {}) {
  return useTableData('complaints', options, []);
}

export function useAttendances(options: ListOptions = {}) {
  return useTableData('attendances', options, []);
}

export function useCustodies(options: ListOptions = {}) {
  return useTableData('custodies', options, []);
}

export function useCostCenters(options: ListOptions = {}) {
  return useTableData('cost_centers', options, []);
}

export function useJournals(options: ListOptions = {}) {
  return useTableData('company_journal_entries', options, []);
}

export function useZatcaInvoices(options: ListOptions = {}) {
  return useTableData('zatca_invoices', options, []);
}

export function useVouchers(options: ListOptions = {}) {
  return useTableData('vouchers', options, []);
}

// --- Generic Mutation Hook for Real-time CRUD ---
export function useTableMutation<T = any>(tableName: string) {
  const queryClient = useQueryClient();

  const createItem = useMutation({
    mutationFn: async (newRecord: Record<string, any>) => {
      // 1. Always persist to realErpDataStore (dual local + Supabase engine)
      const recordWithId = {
        id: newRecord.id || `${tableName.slice(0, 3).toUpperCase()}-${Date.now()}`,
        created_at: newRecord.created_at || new Date().toISOString(),
        ...newRecord,
      };
      await realErpDataStore.addRecord(tableName, recordWithId);
      return recordWithId as unknown as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Record<string, any> }) => {
      await realErpDataStore.updateRecord(tableName, id, data);
      return { id, ...data } as unknown as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string | number) => {
      await realErpDataStore.deleteRecord(tableName, id);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });

  return {
    createItem,
    updateItem,
    deleteItem,
  };
}
