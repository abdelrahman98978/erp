import React, { useState } from 'react';
import { exportData } from '../../services/exportService';

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

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onAddClick?: () => void;
  addLabel?: string;
  filterContent?: React.ReactNode;
  /** Export configuration — enables Excel/PDF/CSV buttons */
  exportConfig?: ExportConfig;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = 'ابحث في البيانات...',
  onAddClick,
  addLabel = 'إضافة جديد',
  filterContent,
  exportConfig
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredData = data.filter(row => {
    if (!searchQuery) return true;
    return JSON.stringify(row).toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(r => r.id)));
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

  /** Get data for export: use filtered data if search is active */
  const getExportData = (): any[] => {
    if (!exportConfig) return [];
    if (searchQuery) {
      // Use the filtered view data
      return filteredData as any[];
    }
    return exportConfig.rawData;
  };

  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    if (!exportConfig) return;
    exportData(exportConfig.sectionKey, getExportData(), format);
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
              onChange={e => setSearchQuery(e.target.value)}
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

          {/* Export Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-odoo btn-odoo-secondary"
              title="تصدير البيانات"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <i className="fa-solid fa-download"></i>
              <span>تصدير</span>
              <i className={`fa-solid fa-chevron-${showExportMenu ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
            </button>

            {showExportMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                zIndex: 50,
                minWidth: '180px',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => handleExport('excel')}
                  style={{
                    width: '100%', padding: '10px 16px', border: 'none', background: 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '13px', fontWeight: '600', fontFamily: 'inherit', textAlign: 'right'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-file-excel" style={{ color: '#10B981', fontSize: '16px' }}></i>
                  تصدير Excel (XLSX)
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  style={{
                    width: '100%', padding: '10px 16px', border: 'none', background: 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '13px', fontWeight: '600', fontFamily: 'inherit', textAlign: 'right'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-file-pdf" style={{ color: '#EF4444', fontSize: '16px' }}></i>
                  تصدير PDF
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  style={{
                    width: '100%', padding: '10px 16px', border: 'none', background: 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '13px', fontWeight: '600', fontFamily: 'inherit', textAlign: 'right'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-file-csv" style={{ color: '#3B82F6', fontSize: '16px' }}></i>
                  تصدير CSV
                </button>
              </div>
            )}
          </div>

          <button className="btn-odoo btn-odoo-secondary" title="طباعة" onClick={() => window.print()}>
            <i className="fa-solid fa-print"></i>
            <span>طباعة</span>
          </button>

          {onAddClick && (
            <button className="btn-odoo btn-odoo-primary" onClick={onAddClick}>
              <i className="fa-solid fa-plus"></i>
              <span>{addLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Drawer Panel */}
      {showFilters && filterContent && (
        <div className="filter-panel">
          {filterContent}
        </div>
      )}

      {/* Main Table */}
      <div className="data-table-wrapper">
        <table className="odoo-data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.size > 0 && selectedIds.size === filteredData.length}
                  onChange={toggleSelectAll}
                />
              </th>
              {columns.map((col, idx) => (
                <th key={idx} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <i className="fa-solid fa-folder-open" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
                  لا توجد بيانات مطابقة للبحث الحركي
                </td>
              </tr>
            ) : (
              filteredData.map(row => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr key={row.id} style={{ background: isSelected ? 'rgba(0, 160, 157, 0.05)' : undefined }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(row.id)}
                      />
                    </td>
                    {columns.map((col, cIdx) => {
                      const cellValue = typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as any);
                      return <td key={cIdx}>{cellValue}</td>;
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Pagination */}
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', fontSize: '13px', color: 'var(--text-muted)' }}>
        <span>عرض {filteredData.length} من إجمالي {data.length} عنصر</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 10px', height: '30px' }} disabled>السابق</button>
          <button className="btn-odoo btn-odoo-primary" style={{ padding: '4px 10px', height: '30px' }}>1</button>
          <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 10px', height: '30px' }}>التالي</button>
        </div>
      </div>
    </div>
  );
}
