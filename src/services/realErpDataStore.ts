/**
 * Unified Real ERP Persistent Data Engine
 * Real Data Persistence Service for Khalid Al-Sulaim Commercial Group ERP
 *
 * Automatically syncs with Supabase when credentials exist,
 * and maintains full offline/local storage persistence with initial seeds.
 *
 * Ensures all additions, modifications, and deletions survive page reloads and browser restarts.
 */
import { supabase, isDummySupabase } from './supabaseClient';
import { journalEngine } from './accounting/journalEngine';

const STORAGE_PREFIX = 'ALSULAIM_ERP_DB_V1_';

function getLocalStore<T>(key: string, initialSeed: T[]): T[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(initialSeed));
      return initialSeed;
    }
    return JSON.parse(raw);
  } catch (e) {
    return initialSeed;
  }
}

function saveLocalStore<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to persist ${key} in localStorage`, e);
  }
}

export const realErpDataStore = {
  /**
   * Fetch real records for any module, merging local persistent state with Supabase
   */
  async getRecords<T extends { id: string | number }>(
    entityKey: string,
    initialSeed: T[] = []
  ): Promise<T[]> {
    if (!isDummySupabase) {
      try {
        const { data, error } = await supabase
          .from(entityKey)
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          saveLocalStore(entityKey, data as unknown as T[]);
          return data as unknown as T[];
        }
      } catch (e) {
        console.warn(`Supabase offline for ${entityKey}, falling back to persistent local engine.`);
      }
    }
    return getLocalStore<T>(entityKey, initialSeed);
  },

  /**
   * Save a newly created record permanently
   */
  async addRecord<T extends { id: string | number }>(
    entityKey: string,
    newRecord: T,
    initialSeed: T[] = []
  ): Promise<T[]> {
    // 1. Local Storage Persistence
    const current = getLocalStore<T>(entityKey, initialSeed);
    const updated = [newRecord, ...current];
    saveLocalStore(entityKey, updated);

    // 2. Supabase Sync (if active)
    if (!isDummySupabase) {
      try {
        await supabase.from(entityKey).insert([newRecord]);
      } catch (e) {
        console.warn(`Could not sync new record for ${entityKey} to Supabase`, e);
      }
    }

    // 3. Trigger Automated Double-Entry Accounting Entry where relevant
    this.triggerAccountingIntegration(entityKey, newRecord);

    return updated;
  },

  /**
   * Update an existing record permanently
   */
  async updateRecord<T extends { id: string | number }>(
    entityKey: string,
    id: string | number,
    patch: Partial<T>,
    initialSeed: T[] = []
  ): Promise<T[]> {
    const current = getLocalStore<T>(entityKey, initialSeed);
    const updated = current.map((item) => (item.id === id ? { ...item, ...patch } : item));
    saveLocalStore(entityKey, updated);

    if (!isDummySupabase) {
      try {
        await supabase.from(entityKey).update(patch as any).eq('id', id);
      } catch (e) {
        console.warn(`Could not sync update for ${entityKey} to Supabase`, e);
      }
    }

    return updated;
  },

  /**
   * Delete a record permanently
   */
  async deleteRecord<T extends { id: string | number }>(
    entityKey: string,
    id: string | number,
    initialSeed: T[] = []
  ): Promise<T[]> {
    const current = getLocalStore<T>(entityKey, initialSeed);
    const updated = current.filter((item) => item.id !== id);
    saveLocalStore(entityKey, updated);

    if (!isDummySupabase) {
      try {
        await supabase.from(entityKey).delete().eq('id', id);
      } catch (e) {
        console.warn(`Could not sync delete for ${entityKey} to Supabase`, e);
      }
    }

    return updated;
  },

  /**
   * Trigger double-entry accounting posting automatically upon operational events
   */
  triggerAccountingIntegration(entityKey: string, record: any) {
    try {
      if (entityKey === 'clients') {
        console.log(`[ERP Accounting Engine] Account Code ${record.account_code || '11020'} created for client: ${record.name}`);
      } else if (entityKey === 'recruitment-contracts' || entityKey === 'contracts') {
        journalEngine.createJournalEntry('SAF', {
          description: `إثبات عقد استقدام مساند جديد #${record.contract_number || record.id} - العميل: ${record.client_name}`,
          createdBy: 'نظام الأتمتة المحاسبية التلقائية',
          autoPost: true,
          lines: [
            { accountCode: '11030', accountName: 'حساب أمانات مساند (SAF Escrow)', debit: record.amount || 14500, credit: 0 },
            { accountCode: '41100', accountName: 'إيرادات عقود استقدام مساند', debit: 0, credit: (record.amount || 14500) * 0.87 },
            { accountCode: '21050', accountName: 'ضريبة القيمة المضافة (15%)', debit: 0, credit: (record.amount || 14500) * 0.13 }
          ]
        });
      } else if (entityKey === 'rent-contracts' || entityKey === 'rent_contracts') {
        journalEngine.createJournalEntry('SAF', {
          description: `إثبات عقد تأجير تشغيلي #${record.contract_number || record.id} - العميل: ${record.client_name}`,
          createdBy: 'نظام الأتمتة المحاسبية التلقائية',
          autoPost: true,
          lines: [
            { accountCode: '11020', accountName: 'مدينون وحسابات التأجير', debit: record.total_amount || 3450, credit: 0 },
            { accountCode: '41200', accountName: 'إيرادات خدمات التأجير والتشغيل', debit: 0, credit: (record.total_amount || 3450) * 0.87 },
            { accountCode: '21050', accountName: 'ضريبة القيمة المضافة (15%)', debit: 0, credit: (record.total_amount || 3450) * 0.13 }
          ]
        });
      } else if (entityKey === 'vouchers') {
        const isReceipt = record.type === 'قبض';
        journalEngine.createJournalEntry('SAF', {
          description: `سند ${record.type} #${record.voucher_no || record.id} - ${record.payee_payer}`,
          createdBy: 'النظام المحاسبي الآلي',
          autoPost: true,
          lines: [
            { accountCode: isReceipt ? '11010' : '51100', accountName: isReceipt ? 'الصندوق الرئيسي' : 'مصروفات تشغيلية', debit: record.amount || 1000, credit: 0 },
            { accountCode: isReceipt ? '41100' : '11010', accountName: isReceipt ? 'إيرادات سداد' : 'الصندوق الرئيسي', debit: 0, credit: record.amount || 1000 }
          ]
        });
      }
    } catch (e) {
        console.warn('Accounting auto-posting notice:', e);
    }
  }
};
