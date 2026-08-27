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
    <div className="card-pricing" style={{ padding: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid #e4e4e7', background: '#ffffff' }}>
      {/* Table Toolbar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e4e4e7', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '14px', color: '#71717a', fontSize: '13px' }}></i>
            <input
              type="text"
              className="text-input"
              style={{
                borderRadius: '9999px',
                paddingRight: '36px',
                paddingLeft: '32px',
                height: '38px',
                minHeight: '38px',
                width: '260px',
                fontSize: '13px'
              }}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <i
                className="fa-solid fa-xmark"
                style={{ position: 'absolute', left: '12px', color: '#71717a', cursor: 'pointer', fontSize: '13px' }}
                onClick={() => setSearchQuery('')}
              ></i>
            )}
          </div>

          {filterContent && (
            <button
              className={showFilters ? "button-primary-pill" : "button-outline-on-light"}
              style={{ fontSize: '13px', padding: '6px 14px', minHeight: '38px' }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fa-solid fa-filter"></i>
              <span>تصفية مفرزة</span>
              {showFilters ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selectedIds.size > 0 && (
            <span className="pill-tag-mint" style={{ marginLeft: '4px', fontSize: '12px' }}>
              تم تحديد {selectedIds.size} عنصر
            </span>
          )}

          {/* Import Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="button-outline-on-light"
              style={{ fontSize: '13px', padding: '6px 14px', minHeight: '38px' }}
              title="استيراد البيانات من Excel / CSV"
              onClick={() => {
                setShowImportMenu(!showImportMenu);
                setShowExportMenu(false);
              }}
            >
              <i className="fa-solid fa-file-import"></i>
              <span>استيراد</span>
              <i className={`fa-solid fa-chevron-${showImportMenu ? 'up' : 'down'}`} style={{ fontSize: '9px', opacity: 0.7 }}></i>
            </button>

            {showImportMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '12px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
                  zIndex: 50,
                  minWidth: '230px',
                  overflow: 'hidden',
                  fontFamily: 'var(--font-family-ui)',
                  padding: '6px'
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
                    padding: '8px 12px',
                    textAlign: 'right',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#000000',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-file-arrow-up" style={{ fontSize: '14px' }}></i>
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
                      padding: '8px 12px',
                      textAlign: 'right',
                      border: 'none',
                      borderRadius: '8px',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#000000',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f5')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <i className="fa-solid fa-download"></i>
                    <span>تحميل قالب Excel فارغ</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="button-outline-on-light"
              style={{ fontSize: '13px', padding: '6px 14px', minHeight: '38px' }}
              title="تصدير البيانات"
              onClick={() => {
                setShowExportMenu(!showExportMenu);
                setShowImportMenu(false);
              }}
            >
              <i className="fa-solid fa-download"></i>
              <span>تصدير</span>
              <i className={`fa-solid fa-chevron-${showExportMenu ? 'up' : 'down'}`} style={{ fontSize: '9px', opacity: 0.7 }}></i>
            </button>

            {showExportMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '12px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
                  zIndex: 50,
                  minWidth: '210px',
                  overflow: 'hidden',
                  fontFamily: 'var(--font-family-ui)',
                  padding: '6px'
                }}
              >
                <button
                  onClick={() => handleExport('excel')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'right',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#000000',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-file-excel text-emerald-600"></i>
                  <span>تصدير إكسيل (Excel .xlsx)</span>
                </button>

                <button
                  onClick={() => handleExport('csv')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'right',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#000000',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-file-csv text-blue-600"></i>
                  <span>تصدير نصي (CSV UTF-8)</span>
                </button>

                <button
                  onClick={() => handleExport('pdf')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'right',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#000000',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-file-pdf text-rose-600"></i>
                  <span>تصدير بي دي إف (PDF Doc)</span>
                </button>

                <button
                  onClick={() => handleExport('print')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'right',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#000000',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f4f4f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="fa-solid fa-print"></i>
                  <span>معاينة وطباعة تقرير رسمي</span>
                </button>
              </div>
            )}
          </div>

          {onAddClick && (
            <button className="button-primary-pill" style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }} onClick={onAddClick}>
              <i className="fa-solid fa-plus"></i>
              <span>{addLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Content */}
      {showFilters && filterContent && (
        <div style={{ padding: '16px 20px', background: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
          {filterContent}
        </div>
      )}

      {/* Main Table */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontFamily: 'var(--font-family-ui)' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
              <th style={{ width: '44px', textAlign: 'center', padding: '12px 14px' }}>
                <input
                  type="checkbox"
                  checked={filteredData.length > 0 && selectedIds.size === filteredData.length}
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer', accentColor: '#000000' }}
                />
              </th>
              {columns.map((col, index) => (
                <th key={index} style={{ width: col.width, padding: '12px 16px', fontSize: '12px', fontWeight: 550, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2px' }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '48px 16px', color: '#71717a' }}>
                  <i className="fa-solid fa-inbox" style={{ fontSize: '32px', marginBottom: '8px', display: 'block', opacity: 0.3 }}></i>
                  لا توجد نتائج مطابقة لخيارات البحث أو التصفية
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid #e4e4e7',
                    backgroundColor: selectedIds.has(row.id) ? 'rgba(0,0,0,0.03)' : '#ffffff',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedIds.has(row.id)) e.currentTarget.style.backgroundColor = '#f4f4f5';
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedIds.has(row.id)) e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <td style={{ textAlign: 'center', padding: '14px' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                      style={{ cursor: 'pointer', accentColor: '#000000' }}
                    />
                  </td>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={{ padding: '14px 16px', fontSize: '13.5px', fontWeight: 420, color: '#000000' }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#fafafa', borderTop: '1px solid #e4e4e7', fontSize: '12.5px', color: '#71717a' }}>
        <div>
          إجمالي العناصر المعروضة: <strong style={{ color: '#000000' }}>{filteredData.length}</strong> من أصل <strong style={{ color: '#000000' }}>{data.length}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {searchQuery && <span className="pill-tag-mint" style={{ fontSize: '11px' }}>نتائج مصفاة</span>}
          <span>مجموعة خالد السليم • ERP</span>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
