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

// --- Generic Table Hook with Cache Invalidation and Fallback ---
export function useTableData<T = any>(
  tableName: string,
  options: ListOptions = {},
  fallbackData: T[] = []
) {
  const { activeCompanyId } = useCompany();
  const effectiveCompanyId = options.companyId || (activeCompanyId !== 'all' ? activeCompanyId : undefined);

  return useQuery({
    queryKey: [tableName, effectiveCompanyId, options],
    queryFn: async () => {
      const res = await getTableRecords(tableName, {
        ...options,
        companyId: effectiveCompanyId,
      });
      if (res.error || !res.data || res.data.length === 0) {
        // Return fallback mock data filtered by company if applicable
        if (effectiveCompanyId && fallbackData.length > 0) {
          return fallbackData.filter((item: any) => !item.companyId || item.companyId === effectiveCompanyId || item.companyId === 'all');
        }
        return fallbackData;
      }
      return res.data as T[];
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
      const res = await insertTableRecord(tableName, newRecord);
      if (res.error) throw new Error(res.error);
      return res.data as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Record<string, any> }) => {
      const res = await updateTableRecord(tableName, id, data);
      if (res.error) throw new Error(res.error);
      return res.data as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await deleteTableRecord(tableName, id);
      if (res.error) throw new Error(res.error);
      return res.success;
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
