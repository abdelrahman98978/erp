import React, { useState, useRef, useCallback } from 'react';
import { Badge } from '../components/ui/Badge';
import {
  IMPORT_TEMPLATES,
  ImportTemplate,
  ParsedFileData,
  ColumnMap,
  ValidationResult,
  ImportResult,
  parseImportFile,
  autoMapColumns,
  validateImportData,
  executeImport,
  downloadTemplate,
  getImportHistory,
  ImportHistoryEntry,
} from '../services/importEngine';

// ─── Step enum ───────────────────────────────────────────────────────────────

type WizardStep = 'select-type' | 'upload' | 'mapping' | 'review' | 'results' | 'history';

// ─── Component ───────────────────────────────────────────────────────────────

export const DataImportWizardPage: React.FC = () => {
  const [step, setStep] = useState<WizardStep>('select-type');
  const [selectedTemplate, setSelectedTemplate] = useState<ImportTemplate | null>(null);
  const [parsedData, setParsedData] = useState<ParsedFileData | null>(null);
  const [columnMaps, setColumnMaps] = useState<ColumnMap[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // History state
  const [history] = useState<ImportHistoryEntry[]>(() => getImportHistory());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ─── Step Navigation ─────────────────────────────────────────────────────

  const STEPS: { key: WizardStep; label: string; icon: string }[] = [
    { key: 'select-type', label: 'اختر النوع', icon: 'category' },
    { key: 'upload', label: 'رفع الملف', icon: 'cloud_upload' },
    { key: 'mapping', label: 'تعيين الأعمدة', icon: 'swap_horiz' },
    { key: 'review', label: 'مراجعة وتحقق', icon: 'fact_check' },
    { key: 'results', label: 'النتائج', icon: 'check_circle' },
  ];

  const currentStepIndex = STEPS.findIndex(s => s.key === step);

  // Group mappings
  const DEPARTMENT_MAP: Record<string, string[]> = {
    recruitment: ['clients', 'cvs', 'contracts', 'rent_contracts', 'offices', 'shelter', 'sponsorship_transfers'],
    finance: ['chart_of_accounts', 'journal_entries', 'invoices', 'cost_centers', 'financial_requests'],
    hr: ['employees', 'attendances', 'custodies'],
    support: ['complaints'],
  };

  const filteredTemplates = IMPORT_TEMPLATES.filter(tmpl => {
    const matchesSearch = tmpl.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.fields.some(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (categoryFilter === 'all') return true;
    return DEPARTMENT_MAP[categoryFilter]?.includes(tmpl.entityKey);
  });

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleSelectTemplate = (tmpl: ImportTemplate) => {
    setSelectedTemplate(tmpl);
    setParsedData(null);
    setColumnMaps([]);
    setValidationResult(null);
    setImportResult(null);
    setUploadError(null);
    setStep('upload');
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (!selectedTemplate) return;
    setUploadError(null);
    try {
      const data = await parseImportFile(file);
      setParsedData(data);
      const maps = autoMapColumns(data.headers, selectedTemplate);
      setColumnMaps(maps);
      setStep('mapping');
    } catch (err: any) {
      setUploadError(err?.message || 'حدث خطأ أثناء قراءة الملف');
    }
  }, [selectedTemplate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleMappingChange = (systemField: string, fileColumn: string) => {
    setColumnMaps(prev =>
      prev.map(m => m.systemField === systemField ? { ...m, fileColumn } : m)
    );
  };

  const handleValidate = () => {
    if (!parsedData || !selectedTemplate) return;
    const result = validateImportData(parsedData.rows, columnMaps, selectedTemplate);
    setValidationResult(result);
    setStep('review');
  };

  const handleExecuteImport = async () => {
    if (!validationResult || !selectedTemplate) return;
    setIsImporting(true);
    try {
      const result = await executeImport(validationResult.valid, selectedTemplate.entityKey);
      result.warnings = validationResult.warnings;
      setImportResult(result);
      setStep('results');
    } catch (err: any) {
      console.error('Import failed:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setStep('select-type');
    setSelectedTemplate(null);
    setParsedData(null);
    setColumnMaps([]);
    setValidationResult(null);
    setImportResult(null);
    setUploadError(null);
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#000000', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#000000' }}>database</span>
            معالج استيراد البيانات المؤسسي
          </h2>
          <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
            استيراد بيانات من ملفات Excel أو CSV أو JSON إلى أقسام النظام بشكل آمن ومحقق
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="button-outline-on-light"
            style={{ padding: '6px 16px', fontSize: '12.5px', minHeight: '38px' }}
            onClick={() => setStep(step === 'history' ? 'select-type' : 'history')}
          >
            <i className="fa-solid fa-clock-rotate-left ml-1"></i>
            {step === 'history' ? 'العودة للمعالج' : 'سجل الاستيرادات'}
          </button>
          {step !== 'select-type' && step !== 'history' && (
            <button
              className="button-outline-on-light"
              style={{ padding: '6px 16px', fontSize: '12.5px', minHeight: '38px' }}
              onClick={handleReset}
            >
              <i className="fa-solid fa-rotate-right ml-1"></i>
              بدء من جديد
            </button>
          )}
        </div>
      </div>

      {/* Progress Stepper */}
      {step !== 'history' && (
        <div className="card-pricing" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#ffffff',
          borderRadius: '16px', padding: '18px 24px', marginBottom: '24px',
          border: '1px solid #e4e4e7',
        }}>
          {STEPS.map((s, idx) => (
            <React.Fragment key={s.key}>
              <div
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  opacity: idx <= currentStepIndex ? 1 : 0.4,
                  cursor: idx < currentStepIndex ? 'pointer' : 'default',
                }}
                onClick={() => idx < currentStepIndex && setStep(s.key)}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: idx < currentStepIndex ? '#000000' : idx === currentStepIndex ? '#000000' : '#f4f4f5',
                  color: idx <= currentStepIndex ? '#ffffff' : '#71717a', fontSize: '18px',
                  boxShadow: idx === currentStepIndex ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                  transition: 'all 0.3s ease',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {idx < currentStepIndex ? 'check' : s.icon}
                  </span>
                </div>
                <span style={{
                  fontSize: '11.5px', fontWeight: idx === currentStepIndex ? 550 : 420,
                  color: idx <= currentStepIndex ? '#000000' : '#a1a1aa',
                }}>
                  {s.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: '2px', margin: '0 8px',
                  background: idx < currentStepIndex ? '#000000' : '#e4e4e7',
                  borderRadius: '2px', marginBottom: '22px',
                  transition: 'background 0.3s ease',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* ═══ STEP 1: Select Type ═══ */}
      {step === 'select-type' && (
        <div>
          {/* Header, Search & Category Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined text-black" style={{ fontSize: '22px' }}>apps</span>
                اختر قسم أو نوع البيانات المراد استيرادها ({filteredTemplates.length} قالب جاهز)
              </h3>

              {/* Search Box */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#FFF', border: '1px solid #e4e4e7',
                borderRadius: '9999px', padding: '0 16px', width: '280px', height: '38px', minHeight: '38px'
              }}>
                <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
                <input
                  type="text"
                  placeholder="ابحث باسم القسم أو الحقول..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none', outline: 'none', background: 'transparent',
                    fontSize: '12px', width: '100%', fontFamily: 'Tajawal, sans-serif'
                  }}
                />
                {searchQuery && (
                  <i
                    className="fa-solid fa-xmark text-slate-400"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSearchQuery('')}
                  ></i>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'جميع الأقسام (16)', icon: 'fa-solid fa-border-all' },
                { id: 'recruitment', label: 'الاستقدام والتشغيل والعملاء', icon: 'fa-solid fa-users-gear' },
                { id: 'finance', label: 'المالية والمحاسبة والضرائب', icon: 'fa-solid fa-money-bill-transfer' },
                { id: 'hr', label: 'الموارد البشرية والحضور والعهد', icon: 'fa-solid fa-user-tie' },
                { id: 'support', label: 'الشكاوى والعمليات', icon: 'fa-solid fa-headset' },
              ].map(cat => {
                const isActive = categoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 16px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: isActive ? 550 : 420,
                      border: '1px solid',
                      borderColor: isActive ? '#000000' : '#e4e4e7',
                      background: isActive ? '#000000' : '#ffffff',
                      color: isActive ? '#ffffff' : '#27272a',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <i className={cat.icon}></i>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px', background: '#FAFBFC',
              borderRadius: '16px', border: '1px dashed #CBD5E1',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#CBD5E1' }}>search_off</span>
              <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>لم يتم العثور على أقسام مطابقة للبحث</p>
            </div>
          ) : (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '14px',
            }}>
              {filteredTemplates.map(tmpl => (
              <div
                key={tmpl.entityKey}
                onClick={() => handleSelectTemplate(tmpl)}
                style={{
                  background: '#FFF', borderRadius: '14px', padding: '20px',
                  border: '1.5px solid #E2E8F0', cursor: 'pointer',
                  transition: 'all 0.25s ease', position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = tmpl.color;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 25px ${tmpl.color}20`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, right: 0, left: 0, height: '4px',
                  background: tmpl.color,
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: `${tmpl.color}12`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: tmpl.color }}>
                      {tmpl.materialIcon}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>{tmpl.displayName}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                      {tmpl.fields.filter(f => f.required).length} حقول مطلوبة · {tmpl.fields.length} حقل إجمالي
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {tmpl.fields.filter(f => f.required).map(f => (
                    <span key={f.systemField} style={{
                      fontSize: '10px', background: `${tmpl.color}10`, color: tmpl.color,
                      padding: '2px 6px', borderRadius: '4px', fontWeight: '600',
                    }}>
                      {f.label}
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); downloadTemplate(tmpl); }}
                  style={{
                    marginTop: '12px', width: '100%', padding: '6px',
                    fontSize: '11px', fontWeight: '600', color: tmpl.color,
                    background: `${tmpl.color}08`, border: `1px solid ${tmpl.color}30`,
                    borderRadius: '8px', cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${tmpl.color}15`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${tmpl.color}08`}
                >
                  <i className="fa-solid fa-download" style={{ marginLeft: '4px' }}></i>
                  تحميل قالب Excel
                </button>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* ═══ STEP 2: Upload ═══ */}
      {step === 'upload' && selectedTemplate && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span className="material-symbols-outlined" style={{ color: selectedTemplate.color, fontSize: '24px' }}>
              {selectedTemplate.materialIcon}
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>
              رفع ملف {selectedTemplate.displayName}
            </h3>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? selectedTemplate.color : '#CBD5E1'}`,
              borderRadius: '16px', padding: '60px 40px',
              textAlign: 'center', cursor: 'pointer',
              background: isDragging ? `${selectedTemplate.color}05` : '#FAFBFC',
              transition: 'all 0.3s ease',
            }}
          >
            <span className="material-symbols-outlined" style={{
              fontSize: '56px', color: isDragging ? selectedTemplate.color : '#94A3B8',
              display: 'block', marginBottom: '12px',
            }}>
              {isDragging ? 'file_download' : 'cloud_upload'}
            </span>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
              {isDragging ? 'أفلت الملف هنا' : 'اسحب الملف هنا أو اضغط للاختيار'}
            </p>
            <p style={{ fontSize: '12px', color: '#94A3B8' }}>
              الأنواع المدعومة: <strong>.xlsx</strong> · <strong>.xls</strong> · <strong>.csv</strong> · <strong>.json</strong>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.json"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>

          {uploadError && (
            <div style={{
              marginTop: '16px', padding: '12px 16px', borderRadius: '10px',
              background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626',
              fontSize: '13px', fontWeight: '600',
            }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginLeft: '6px' }}></i>
              {uploadError}
            </div>
          )}

          {/* Template download reminder */}
          <div style={{
            marginTop: '20px', padding: '14px 18px', borderRadius: '12px',
            background: `${selectedTemplate.color}05`, border: `1px solid ${selectedTemplate.color}20`,
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span className="material-symbols-outlined" style={{ color: selectedTemplate.color, fontSize: '22px' }}>
              info
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                تحتاج قالب جاهز؟
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                حمّل قالب Excel يحتوي على الأعمدة المطلوبة والبيانات النموذجية
              </div>
            </div>
            <button
              onClick={() => downloadTemplate(selectedTemplate)}
              className="btn-odoo btn-odoo-primary"
              style={{ padding: '6px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}
            >
              <i className="fa-solid fa-download" style={{ marginLeft: '4px' }}></i>
              تحميل القالب
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: Column Mapping ═══ */}
      {step === 'mapping' && parsedData && selectedTemplate && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', verticalAlign: 'middle', marginLeft: '6px', color: '#005154' }}>swap_horiz</span>
              تعيين الأعمدة — ربط أعمدة الملف بحقول النظام
            </h3>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              <Badge text={`${parsedData.totalRows} سجل`} type="info" />
              <span style={{ margin: '0 8px' }}>·</span>
              <Badge text={parsedData.fileType} type="purple" />
              <span style={{ margin: '0 8px' }}>·</span>
              <span>{parsedData.fileName}</span>
            </div>
          </div>

          <div style={{
            background: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                    حقل النظام
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#64748B', borderBottom: '1px solid #E2E8F0', width: '50px' }}>
                    ←
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                    عمود الملف المرفوع
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                    معاينة (أول صف)
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedTemplate.fields.map(field => {
                  const mapping = columnMaps.find(m => m.systemField === field.systemField);
                  const previewValue = mapping?.fileColumn && parsedData.rows[0]
                    ? parsedData.rows[0][mapping.fileColumn]
                    : '—';
                  const isMapped = !!mapping?.fileColumn;

                  return (
                    <tr key={field.systemField} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>{field.label}</span>
                          {field.required && (
                            <span style={{ fontSize: '10px', color: '#DC2626', fontWeight: '800' }}>*</span>
                          )}
                        </div>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                          {field.type === 'number' ? 'رقم' : field.type === 'date' ? 'تاريخ' : field.type === 'email' ? 'بريد' : 'نص'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        <span className="material-symbols-outlined" style={{
                          fontSize: '20px',
                          color: isMapped ? '#059669' : '#CBD5E1',
                        }}>
                          {isMapped ? 'link' : 'link_off'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <select
                          value={mapping?.fileColumn || ''}
                          onChange={e => handleMappingChange(field.systemField, e.target.value)}
                          style={{
                            width: '100%', padding: '7px 10px', borderRadius: '8px',
                            border: `1.5px solid ${isMapped ? '#A7F3D0' : '#E2E8F0'}`,
                            background: isMapped ? '#ECFDF5' : '#FFF',
                            fontSize: '12px', fontWeight: '600', color: '#334155',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="">— لم يتم التعيين —</option>
                          {parsedData.headers.map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '12px', color: '#64748B' }}>
                        {isMapped ? String(previewValue) : <span style={{ color: '#CBD5E1' }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              className="btn-odoo btn-odoo-secondary"
              onClick={() => setStep('upload')}
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px' }}></i>
              رجوع
            </button>
            <button
              className="btn-odoo btn-odoo-primary"
              onClick={handleValidate}
              style={{ padding: '8px 24px', fontSize: '13px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginLeft: '4px' }}>fact_check</span>
              تحقق ومراجعة
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 4: Review ═══ */}
      {step === 'review' && validationResult && selectedTemplate && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#334155', marginBottom: '16px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', verticalAlign: 'middle', marginLeft: '6px', color: '#005154' }}>fact_check</span>
            نتائج التحقق من البيانات
          </h3>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
            <div style={{
              background: '#ECFDF5', borderRadius: '14px', padding: '18px',
              border: '1px solid #A7F3D0', textAlign: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#059669' }}>check_circle</span>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#059669', marginTop: '4px' }}>
                {validationResult.valid.length}
              </div>
              <div style={{ fontSize: '12px', color: '#065F46', fontWeight: '600' }}>سجل صالح للاستيراد</div>
            </div>
            <div style={{
              background: '#FFFBEB', borderRadius: '14px', padding: '18px',
              border: '1px solid #FCD34D', textAlign: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#D97706' }}>warning</span>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#D97706', marginTop: '4px' }}>
                {validationResult.warnings.length}
              </div>
              <div style={{ fontSize: '12px', color: '#92400E', fontWeight: '600' }}>تحذيرات (يمكن تجاوزها)</div>
            </div>
            <div style={{
              background: '#FEF2F2', borderRadius: '14px', padding: '18px',
              border: '1px solid #FCA5A5', textAlign: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#DC2626' }}>error</span>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#DC2626', marginTop: '4px' }}>
                {validationResult.errors.length}
              </div>
              <div style={{ fontSize: '12px', color: '#991B1B', fontWeight: '600' }}>أخطاء (لن يتم استيرادها)</div>
            </div>
          </div>

          {/* Error Details */}
          {validationResult.errors.length > 0 && (
            <div style={{
              background: '#FFF', borderRadius: '14px', border: '1px solid #FCA5A5',
              marginBottom: '16px', overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 16px', background: '#FEF2F2', borderBottom: '1px solid #FCA5A5', fontWeight: '700', fontSize: '13px', color: '#DC2626' }}>
                <i className="fa-solid fa-circle-xmark" style={{ marginLeft: '6px' }}></i>
                تفاصيل الأخطاء ({validationResult.errors.length})
              </div>
              <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#FFF5F5' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '700', color: '#991B1B' }}>الصف</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '700', color: '#991B1B' }}>الحقل</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '700', color: '#991B1B' }}>القيمة</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '700', color: '#991B1B' }}>الرسالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResult.errors.slice(0, 50).map((err, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #FEE2E2' }}>
                        <td style={{ padding: '6px 12px', fontWeight: '700' }}>{err.row}</td>
                        <td style={{ padding: '6px 12px' }}>{err.field}</td>
                        <td style={{ padding: '6px 12px', color: '#DC2626' }}>{String(err.value)}</td>
                        <td style={{ padding: '6px 12px' }}>{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Valid Data Preview */}
          {validationResult.valid.length > 0 && (
            <div style={{
              background: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0',
              marginBottom: '16px', overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 16px', background: '#F0FDF4', borderBottom: '1px solid #BBF7D0', fontWeight: '700', fontSize: '13px', color: '#059669' }}>
                <i className="fa-solid fa-check-double" style={{ marginLeft: '6px' }}></i>
                معاينة البيانات الصالحة (أول 5 سجلات)
              </div>
              <div style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {selectedTemplate.fields.slice(0, 6).map(f => (
                        <th key={f.systemField} style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '700', color: '#64748B', whiteSpace: 'nowrap' }}>
                          {f.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {validationResult.valid.slice(0, 5).map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        {selectedTemplate.fields.slice(0, 6).map(f => (
                          <td key={f.systemField} style={{ padding: '6px 12px', whiteSpace: 'nowrap' }}>
                            {String(row[f.systemField] || '—')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              className="btn-odoo btn-odoo-secondary"
              onClick={() => setStep('mapping')}
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px' }}></i>
              تعديل التعيين
            </button>
            <button
              className="btn-odoo btn-odoo-primary"
              onClick={handleExecuteImport}
              disabled={validationResult.valid.length === 0 || isImporting}
              style={{
                padding: '8px 24px', fontSize: '13px',
                opacity: validationResult.valid.length === 0 ? 0.5 : 1,
              }}
            >
              {isImporting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginLeft: '6px' }}></i>
                  جاري الاستيراد...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginLeft: '4px' }}>publish</span>
                  استيراد {validationResult.valid.length} سجل
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 5: Results ═══ */}
      {step === 'results' && importResult && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            background: importResult.failed === 0 ? '#ECFDF5' : '#FFFBEB',
            borderRadius: '20px', padding: '40px', marginBottom: '20px',
            border: `1px solid ${importResult.failed === 0 ? '#A7F3D0' : '#FCD34D'}`,
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: '64px',
              color: importResult.failed === 0 ? '#059669' : '#D97706',
              display: 'block', marginBottom: '12px',
            }}>
              {importResult.failed === 0 ? 'task_alt' : 'info'}
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', marginBottom: '8px' }}>
              {importResult.failed === 0
                ? 'تم الاستيراد بنجاح!'
                : 'اكتمل الاستيراد مع بعض الملاحظات'}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>
              تم استيراد <strong style={{ color: '#059669' }}>{importResult.imported}</strong> من أصل{' '}
              <strong>{importResult.total}</strong> سجل في{' '}
              <strong>{(importResult.duration / 1000).toFixed(1)}</strong> ثانية
            </p>

            <div style={{
              display: 'inline-flex', gap: '16px', padding: '12px 24px',
              background: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0',
            }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669' }}>{importResult.imported}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>تم استيراده</div>
              </div>
              <div style={{ width: '1px', background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#DC2626' }}>{importResult.failed}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>فشل</div>
              </div>
              <div style={{ width: '1px', background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#D97706' }}>{importResult.warnings.length}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>تحذيرات</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              className="btn-odoo btn-odoo-primary"
              onClick={handleReset}
              style={{ padding: '10px 28px', fontSize: '14px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginLeft: '4px' }}>add</span>
              استيراد بيانات أخرى
            </button>
            <button
              className="btn-odoo btn-odoo-secondary"
              onClick={() => setStep('history')}
              style={{ padding: '10px 28px', fontSize: '14px' }}
            >
              <i className="fa-solid fa-clock-rotate-left" style={{ marginLeft: '4px' }}></i>
              عرض سجل الاستيرادات
            </button>
          </div>
        </div>
      )}

      {/* ═══ HISTORY VIEW ═══ */}
      {step === 'history' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#334155', marginBottom: '16px' }}>
            <i className="fa-solid fa-clock-rotate-left" style={{ marginLeft: '6px', color: '#005154' }}></i>
            سجل عمليات الاستيراد
          </h3>

          {history.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px', background: '#FAFBFC',
              borderRadius: '16px', border: '1px dashed #CBD5E1',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#CBD5E1' }}>folder_open</span>
              <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>لا توجد عمليات استيراد سابقة</p>
            </div>
          ) : (
            <div style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: '700', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>التاريخ</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: '700', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>النوع</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: '700', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>تم استيراده</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: '700', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>فشل</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: '700', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>المدة</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: '700', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '8px 14px', fontSize: '12px' }}>
                        {new Date(entry.timestamp).toLocaleDateString('ar-SA')} {new Date(entry.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '8px 14px' }}>
                        <Badge text={entry.templateName} type="purple" />
                      </td>
                      <td style={{ padding: '8px 14px', fontWeight: '700', color: '#059669' }}>{entry.imported}</td>
                      <td style={{ padding: '8px 14px', fontWeight: '700', color: entry.failed > 0 ? '#DC2626' : '#94A3B8' }}>{entry.failed}</td>
                      <td style={{ padding: '8px 14px', fontSize: '12px', color: '#64748B' }}>
                        {(entry.duration / 1000).toFixed(1)}s
                      </td>
                      <td style={{ padding: '8px 14px' }}>
                        <Badge
                          text={entry.failed === 0 ? 'مكتمل' : 'مكتمل جزئياً'}
                          type={entry.failed === 0 ? 'success' : 'warning'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
