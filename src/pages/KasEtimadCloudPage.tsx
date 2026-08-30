import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, Plus, FileSpreadsheet, FileText, Search, Printer, 
  Trash2, Edit3, CheckCircle2, AlertCircle, TrendingUp, DollarSign,
  Download, Eye, Calculator, ArrowRightLeft, Sparkles, Layers, 
  ShieldCheck, X, RefreshCw, Landmark, Tag, Check, Award, BarChart3,
  Users, Star, MapPin, Phone, Mail, PieChart, Activity, Copy,
  Upload, FileUp, QrCode, Percent, ArrowUpRight, Shield, CheckSquare,
  Clock, Hash, Filter, Calendar, FolderSync, CreditCard, ChevronDown,
  Briefcase, Send, HelpCircle, FileCheck, CheckCircle, Flame, ExternalLink,
  MessageSquare, UserPlus, FilePlus, Play, Square, Settings, MoreVertical,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import { 
  KasEtmadCompetition, KasEtmadInvoice, KasEtmadEstimate, 
  KasEtmadClient, KasEtmadLead, KasEtmadProject, KasEtmadTask,
  EtmadModuleTab
} from '../types/kasEtmadSuite';
import { kasEtmadSuiteService } from '../services/kasEtmadSuiteService';
import { useAppStore } from '../stores/appStore';
import { useCompany } from '../contexts/CompanyContext';
import { tafqeet } from '../services/tafqeetService';

export const KasEtimadCloudPage: React.FC = () => {
  const { addNotification } = useAppStore();
  const { activeCompany } = useCompany();

  // Active Tab
  const [activeTab, setActiveTab] = useState<EtmadModuleTab>('dashboard');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Live Timer State
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Modals state
  const [showAddCompModal, setShowAddCompModal] = useState<boolean>(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState<boolean>(false);
  const [showAddEstimateModal, setShowAddEstimateModal] = useState<boolean>(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  // Form data
  const [formData, setFormData] = useState<any>({});

  // Reload trigger
  const [reloadKey, setReloadKey] = useState<number>(0);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else if (!isTimerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Data lists from Service
  const competitions = useMemo(() => kasEtmadSuiteService.getCompetitions(), [reloadKey]);
  const invoices = useMemo(() => kasEtmadSuiteService.getInvoices(), [reloadKey]);
  const estimates = useMemo(() => kasEtmadSuiteService.getEstimates(), [reloadKey]);
  const clients = useMemo(() => kasEtmadSuiteService.getClients(), [reloadKey]);
  const leads = useMemo(() => kasEtmadSuiteService.getLeads(), [reloadKey]);
  const projects = useMemo(() => kasEtmadSuiteService.getProjects(), [reloadKey]);
  const tasks = useMemo(() => kasEtmadSuiteService.getTasks(), [reloadKey]);
  const stats = useMemo(() => kasEtmadSuiteService.getDashboardStats(), [reloadKey]);

  // Filtered Competitions
  const filteredCompetitions = useMemo(() => {
    return competitions.filter(c => {
      const matchSearch = !searchQuery || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.referenceNumber.includes(searchQuery) ||
        c.governmentEntity.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [competitions, searchQuery, statusFilter, categoryFilter]);

  // Handlers for Add Competition
  const handleSaveCompetition = () => {
    if (!formData.title || !formData.title.trim()) {
      alert('يرجى إدخال اسم المنافسة');
      return;
    }
    kasEtmadSuiteService.addCompetition({
      title: formData.title,
      referenceNumber: formData.referenceNumber || `2603${Math.floor(10000000 + Math.random() * 90000000)}`,
      isWinner: formData.isWinner || 'No',
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      deadlineDate: formData.deadlineDate || new Date().toISOString().split('T')[0],
      category: formData.category || 'التجارة',
      governmentEntity: formData.governmentEntity || 'وزارة الحرس الوطني',
      createdAt: new Date().toISOString().split('T')[0],
      totalItemsValue: parseFloat(formData.totalItemsValue) || 0,
      status: formData.status || 'جديد',
      notes: formData.notes || '',
      contactName: formData.contactName || '',
      contactPhone: formData.contactPhone || ''
    });
    addNotification({
      title: 'تمت إضافة المنافسة بنجاح',
      message: `تم تسجيل منافسة "${formData.title}" في منظومة اعتماد كاس بنجاح.`,
      type: 'success'
    });
    setShowAddCompModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  // Handlers for Add Invoice
  const handleSaveInvoice = () => {
    if (!formData.clientName || !formData.amount) {
      alert('يرجى تحديد العميل وقيمة الفاتورة');
      return;
    }
    const amount = parseFloat(formData.amount) || 0;
    const taxAmount = Number((amount * 0.15).toFixed(2));
    kasEtmadSuiteService.addInvoice({
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(6, '0')}`,
      amount,
      taxAmount,
      date: formData.date || new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      clientName: formData.clientName,
      project: formData.project || '',
      tags: ['كاس للتجارة', 'ZATCA مرحلة 2'],
      status: formData.status || 'غير مدفوع',
      paidAmount: parseFloat(formData.paidAmount) || 0,
      items: [
        {
          description: formData.itemDescription || 'بند توريد معتمد',
          qty: 1,
          rate: amount,
          taxPct: 15,
          total: Number((amount + taxAmount).toFixed(2))
        }
      ]
    });
    addNotification({
      title: 'تم إنشاء الفاتورة',
      message: `تم إصدار الفاتورة للعميل ${formData.clientName} بنجاح.`,
      type: 'success'
    });
    setShowAddInvoiceModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  // Status Badge Helper
  const getStatusPill = (status: string) => {
    if (status.includes('تمت الترسية') || status === 'مدفوع' || status === 'مقبول' || status === 'مكتمل' || status === 'مكتملة') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">✓ {status}</span>;
    }
    if (status.includes('رفع العرض') || status === 'مدفوع جزئيًا' || status === 'مرسل' || status === 'قيد التقدم') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 border border-sky-500/20">⏳ {status}</span>;
    }
    if (status.includes('لاغي') || status === 'ملغي' || status === 'مرفوض' || status === 'غير مدفوع' || status === 'متأخر') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 border border-rose-500/20">✕ {status}</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">● {status}</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header matching Inova Etmad Cloud with KAS Emerald Theme */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner backdrop-blur-md">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[11px] font-black tracking-wider">
                  KAS ETMAD CLOUD
                </span>
                <span className="text-emerald-300 text-xs font-semibold">
                  مؤسسة خالد عبدالعزيز السليم للتجارة والمقاولات
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-white">
                منظومة سحابة اعتماد وإدارة المنافسات والفوترة الذكية
              </h1>
              <p className="text-emerald-200/70 text-xs mt-0.5">
                المنصة السحابية الموحدة لإدارة المنافسات، الفواتير ZATCA، عروض الأسعار، المشاريع، والعملاء
              </p>
            </div>
          </div>

          {/* Quick Header Actions & Timer Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Task Timer */}
            <div className="flex items-center bg-black/40 border border-emerald-500/40 rounded-xl px-3 py-1.5 backdrop-blur-md">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isTimerRunning 
                    ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                }`}
                title={isTimerRunning ? 'إيقاف المؤقت' : 'بدء المؤقت'}
              >
                {isTimerRunning ? <Square className="w-3.5 h-3.5 text-rose-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isTimerRunning ? 'إيقاف' : 'بدء المؤقت'}</span>
              </button>
              <span className="font-mono font-bold text-xs text-white mr-2.5">
                {formatTimer(timerSeconds)}
              </span>
            </div>

            {/* Quick Add Menu */}
            <button
              onClick={() => {
                if (activeTab === 'invoices') setShowAddInvoiceModal(true);
                else setShowAddCompModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>+ إضافة سريعة</span>
            </button>

            {/* Export Action */}
            <button
              onClick={() => {
                if (activeTab === 'invoices') kasEtmadSuiteService.exportInvoicesToXLSX();
                else kasEtmadSuiteService.exportCompetitionsToXLSX();
                addNotification({
                  title: 'تم التصدير',
                  message: 'تم تصدير البيانات بنجاح كملف إكسل.',
                  type: 'success'
                });
              }}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 backdrop-blur-md border border-white/10"
              title="تصدير كـ Excel"
            >
              <Download className="w-3.5 h-3.5 text-emerald-300" />
              <span>تصدير</span>
            </button>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center font-bold text-[10px]">
                أب
              </div>
              <span className="font-semibold text-white">م. أحمد البشير</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Module Navigation Bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3 overflow-x-auto max-w-full">
        {[
          { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart3 },
          { id: 'competitions', label: `المنافسات (${competitions.length})`, icon: Award, badge: 'اعتماد' },
          { id: 'sales-group', label: 'المبيعات والفوترة', icon: DollarSign, isDropdown: true, subTabs: ['estimates', 'invoices', 'payments', 'credit-notes', 'items'] },
          { id: 'clients', label: `العملاء (${clients.length})`, icon: Users },
          { id: 'leads', label: `العملاء المحتملين (${leads.length})`, icon: UserPlus },
          { id: 'projects', label: `المشاريع (${projects.length})`, icon: Briefcase },
          { id: 'tasks', label: `المهام (${tasks.length})`, icon: CheckSquare },
          { id: 'contracts', label: 'العقود والاشتراكات', icon: FileCheck },
          { id: 'expenses', label: 'المصروفات', icon: CreditCard },
          { id: 'tickets', label: 'الدعم الفني', icon: HelpCircle },
          { id: 'reports', label: 'التقارير والتحليلات', icon: TrendingUp },
        ].map(navItem => {
          const isActive = activeTab === navItem.id || (navItem.subTabs && navItem.subTabs.includes(activeTab));
          const Icon = navItem.icon;
          return (
            <button
              key={navItem.id}
              onClick={() => {
                if (navItem.id === 'sales-group') setActiveTab('invoices');
                else setActiveTab(navItem.id as any);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{navItem.label}</span>
              {navItem.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-900">
                  {navItem.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-Tabs for Sales if Sales Tab is Active */}
      {(activeTab === 'invoices' || activeTab === 'estimates' || activeTab === 'payments' || activeTab === 'credit-notes' || activeTab === 'items') && (
        <div className="flex flex-wrap items-center gap-2 p-2.5 bg-secondary/30 rounded-xl border border-border/50">
          <span className="text-xs font-semibold text-muted-foreground ml-2">قسم المبيعات:</span>
          {[
            { id: 'invoices', label: `الفواتير الإلكترونية (${invoices.length})` },
            { id: 'estimates', label: `عروض الأسعار (${estimates.length})` },
            { id: 'payments', label: 'المدفوعات وسندات القبض' },
            { id: 'credit-notes', label: 'إشعارات الائتمان الدائنة' },
            { id: 'items', label: 'جدول الكميات وبنود التسعير' }
          ].map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveTab(sub.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === sub.id
                  ? 'bg-foreground text-background font-bold shadow-sm'
                  : 'bg-card text-foreground hover:bg-secondary border border-border/30'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Executive Stats Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>المنافسات النشطة</span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-foreground">{stats.totalCompetitions}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">{stats.wonCompetitions} ترسية فائزة ({stats.winRate}%)</div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>إجمالي الفواتير</span>
                <DollarSign className="w-4 h-4 text-sky-500" />
              </div>
              <div className="mt-2 text-xl font-bold text-sky-600 truncate">{stats.totalInvoicesAmount.toLocaleString()} ر.س</div>
              <div className="text-[11px] text-muted-foreground mt-1">مبيعات كاس المعتمدة</div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>المبالغ المحصلة</span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-xl font-bold text-emerald-600 truncate">{stats.paidAmount.toLocaleString()} ر.س</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">مدفوعة بحسابات كاس</div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>فواتير قيد التحصيل</span>
                <Clock className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-2 text-xl font-bold text-rose-600 truncate">{stats.unpaidAmount.toLocaleString()} ر.س</div>
              <div className="text-[11px] text-muted-foreground mt-1">مستحقة الدفع</div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>المشاريع الجارية</span>
                <Briefcase className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-indigo-600">{stats.activeProjects}</div>
              <div className="text-[11px] text-muted-foreground mt-1">عقود ومشاريع كاس</div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>المهام النشطة</span>
                <CheckSquare className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-600">{stats.activeTasks}</div>
              <div className="text-[11px] text-muted-foreground mt-1">مهام فريق العمل</div>
            </div>
          </div>

          {/* Middle Row: Invoices Status Ribbon & Latest Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Invoices Status Ratio Card */}
            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>نظرة عامة على حالات الفواتير</span>
                </h3>
                <span className="text-xs font-bold text-muted-foreground font-mono">2026</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-rose-600">غير مدفوع (50%)</span>
                    <span className="font-mono">1 / 2</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-rose-500 h-2 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-600">مدفوع جزئياً (50%)</span>
                    <span className="font-mono">1 / 2</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-600">مدفوع بالكامل (100%)</span>
                    <span className="font-mono">1 / 3</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '33%' }} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAddInvoiceModal(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>+ إنشاء فاتورة جديدة</span>
              </button>
            </div>

            {/* Latest Tasks Box */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-sky-600" />
                  <span>آخر المهام وجداول التوريدات</span>
                </h3>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة مهمة</span>
                </button>
              </div>

              <div className="divide-y divide-border/40">
                {tasks.map(task => (
                  <div key={task.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        task.priority === 'عاجل' ? 'bg-rose-500 animate-ping' :
                        task.priority === 'مرتفع' ? 'bg-amber-500' : 'bg-sky-500'
                      }`} />
                      <div>
                        <div className="font-bold text-foreground leading-relaxed">{task.taskName}</div>
                        <div className="text-muted-foreground text-[11px] mt-0.5">
                          المسؤول: <span className="text-foreground font-medium">{task.assignedTo}</span> • استحقاق: <span className="font-mono">{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {getStatusPill(task.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Recent Competitions Table */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>أحدث منافسات وترسيات كاس (منصة اعتماد)</span>
              </h3>
              <button
                onClick={() => setActiveTab('competitions')}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <span>عرض جميع المنافسات ({competitions.length})</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-secondary text-foreground font-semibold border-b border-border">
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">اسم المنافسة</th>
                    <th className="p-2.5">الجهة الحكومية</th>
                    <th className="p-2.5">التصنيف</th>
                    <th className="p-2.5">الموعد النهائي</th>
                    <th className="p-2.5 text-left">قيمة البنود</th>
                    <th className="p-2.5">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {competitions.slice(0, 5).map((comp, idx) => (
                    <tr key={comp.id || idx} className="hover:bg-emerald-500/5">
                      <td className="p-2.5 font-mono text-muted-foreground">{comp.seq}</td>
                      <td className="p-2.5 font-semibold text-foreground max-w-xs truncate" title={comp.title}>{comp.title}</td>
                      <td className="p-2.5 text-muted-foreground">{comp.governmentEntity}</td>
                      <td className="p-2.5 font-medium">{comp.category}</td>
                      <td className="p-2.5 font-mono text-muted-foreground">{comp.deadlineDate}</td>
                      <td className="p-2.5 text-left font-mono font-bold text-foreground">{comp.totalItemsValue.toLocaleString()} ر.س</td>
                      <td className="p-2.5">{getStatusPill(comp.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. COMPETITIONS VIEW (المنافسات) */}
      {/* ========================================================================= */}
      {activeTab === 'competitions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث برقم المنافسة، العنوان، الجهة الحكومية..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-secondary/50 border border-border text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs"
              >
                <option value="all">كل التصنيفات</option>
                <option value="التجارة">التجارة</option>
                <option value="دعاية وإعلان">دعاية وإعلان</option>
                <option value="معارض ومؤتمرات">معارض ومؤتمرات</option>
                <option value="مقاولات">مقاولات</option>
                <option value="تقنية">تقنية</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs"
              >
                <option value="all">كل الحالات</option>
                <option value="جديد">جديد</option>
                <option value="تم رفع العرض الفني والمالي">تم رفع العرض الفني والمالي</option>
                <option value="تمت الترسية">تمت الترسية</option>
                <option value="لم يتم التسعير(لاغي)">لم يتم التسعير(لاغي)</option>
              </select>

              <button
                onClick={() => setShowAddCompModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>منافسة جديدة</span>
              </button>
            </div>
          </div>

          {/* Competitions Table */}
          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3 min-w-[280px]">اسم المنافسة</th>
                    <th className="p-3 min-w-[100px] text-center">هل فائز؟</th>
                    <th className="p-3 min-w-[110px]">تاريخ الاستحقاق</th>
                    <th className="p-3 min-w-[110px]">الموعد النهائي</th>
                    <th className="p-3 min-w-[110px]">التصنيف</th>
                    <th className="p-3 min-w-[180px]">الجهات الحكومية</th>
                    <th className="p-3 min-w-[110px]">تاريخ الإنشاء</th>
                    <th className="p-3 min-w-[120px] text-left">إجمالي البنود</th>
                    <th className="p-3 min-w-[140px]">الحالة</th>
                    <th className="p-3 w-24 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredCompetitions.map(comp => (
                    <tr key={comp.id} className="hover:bg-emerald-500/5 transition-colors">
                      <td className="p-3 text-center font-mono text-muted-foreground font-bold">{comp.seq}</td>
                      <td className="p-3 font-semibold text-foreground">
                        <div className="leading-relaxed">{comp.title}</div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">مرجع: {comp.referenceNumber}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          comp.isWinner === 'Yes' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-secondary text-muted-foreground'
                        }`}>
                          {comp.isWinner}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-muted-foreground">{comp.dueDate}</td>
                      <td className="p-3 font-mono text-muted-foreground">{comp.deadlineDate}</td>
                      <td className="p-3 font-medium">{comp.category}</td>
                      <td className="p-3 text-foreground">{comp.governmentEntity}</td>
                      <td className="p-3 font-mono text-muted-foreground">{comp.createdAt}</td>
                      <td className="p-3 text-left font-mono font-bold text-foreground">
                        {comp.totalItemsValue.toLocaleString()} ر.س
                      </td>
                      <td className="p-3">{getStatusPill(comp.status)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-[11px]">
                          <button
                            onClick={() => {
                              setSelectedDetail(comp);
                              setShowDetailModal(true);
                            }}
                            className="text-emerald-600 hover:underline"
                          >
                            عرض
                          </button>
                          <span className="text-muted-foreground">|</span>
                          <button
                            onClick={() => {
                              if (window.confirm(`حذف المنافسة "${comp.title}"؟`)) {
                                kasEtmadSuiteService.deleteCompetition(comp.id);
                                setReloadKey(k => k + 1);
                              }
                            }}
                            className="text-rose-600 hover:underline"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INVOICES VIEW (الفواتير) */}
      {/* ========================================================================= */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>سجل الفواتير الإلكترونية ZATCA المرحلة 2 (شركة كاس للتجارة)</span>
            </h3>
            <button
              onClick={() => setShowAddInvoiceModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء فاتورة جديدة</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">رقم الفاتورة</th>
                  <th className="p-3 text-left">المبلغ</th>
                  <th className="p-3 text-left">إجمالي الضريبة (15%)</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">العميل</th>
                  <th className="p-3">المشروع</th>
                  <th className="p-3">تاريخ الاستحقاق</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-mono font-bold text-emerald-600">{inv.invoiceNumber}</td>
                    <td className="p-3 text-left font-mono font-bold text-foreground">{inv.amount.toLocaleString()} ر.س</td>
                    <td className="p-3 text-left font-mono text-muted-foreground">{inv.taxAmount.toLocaleString()} ر.س</td>
                    <td className="p-3 font-mono text-muted-foreground">{inv.date}</td>
                    <td className="p-3 font-semibold text-foreground">{inv.clientName}</td>
                    <td className="p-3 text-muted-foreground">{inv.project || '-'}</td>
                    <td className="p-3 font-mono text-muted-foreground">{inv.dueDate}</td>
                    <td className="p-3">{getStatusPill(inv.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ESTIMATES VIEW (عروض الأسعار) */}
      {/* ========================================================================= */}
      {activeTab === 'estimates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-sky-600" />
              <span>عروض الأسعار المعتمدة (Estimates & Quotations)</span>
            </h3>
            <button
              onClick={() => setShowAddEstimateModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء عرض سعر</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">رقم العرض</th>
                  <th className="p-3 text-left">المبلغ الإجمالي</th>
                  <th className="p-3 text-left">الضريبة</th>
                  <th className="p-3">العميل</th>
                  <th className="p-3">المشروع</th>
                  <th className="p-3">تاريخ العرض</th>
                  <th className="p-3">تاريخ الانتهاء</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {estimates.map(est => (
                  <tr key={est.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-mono font-bold text-sky-600">{est.estimateNumber}</td>
                    <td className="p-3 text-left font-mono font-bold text-foreground">{est.totalAmount.toLocaleString()} ر.س</td>
                    <td className="p-3 text-left font-mono text-muted-foreground">{est.taxAmount.toLocaleString()} ر.س</td>
                    <td className="p-3 font-semibold text-foreground">{est.clientName}</td>
                    <td className="p-3 text-muted-foreground">{est.project || '-'}</td>
                    <td className="p-3 font-mono text-muted-foreground">{est.date}</td>
                    <td className="p-3 font-mono text-muted-foreground">{est.expiryDate}</td>
                    <td className="p-3">{getStatusPill(est.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CLIENTS VIEW (العملاء) */}
      {/* ========================================================================= */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>دليل العملاء والجهات الحكومية المتعاقدة</span>
            </h3>
            <button
              onClick={() => setShowAddClientModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عميل جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {clients.map(client => (
              <div key={client.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    {client.company.slice(0, 2)}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                    نشط
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm leading-snug">{client.company}</h4>
                  <p className="text-xs text-muted-foreground mt-1">جهة الاتصال: {client.primaryContact}</p>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 font-mono">
                  <div>📞 {client.phone}</div>
                  <div>✉️ {client.email}</div>
                  <div>📍 {client.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. LEADS VIEW (العملاء المحتملين) */}
      {/* ========================================================================= */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              <span>تتبع العملاء المحتملين والفرص التعاقدية (Leads)</span>
            </h3>
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة فرصة محتملة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leads.map(lead => (
              <div key={lead.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{lead.name}</span>
                  {getStatusPill(lead.status)}
                </div>
                <div className="text-xs text-muted-foreground">
                  <div>الجهة / الشركة: <span className="font-bold text-foreground">{lead.company}</span></div>
                  <div>المصدر: <span className="font-medium text-emerald-600">{lead.source}</span></div>
                  <div>المسؤول: <span className="text-foreground">{lead.assignedTo}</span></div>
                </div>
                <div className="p-3 bg-secondary/50 rounded-xl flex justify-between items-center text-xs font-mono">
                  <span>قيمة الفرصة المتوقعة:</span>
                  <span className="font-bold text-emerald-600">{lead.opportunityValue.toLocaleString()} ر.س</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. PROJECTS VIEW (المشاريع) */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <span>مشاريع وعقود شركة كاس للتجارة</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(proj => (
              <div key={proj.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-foreground text-base leading-snug">{proj.projectName}</h4>
                    <p className="text-xs text-muted-foreground mt-1">العميل: {proj.clientName}</p>
                  </div>
                  {getStatusPill(proj.status)}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>نسبة الإنجاز:</span>
                    <span className="font-mono text-emerald-600">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-secondary/40 p-3 rounded-xl">
                  <div>بدء: {proj.startDate}</div>
                  <div>الموعد: {proj.deadline}</div>
                  <div className="col-span-2 font-bold text-emerald-600 text-sm mt-1">
                    الميزانية: {proj.budget.toLocaleString()} ر.س
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD COMPETITION */}
      {/* ========================================================================= */}
      {showAddCompModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>إضافة منافسة حكومية جديدة (منظومة اعتماد كاس)</span>
              </h3>
              <button onClick={() => setShowAddCompModal(false)} className="p-1 rounded-lg text-muted-foreground hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="col-span-full">
                <label className="block font-medium text-foreground mb-1">اسم المنافسة *</label>
                <input
                  type="text"
                  placeholder="اسم المنافسة حسب كراسة الشروط..."
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">الرقم المرجعي (اعتماد)</label>
                <input
                  type="text"
                  placeholder="2603XXXXXXXX"
                  value={formData.referenceNumber || ''}
                  onChange={e => setFormData({ ...formData, referenceNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">الجهة الحكومية</label>
                <input
                  type="text"
                  placeholder="وزارة الحرس الوطني، الصحة..."
                  value={formData.governmentEntity || ''}
                  onChange={e => setFormData({ ...formData, governmentEntity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">التصنيف</label>
                <select
                  value={formData.category || 'التجارة'}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                >
                  <option value="التجارة">التجارة</option>
                  <option value="دعاية وإعلان">دعاية وإعلان</option>
                  <option value="معارض ومؤتمرات">معارض ومؤتمرات</option>
                  <option value="مقاولات">مقاولات</option>
                  <option value="سياحة وضيافة">سياحة وضيافة</option>
                  <option value="تقنية">تقنية</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">قيمة العرض (ر.س)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.totalItemsValue || ''}
                  onChange={e => setFormData({ ...formData, totalItemsValue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">الموعد النهائي للتقديم</label>
                <input
                  type="date"
                  value={formData.deadlineDate || ''}
                  onChange={e => setFormData({ ...formData, deadlineDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">الحالة</label>
                <select
                  value={formData.status || 'جديد'}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                >
                  <option value="جديد">جديد</option>
                  <option value="تم رفع العرض الفني والمالي">تم رفع العرض الفني والمالي</option>
                  <option value="تمت الترسية">تمت الترسية</option>
                  <option value="لم يتم التسعير(لاغي)">لم يتم التسعير(لاغي)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                onClick={() => setShowAddCompModal(false)}
                className="px-4 py-2 rounded-xl bg-secondary text-muted-foreground text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveCompetition}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                حفظ المنافسة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD INVOICE */}
      {/* ========================================================================= */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>إنشاء فاتورة ضريبية جديدة ZATCA</span>
              </h3>
              <button onClick={() => setShowAddInvoiceModal(false)} className="p-1 rounded-lg text-muted-foreground hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">العميل / الجهة *</label>
                <input
                  type="text"
                  placeholder="اسم العميل أو الجهة الحكومية..."
                  value={formData.clientName || ''}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">المبلغ الأساسي (قبل الضريبة) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-foreground mb-1">تاريخ الفاتورة</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button onClick={() => setShowAddInvoiceModal(false)} className="px-4 py-2 rounded-xl bg-secondary text-muted-foreground text-xs">إلغاء</button>
              <button onClick={handleSaveInvoice} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">حفظ وإصدار</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
