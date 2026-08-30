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
  ChevronRight, ChevronLeft, Receipt, BookOpen, AlertTriangle, CheckCheck
} from 'lucide-react';
import { 
  KasEtmadCompetition, KasEtmadInvoice, KasEtmadEstimate, 
  KasEtmadPayment, KasEtmadItem, KasEtmadClient, KasEtmadLead, 
  KasEtmadProject, KasEtmadTask, KasEtmadContract, KasEtmadExpense,
  KasEtmadTicket, KasEtmadKnowledgeArticle, EtmadModuleTab
} from '../types/kasEtmadSuite';
import { kasEtmadSuiteService } from '../services/kasEtmadSuiteService';
import { useAppStore } from '../stores/appStore';
import { useCompany } from '../contexts/CompanyContext';
import { tafqeet } from '../services/tafqeetService';
import { generateZatcaQR } from '../services/zatcaPhase2Service';

export const KasEtimadCloudPage: React.FC = () => {
  const { addNotification } = useAppStore();
  const { activeCompany } = useCompany();

  // Active Module Tab
  const [activeTab, setActiveTab] = useState<EtmadModuleTab>('dashboard');

  // Search & Filter state
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
  const [showAddPaymentModal, setShowAddPaymentModal] = useState<boolean>(false);
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState<boolean>(false);
  const [showAddContractModal, setShowAddContractModal] = useState<boolean>(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);
  const [showAddTicketModal, setShowAddTicketModal] = useState<boolean>(false);

  // Detail / Print Modal
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [detailType, setDetailType] = useState<'competition' | 'invoice' | 'estimate' | 'contract'>('competition');

  // Form State
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
  const payments = useMemo(() => kasEtmadSuiteService.getPayments(), [reloadKey]);
  const items = useMemo(() => kasEtmadSuiteService.getItems(), [reloadKey]);
  const clients = useMemo(() => kasEtmadSuiteService.getClients(), [reloadKey]);
  const leads = useMemo(() => kasEtmadSuiteService.getLeads(), [reloadKey]);
  const projects = useMemo(() => kasEtmadSuiteService.getProjects(), [reloadKey]);
  const tasks = useMemo(() => kasEtmadSuiteService.getTasks(), [reloadKey]);
  const contracts = useMemo(() => kasEtmadSuiteService.getContracts(), [reloadKey]);
  const expenses = useMemo(() => kasEtmadSuiteService.getExpenses(), [reloadKey]);
  const tickets = useMemo(() => kasEtmadSuiteService.getTickets(), [reloadKey]);
  const knowledge = useMemo(() => kasEtmadSuiteService.getKnowledgeArticles(), [reloadKey]);
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

  // Save Handlers
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

  const handleSaveEstimate = () => {
    if (!formData.clientName || !formData.totalAmount) {
      alert('يرجى إدخال اسم العميل والقيمة');
      return;
    }
    const totalAmount = parseFloat(formData.totalAmount) || 0;
    const taxAmount = Number((totalAmount * 0.15).toFixed(2));
    kasEtmadSuiteService.addEstimate({
      estimateNumber: `EST-${String(estimates.length + 1).padStart(6, '0')}`,
      totalAmount,
      taxAmount,
      date: formData.date || new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || new Date().toISOString().split('T')[0],
      clientName: formData.clientName,
      project: formData.project || '',
      reference: formData.reference || 'REF-KAS',
      status: formData.status || 'مسودة',
      items: [
        {
          description: formData.itemDescription || 'بند عرض سعر',
          qty: 1,
          rate: totalAmount,
          taxPct: 15,
          total: Number((totalAmount + taxAmount).toFixed(2))
        }
      ]
    });
    addNotification({
      title: 'تم حفظ عرض السعر',
      message: 'تم تسجيل عرض السعر في منظومة كاس.',
      type: 'success'
    });
    setShowAddEstimateModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSavePayment = () => {
    if (!formData.invoiceNumber || !formData.amount) {
      alert('يرجى تحديد رقم الفاتورة والمبلغ');
      return;
    }
    kasEtmadSuiteService.addPayment({
      paymentNumber: `PAY-${String(payments.length + 1).padStart(6, '0')}`,
      invoiceNumber: formData.invoiceNumber,
      paymentMode: formData.paymentMode || 'تحويل بنكي',
      transactionId: formData.transactionId || `TXN-${Date.now()}`,
      clientName: formData.clientName || 'عميل كاس',
      amount: parseFloat(formData.amount) || 0,
      date: formData.date || new Date().toISOString().split('T')[0],
      notes: formData.notes || ''
    });
    addNotification({
      title: 'تم تسجيل الدفعة',
      message: 'تم قيد سند القبض البنكي بنجاح.',
      type: 'success'
    });
    setShowAddPaymentModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveItem = () => {
    if (!formData.description || !formData.rate) {
      alert('يرجى إدخال وصف البند وسعره');
      return;
    }
    kasEtmadSuiteService.addItem({
      description: formData.description,
      longDescription: formData.longDescription || '',
      rate: parseFloat(formData.rate) || 0,
      taxPct: 15,
      unit: formData.unit || 'عدد',
      group: formData.group || 'توريدات حكومية'
    });
    setShowAddItemModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveContract = () => {
    if (!formData.subject || !formData.clientName) {
      alert('يرجى إدخال موضوع العقد والعميل');
      return;
    }
    kasEtmadSuiteService.addContract({
      subject: formData.subject,
      clientName: formData.clientName,
      contractType: formData.contractType || 'توريد بضائع',
      contractValue: parseFloat(formData.contractValue) || 0,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || new Date().toISOString().split('T')[0],
      status: formData.status || 'ساري'
    });
    setShowAddContractModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveExpense = () => {
    if (!formData.expenseName || !formData.amount) {
      alert('يرجى إدخال اسم المصروف والمبلغ');
      return;
    }
    const amount = parseFloat(formData.amount) || 0;
    kasEtmadSuiteService.addExpense({
      category: formData.category || 'مصاريف مشتريات',
      amount,
      taxAmount: Number((amount * 0.15).toFixed(2)),
      expenseName: formData.expenseName,
      date: formData.date || new Date().toISOString().split('T')[0],
      clientName: formData.clientName,
      project: formData.project,
      paymentMode: formData.paymentMode || 'تحويل بنكي'
    });
    setShowAddExpenseModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveTicket = () => {
    if (!formData.subject || !formData.department) {
      alert('يرجى إدخال موضوع التذكرة والقسم');
      return;
    }
    kasEtmadSuiteService.addTicket({
      subject: formData.subject,
      department: formData.department,
      service: formData.service || 'خدمة عامة',
      contact: formData.contact || 'م. أحمد البشير',
      status: 'مفتوحة',
      priority: formData.priority || 'متوسط',
      lastReply: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });
    setShowAddTicketModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  // Status Badge Helper
  const getStatusPill = (status: string) => {
    if (status.includes('تمت الترسية') || status === 'مدفوع' || status === 'مقبول' || status === 'مكتمل' || status === 'مكتملة' || status === 'ساري') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">✓ {status}</span>;
    }
    if (status.includes('رفع العرض') || status === 'مدفوع جزئيًا' || status === 'مرسل' || status === 'قيد التقدم' || status === 'مفتوحة' || status === 'مفتوح') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 border border-sky-500/20">⏳ {status}</span>;
    }
    if (status.includes('لاغي') || status === 'ملغي' || status === 'مرفوض' || status === 'غير مدفوع' || status === 'متأخر' || status === 'حرج') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 border border-rose-500/20">✕ {status}</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">● {status}</span>;
  };

  return (
    <div className="space-y-6 pb-16">
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
                else if (activeTab === 'estimates') setShowAddEstimateModal(true);
                else if (activeTab === 'payments') setShowAddPaymentModal(true);
                else if (activeTab === 'items') setShowAddItemModal(true);
                else if (activeTab === 'contracts') setShowAddContractModal(true);
                else if (activeTab === 'expenses') setShowAddExpenseModal(true);
                else if (activeTab === 'tickets') setShowAddTicketModal(true);
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
          { id: 'invoices', label: `الفواتير (${invoices.length})`, icon: DollarSign },
          { id: 'estimates', label: `عروض الأسعار (${estimates.length})`, icon: FileSpreadsheet },
          { id: 'payments', label: `المدفوعات (${payments.length})`, icon: Receipt },
          { id: 'items', label: `جدول الكميات (${items.length})`, icon: Layers },
          { id: 'clients', label: `العملاء (${clients.length})`, icon: Users },
          { id: 'leads', label: `العملاء المحتملين (${leads.length})`, icon: UserPlus },
          { id: 'projects', label: `المشاريع (${projects.length})`, icon: Briefcase },
          { id: 'tasks', label: `المهام (${tasks.length})`, icon: CheckSquare },
          { id: 'contracts', label: `العقود (${contracts.length})`, icon: FileCheck },
          { id: 'expenses', label: `المصروفات (${expenses.length})`, icon: CreditCard },
          { id: 'tickets', label: `الدعم (${tickets.length})`, icon: HelpCircle },
          { id: 'knowledge-base', label: `قاعدة المعرفة (${knowledge.length})`, icon: BookOpen },
          { id: 'calendar', label: 'التقويم', icon: Calendar },
          { id: 'reports', label: 'التقارير المالية', icon: TrendingUp },
        ].map(navItem => {
          const isActive = activeTab === navItem.id;
          const Icon = navItem.icon;
          return (
            <button
              key={navItem.id}
              onClick={() => setActiveTab(navItem.id as any)}
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
                    <div>{getStatusPill(task.status)}</div>
                  </div>
                ))}
              </div>
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
                              setDetailType('competition');
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
                  <th className="p-3 text-center">إجراءات</th>
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
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedDetail(inv);
                          setDetailType('invoice');
                          setShowDetailModal(true);
                        }}
                        className="text-emerald-600 hover:underline text-[11px] font-bold"
                      >
                        عرض / طباعة
                      </button>
                    </td>
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
      {/* 5. PAYMENTS VIEW (المدفوعات وسندات القبض) */}
      {/* ========================================================================= */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <span>سجل المدفوعات وسندات القبض البنكية</span>
            </h3>
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل سند قبض</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">رقم السند</th>
                  <th className="p-3">رقم الفاتورة</th>
                  <th className="p-3">العميل</th>
                  <th className="p-3 text-left">المبلغ</th>
                  <th className="p-3">طريقة الدفع</th>
                  <th className="p-3">رقم المعاملة البنكية</th>
                  <th className="p-3">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-mono font-bold text-emerald-600">{pay.paymentNumber}</td>
                    <td className="p-3 font-mono text-foreground font-semibold">{pay.invoiceNumber}</td>
                    <td className="p-3 font-semibold">{pay.clientName}</td>
                    <td className="p-3 text-left font-mono font-bold text-foreground">{pay.amount.toLocaleString()} ر.س</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-secondary font-medium">{pay.paymentMode}</span></td>
                    <td className="p-3 font-mono text-muted-foreground">{pay.transactionId}</td>
                    <td className="p-3 font-mono text-muted-foreground">{pay.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ITEMS VIEW (جدول الكميات وبنود التسعير) */}
      {/* ========================================================================= */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>دليل بنود التوريد وجداول الكميات المعتمدة</span>
            </h3>
            <button
              onClick={() => setShowAddItemModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة صنف جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map(it => (
              <div key={it.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600">
                    {it.group}
                  </span>
                  <span className="text-xs font-mono font-bold text-muted-foreground">الوحدة: {it.unit}</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm leading-snug">{it.description}</h4>
                  {it.longDescription && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.longDescription}</p>
                  )}
                </div>
                <div className="p-3 bg-secondary/50 rounded-xl flex justify-between items-center text-xs font-mono">
                  <span>سعر التوريد:</span>
                  <span className="font-bold text-emerald-600 text-sm">{it.rate.toLocaleString()} ر.س</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CONTRACTS VIEW (العقود والاشتراكات) */}
      {/* ========================================================================= */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>سجل العقود والاتفاقيات الحكومية والتجارية</span>
            </h3>
            <button
              onClick={() => setShowAddContractModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>عقد جديد</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">موضوع العقد</th>
                  <th className="p-3">العميل</th>
                  <th className="p-3">نوع العقد</th>
                  <th className="p-3 text-left">قيمة العقد</th>
                  <th className="p-3">تاريخ البدء</th>
                  <th className="p-3">تاريخ الانتهاء</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {contracts.map(cnt => (
                  <tr key={cnt.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-semibold text-foreground">{cnt.subject}</td>
                    <td className="p-3">{cnt.clientName}</td>
                    <td className="p-3 font-medium">{cnt.contractType}</td>
                    <td className="p-3 text-left font-mono font-bold text-foreground">{cnt.contractValue.toLocaleString()} ر.س</td>
                    <td className="p-3 font-mono text-muted-foreground">{cnt.startDate}</td>
                    <td className="p-3 font-mono text-muted-foreground">{cnt.endDate}</td>
                    <td className="p-3">{getStatusPill(cnt.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. EXPENSES VIEW (المصروفات) */}
      {/* ========================================================================= */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-600" />
              <span>سجل المصروفات ومشتريات المنافسات</span>
            </h3>
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل مصروف</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">بيان المصروف</th>
                  <th className="p-3">الفئة</th>
                  <th className="p-3 text-left">المبلغ</th>
                  <th className="p-3 text-left">الضريبة (15%)</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">طريقة الدفع</th>
                  <th className="p-3">المشروع المرتبط</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-semibold text-foreground">{exp.expenseName}</td>
                    <td className="p-3 font-medium text-muted-foreground">{exp.category}</td>
                    <td className="p-3 text-left font-mono font-bold text-rose-600">{exp.amount.toLocaleString()} ر.س</td>
                    <td className="p-3 text-left font-mono text-muted-foreground">{exp.taxAmount.toLocaleString()} ر.س</td>
                    <td className="p-3 font-mono text-muted-foreground">{exp.date}</td>
                    <td className="p-3">{exp.paymentMode}</td>
                    <td className="p-3 text-muted-foreground">{exp.project || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TICKETS VIEW (الدعم الفني) */}
      {/* ========================================================================= */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span>تذاكر الدعم والطلبات الفنية والمتابعات</span>
            </h3>
            <button
              onClick={() => setShowAddTicketModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>تذكرة جديدة</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">موضوع التذكرة</th>
                  <th className="p-3">القسم</th>
                  <th className="p-3">جهة الاتصال</th>
                  <th className="p-3">الأولوية</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">آخر رد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {tickets.map(tkt => (
                  <tr key={tkt.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-semibold text-foreground">{tkt.subject}</td>
                    <td className="p-3 font-medium text-emerald-600">{tkt.department}</td>
                    <td className="p-3 text-muted-foreground">{tkt.contact}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-secondary font-bold text-[11px]">{tkt.priority}</span></td>
                    <td className="p-3">{getStatusPill(tkt.status)}</td>
                    <td className="p-3 font-mono text-muted-foreground text-[11px]">{tkt.lastReply}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. KNOWLEDGE BASE VIEW (قاعدة المعرفة) */}
      {/* ========================================================================= */}
      {activeTab === 'knowledge-base' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>قاعدة المعرفة واللوائح المعتمدة لمنصة اعتماد</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledge.map(art => (
              <div key={art.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">
                    {art.category}
                  </span>
                  <span className="text-muted-foreground font-mono">👁️ {art.viewsCount} مشاهدة</span>
                </div>
                <h4 className="font-bold text-foreground text-base leading-snug">{art.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{art.summary}</p>
                <div className="p-3 bg-secondary/40 rounded-xl text-xs text-foreground/80 leading-relaxed font-sans border-r-2 border-emerald-500">
                  {art.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. CALENDAR VIEW (التقويم) */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>التقويم الزمني للمنافسات والمهام واستحقاقات الفواتير</span>
            </h3>
            <span className="text-xs font-bold text-muted-foreground font-mono">أغسطس - سبتمبر 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex justify-between text-xs font-bold text-emerald-700">
                <span>02 مارس 2026</span>
                <span>منافسة</span>
              </div>
              <p className="text-xs font-semibold text-foreground">مشروع تركيب خيام هرمية بميدان العرض بالطائف</p>
              <div className="text-[11px] text-muted-foreground">استحقاق تقديم العرض المالي والفني</div>
            </div>

            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-2">
              <div className="flex justify-between text-xs font-bold text-sky-700">
                <span>05 مارس 2026</span>
                <span>منافسة</span>
              </div>
              <p className="text-xs font-semibold text-foreground">احتفالات عيد الفطر المبارك لعام 2026م</p>
              <div className="text-[11px] text-muted-foreground">ترسية وتوريد بوكسات الضيافة</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex justify-between text-xs font-bold text-amber-700">
                <span>10 مارس 2026</span>
                <span>فاتورة</span>
              </div>
              <p className="text-xs font-semibold text-foreground">استحقاق فاتورة INV-000001 (56,006.00 ر.س)</p>
              <div className="text-[11px] text-muted-foreground">مؤسسة خالد السليم للتجارة</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. REPORTS VIEW (التقارير المالية) */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>التقرير المالي التنفيذي ومؤشرات الأداء لكاس للتجارة</span>
              </h3>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-secondary text-foreground text-xs font-bold flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة التقرير</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                <div className="text-xs text-muted-foreground">مجموع الفواتير الصادرة</div>
                <div className="text-xl font-bold font-mono text-emerald-600 mt-1">{stats.totalInvoicesAmount.toLocaleString()} ر.س</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                <div className="text-xs text-muted-foreground">المتحصلات الفعلية</div>
                <div className="text-xl font-bold font-mono text-sky-600 mt-1">{stats.paidAmount.toLocaleString()} ر.س</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                <div className="text-xs text-muted-foreground">المصروفات والمشتريات</div>
                <div className="text-xl font-bold font-mono text-rose-600 mt-1">{stats.totalExpenses.toLocaleString()} ر.س</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                <div className="text-xs text-muted-foreground">صافي الفائض المالي</div>
                <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{(stats.paidAmount - stats.totalExpenses).toLocaleString()} ر.س</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DETAIL / PRINT PREVIEW (ZATCA Phase 2 Simulation) */}
      {/* ========================================================================= */}
      {showDetailModal && selectedDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {detailType === 'competition' ? 'تفاصيل المنافسة الحكومية الرسمية' : 'معاينة الفاتورة الضريبية ZATCA'}
                  </h3>
                  <p className="text-xs text-muted-foreground">مؤسسة خالد عبدالعزيز السليم للتجارة والمقاولات</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة</span>
                </button>
                <button onClick={() => setShowDetailModal(false)} className="p-1 rounded-lg text-muted-foreground hover:bg-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Competition Details */}
            {detailType === 'competition' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
                  <div className="text-sm font-bold text-foreground">{selectedDetail.title}</div>
                  <div className="text-muted-foreground font-mono">الرقم المرجعي: {selectedDetail.referenceNumber}</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-card border rounded-xl">
                    <div className="text-muted-foreground">الجهة الحكومية</div>
                    <div className="font-bold mt-1 text-foreground">{selectedDetail.governmentEntity}</div>
                  </div>
                  <div className="p-3 bg-card border rounded-xl">
                    <div className="text-muted-foreground">التصنيف</div>
                    <div className="font-bold mt-1 text-foreground">{selectedDetail.category}</div>
                  </div>
                  <div className="p-3 bg-card border rounded-xl">
                    <div className="text-muted-foreground">الموعد النهائي</div>
                    <div className="font-bold mt-1 font-mono text-foreground">{selectedDetail.deadlineDate}</div>
                  </div>
                  <div className="p-3 bg-card border rounded-xl">
                    <div className="text-muted-foreground">قيمة العرض المالي</div>
                    <div className="font-bold mt-1 font-mono text-emerald-600 text-sm">
                      {selectedDetail.totalItemsValue?.toLocaleString()} ر.س
                    </div>
                  </div>
                  <div className="p-3 bg-card border rounded-xl">
                    <div className="text-muted-foreground">الحالة</div>
                    <div className="mt-1">{getStatusPill(selectedDetail.status)}</div>
                  </div>
                  <div className="p-3 bg-card border rounded-xl">
                    <div className="text-muted-foreground">مسؤول المتابعة</div>
                    <div className="font-bold mt-1 text-foreground">{selectedDetail.contactName || 'م. أحمد البشير'}</div>
                  </div>
                </div>

                {selectedDetail.notes && (
                  <div className="p-3 bg-secondary/30 rounded-xl">
                    <div className="font-bold text-foreground mb-1">ملاحظات العطاء:</div>
                    <div className="text-muted-foreground leading-relaxed">{selectedDetail.notes}</div>
                  </div>
                )}
              </div>
            )}

            {/* Invoice Details */}
            {detailType === 'invoice' && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-start p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div>
                    <div className="text-sm font-bold text-foreground font-mono">{selectedDetail.invoiceNumber}</div>
                    <div className="text-muted-foreground mt-0.5">العميل: <span className="font-bold text-foreground">{selectedDetail.clientName}</span></div>
                    <div className="text-muted-foreground font-mono">تاريخ الإصدار: {selectedDetail.date}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <QrCode className="w-16 h-16 text-emerald-800" />
                    <span className="text-[10px] font-bold text-emerald-700 mt-1">ZATCA QR Compliant</span>
                  </div>
                </div>

                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-right border-collapse">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="p-2.5">الوصف</th>
                        <th className="p-2.5">الكمية</th>
                        <th className="p-2.5 text-left">السعر</th>
                        <th className="p-2.5 text-left">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDetail.items?.map((it: any, i: number) => (
                        <tr key={i} className="border-t">
                          <td className="p-2.5 font-medium">{it.description}</td>
                          <td className="p-2.5 font-mono">{it.qty}</td>
                          <td className="p-2.5 text-left font-mono">{it.rate.toLocaleString()} ر.س</td>
                          <td className="p-2.5 text-left font-mono font-bold">{it.total.toLocaleString()} ر.س</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-secondary/30 rounded-xl space-y-1 text-left font-mono font-bold">
                  <div className="text-foreground">المبلغ قبل الضريبة: {selectedDetail.amount?.toLocaleString()} ر.س</div>
                  <div className="text-emerald-600">ضريبة القيمة المضافة (15%): {selectedDetail.taxAmount?.toLocaleString()} ر.س</div>
                  <div className="text-sm text-foreground border-t pt-1">
                    الإجمالي النهائي: {(selectedDetail.amount + selectedDetail.taxAmount)?.toLocaleString()} ر.س
                  </div>
                </div>
              </div>
            )}
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
              <button onClick={() => setShowAddCompModal(false)} className="px-4 py-2 rounded-xl bg-secondary text-muted-foreground text-xs">إلغاء</button>
              <button onClick={handleSaveCompetition} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">حفظ المنافسة</button>
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

      {/* ========================================================================= */}
      {/* MODAL: ADD ESTIMATE */}
      {/* ========================================================================= */}
      {showAddEstimateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-sky-600" />
                <span>إنشاء عرض سعر رسمي (Estimate)</span>
              </h3>
              <button onClick={() => setShowAddEstimateModal(false)} className="p-1 rounded-lg text-muted-foreground hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">العميل / الجهة *</label>
                <input
                  type="text"
                  placeholder="اسم العميل أو الجهة..."
                  value={formData.clientName || ''}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">المبلغ الإجمالي (ر.س) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.totalAmount || ''}
                  onChange={e => setFormData({ ...formData, totalAmount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-foreground mb-1">تاريخ العرض</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button onClick={() => setShowAddEstimateModal(false)} className="px-4 py-2 rounded-xl bg-secondary text-muted-foreground text-xs">إلغاء</button>
              <button onClick={handleSaveEstimate} className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs">حفظ عرض السعر</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD PAYMENT */}
      {/* ========================================================================= */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <span>تسجيل سند قبض / دفعة بنكية</span>
              </h3>
              <button onClick={() => setShowAddPaymentModal(false)} className="p-1 rounded-lg text-muted-foreground hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">رقم الفاتورة المرتبطة *</label>
                <select
                  value={formData.invoiceNumber || ''}
                  onChange={e => {
                    const inv = invoices.find(i => i.invoiceNumber === e.target.value);
                    setFormData({
                      ...formData,
                      invoiceNumber: e.target.value,
                      clientName: inv?.clientName || '',
                      amount: inv ? inv.amount - (inv.paidAmount || 0) : ''
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                >
                  <option value="">اختر الفاتورة...</option>
                  {invoices.map(i => (
                    <option key={i.id} value={i.invoiceNumber}>
                      {i.invoiceNumber} - {i.clientName} ({i.amount.toLocaleString()} ر.س)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">مبلغ الدفعة (ر.س) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-foreground mb-1">طريقة الدفع</label>
                  <select
                    value={formData.paymentMode || 'تحويل بنكي'}
                    onChange={e => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                  >
                    <option value="تحويل بنكي">تحويل بنكي</option>
                    <option value="سداد">سداد SADAD</option>
                    <option value="بطاقة مدى / ائتمان">بطاقة مدى / ائتمان</option>
                    <option value="شيك مصدّق">شيك مصدّق</option>
                    <option value="نقداً">نقداً</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">رقم الحوالة / المعاملة</label>
                  <input
                    type="text"
                    placeholder="TXN-XXXXXX"
                    value={formData.transactionId || ''}
                    onChange={e => setFormData({ ...formData, transactionId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button onClick={() => setShowAddPaymentModal(false)} className="px-4 py-2 rounded-xl bg-secondary text-muted-foreground text-xs">إلغاء</button>
              <button onClick={handleSavePayment} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">حفظ السند</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD EXPENSE */}
      {/* ========================================================================= */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-600" />
                <span>تسجيل مصروف / مشتريات للمنافسات</span>
              </h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="p-1 rounded-lg text-muted-foreground hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">بيان المصروف *</label>
                <input
                  type="text"
                  placeholder="شراء بوكسات، نقل ديانات، صيانة..."
                  value={formData.expenseName || ''}
                  onChange={e => setFormData({ ...formData, expenseName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">المبلغ الأساسي (ر.س) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-foreground mb-1">الفئة</label>
                  <select
                    value={formData.category || 'مصاريف مشتريات'}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                  >
                    <option value="مصاريف مشتريات">مصاريف مشتريات</option>
                    <option value="نقل وشحن">نقل وشحن</option>
                    <option value="ضيافة">ضيافة</option>
                    <option value="صيانة وتشغيل">صيانة وتشغيل</option>
                    <option value="رسوم حكومية وتراخيص">رسوم حكومية وتراخيص</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">طريقة الدفع</label>
                  <select
                    value={formData.paymentMode || 'تحويل بنكي'}
                    onChange={e => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                  >
                    <option value="تحويل بنكي">تحويل بنكي</option>
                    <option value="مدى">بطاقة مدى</option>
                    <option value="عهدة نقدية">عهدة نقدية</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button onClick={() => setShowAddExpenseModal(false)} className="px-4 py-2 rounded-xl bg-secondary text-muted-foreground text-xs">إلغاء</button>
              <button onClick={handleSaveExpense} className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs">حفظ المصروف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
