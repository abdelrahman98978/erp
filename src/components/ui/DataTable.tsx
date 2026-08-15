import React, { useState } from 'react';
import { exportData, ExportFormat } from '../../services/exportService';
import { useAppStore } from '../../stores/appStore';
import { IMPORT_TEMPLATES, downloadTemplate } from '../../services/importEngine';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: string;
}

export interface ExportConfig {
  /** Key matching SECTION_CONFIGS in exportService */
  sectionKey: string;
  /** Raw data array (not filtered) — filtered data is used when search is active */
  rawData: any[];
}

export interface TableImportConfig {
  /** Entity key matching IMPORT_TEMPLATES in importEngine */
  entityKey?: string;
  /** Custom callback for import */
  onImportClick?: () => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onAddClick?: () => void;
  addLabel?: string;
  filterContent?: React.ReactNode;
  /** Export configuration — enables Excel/PDF/CSV/Print buttons */
  exportConfig?: ExportConfig;
  /** Import configuration — enables Excel/CSV/JSON import and template download */
  importConfig?: TableImportConfig;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = 'ابحث في البيانات...',
  onAddClick,
  addLabel = 'إضافة جديد',
  filterContent,
  exportConfig,
  importConfig,
}: DataTableProps<T>) {
  const { setActiveTab } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);

  // Find matching import template if entityKey provided or derived from exportConfig
  const effectiveEntityKey = importConfig?.entityKey || exportConfig?.sectionKey;
  const matchingTemplate = effectiveEntityKey
    ? IMPORT_TEMPLATES.find(t => t.entityKey === effectiveEntityKey || t.entityKey === effectiveEntityKey.replace(/-/g, '_'))
    : undefined;

  const filteredData = data.filter((row) => {
    if (!searchQuery) return true;
    return JSON.stringify(row).toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map((r) => r.id)));
    }
  };

  const toggleSelectRow = (id: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  /** Get data for export: use filtered data or raw data */
  const getExportData = (): any[] => {
    if (exportConfig) {
      return searchQuery ? (filteredData as any[]) : exportConfig.rawData;
    }
    return filteredData as any[];
  };

  const handleExport = (format: ExportFormat) => {
    const sectionKey = exportConfig ? exportConfig.sectionKey : 'general_data';
    const exportRows = getExportData();
    exportData(sectionKey, exportRows, format);
    setShowExportMenu(false);
  };

  return (
    <div className="table-card">
      {/* Table Toolbar Header */}
      <div className="table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="table-search-box">
            <i className="fa-solid fa-magnifying-glass text-muted"></i>
            <input
              type="text"
              className="table-search-input"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <i
                className="fa-solid fa-xmark text-muted"
                style={{ cursor: 'pointer' }}
                onClick={() => setSearchQuery('')}
              ></i>
            )}
          </div>

          {filterContent && (
            <button
              className={`btn-odoo ${showFilters ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fa-solid fa-filter"></i>
              <span>تصفية مفرزة</span>
              {showFilters ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
            </button>
          )}
        </div>

        <div className="table-action-btns">
          {selectedIds.size > 0 && (
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--odoo-purple)', marginLeft: '8px' }}>
              تم تحديد {selectedIds.size} عنصر
            </span>
          )}

          {/* Import Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-odoo btn-odoo-secondary"
              title="استيراد البيانات من Excel / CSV"
              onClick={() => {
                setShowImportMenu(!showImportMenu);
                setShowExportMenu(false);
              }}
            >
              <i className="fa-solid fa-file-import text-purple-600"></i>
              <span>استيراد</span>
              <i className={`fa-solid fa-chevron-${showImportMenu ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
            </button>

            {showImportMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  zIndex: 50,
                  minWidth: '220px',
                  overflow: 'hidden',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <button
                  onClick={() => {
                    setShowImportMenu(false);
                    if (importConfig?.onImportClick) {
                      importConfig.onImportClick();
                    } else {
                      setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    textAlign: 'right',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#005154',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#005154' }}>publish</span>
                  <span>معالج الاستيراد (Excel / CSV)</span>
                </button>

                {matchingTemplate && (
                  <button
                    onClick={() => {
                      downloadTemplate(matchingTemplate);
                      setShowImportMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      textAlign: 'right',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#7C3AED',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <i className="fa-solid fa-download text-purple-600"></i>
                    <span>تحميل قالب Excel فارغ</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-odoo btn-odoo-secondary"
              title="تصدير البيانات"
              onClick={() => {
                setShowExportMenu(!showExportMenu);
                setShowImportMenu(false);
              }}
            >
              <i className="fa-solid fa-download"></i>
              <span>تصدير</span>
              <i className={`fa-solid fa-chevron-${showExportMenu ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
            </button>

            {showExportMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  zIndex: 50,
                  minWidth: '200px',
                  overflow: 'hidden',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <button
                  onClick={() => handleExport('excel')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    textAlign: 'right',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#005154',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-file-excel text-emerald-600"></i>
                  <span>تصدير إكسيل (Excel .xlsx)</span>
                </button>

                <button
                  onClick={() => handleExport('csv')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    textAlign: 'right',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#334155',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-file-csv text-blue-600"></i>
                  <span>تصدير نصي (CSV UTF-8)</span>
                </button>

                <button
                  onClick={() => handleExport('pdf')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    textAlign: 'right',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#991B1B',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-file-pdf text-rose-600"></i>
                  <span>تصدير بي دي إف (PDF Doc)</span>
                </button>

                <button
                  onClick={() => handleExport('print')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    textAlign: 'right',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#714B67',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-print text-purple-700"></i>
                  <span>معاينة وطباعة تقرير رسمي</span>
                </button>
              </div>
            )}
          </div>

          {onAddClick && (
            <button className="btn-odoo btn-odoo-purple" onClick={onAddClick}>
              <i className="fa-solid fa-plus"></i>
              <span>{addLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Content */}
      {showFilters && filterContent && (
        <div style={{ padding: '16px 20px', background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
          {filterContent}
        </div>
      )}

      {/* Main Table */}
      <div className="table-responsive">
        <table className="odoo-data-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={filteredData.length > 0 && selectedIds.size === filteredData.length}
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer', accentColor: 'var(--odoo-purple)' }}
                />
              </th>
              {columns.map((col, index) => (
                <th key={index} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  <i className="fa-solid fa-inbox" style={{ fontSize: '32px', marginBottom: '8px', display: 'block', opacity: 0.5 }}></i>
                  لا توجد نتائج مطابقة لخيارات البحث أو التصفية
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: selectedIds.has(row.id) ? 'rgba(113, 75, 103, 0.05)' : undefined,
                  }}
                >
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                      style={{ cursor: 'pointer', accentColor: 'var(--odoo-purple)' }}
                    />
                  </td>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8FAFC', borderTop: '1px solid #E5E7EB', fontSize: '12.5px', color: 'var(--text-muted)' }}>
        <div>
          إجمالي العناصر المعروضة: <strong>{filteredData.length}</strong> من أصل <strong>{data.length}</strong>
        </div>
        <div>
          {searchQuery && <span className="badge badge-purple" style={{ marginLeft: '6px' }}>نتائج مصفاة</span>}
          <span>نظام خالد السليم ERP</span>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
