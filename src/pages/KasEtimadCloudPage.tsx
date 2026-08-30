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
  ChevronRight, ChevronLeft, Receipt, BookOpen, AlertTriangle, CheckCheck,
  UserCheck, ShieldAlert
} from 'lucide-react';
import { 
  KasEtmadCompetition, KasEtmadInvoice, KasEtmadEstimate, 
  KasEtmadPayment, KasEtmadItem, KasEtmadClient, KasEtmadLead, 
  KasEtmadProject, KasEtmadTask, KasEtmadContract, KasEtmadExpense,
  KasEtmadTicket, KasEtmadKnowledgeArticle, KasEtmadCategory,
  KasEtmadStaff, EtmadModuleTab
} from '../types/kasEtmadSuite';
import { kasEtmadSuiteService } from '../services/kasEtmadSuiteService';
import { useAppStore } from '../stores/appStore';
import { useCompany } from '../contexts/CompanyContext';
import { tafqeet } from '../services/tafqeetService';

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
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);

  // Client 360 Modal
  const [selectedClientProfile, setSelectedClientProfile] = useState<KasEtmadClient | null>(null);
  const [clientProfileTab, setClientProfileTab] = useState<'info' | 'invoices' | 'estimates' | 'contracts' | 'projects'>('info');

  // Detail / Print Modal
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [detailType, setDetailType] = useState<'competition' | 'invoice' | 'estimate' | 'contract'>('competition');

  // Dynamic Item Lines for Invoice / Estimate Modal
  const [itemLines, setItemLines] = useState<Array<{ description: string; qty: number; rate: number; taxPct: number; total: number }>>([
    { description: 'بند توريد معتمد', qty: 1, rate: 1000, taxPct: 15, total: 1150 }
  ]);

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
  const categories = useMemo(() => kasEtmadSuiteService.getCategories(), [reloadKey]);
  const staff = useMemo(() => kasEtmadSuiteService.getStaff(), [reloadKey]);
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
    if (!formData.clientName) {
      alert('يرجى تحديد العميل');
      return;
    }
    const subtotal = itemLines.reduce((s, it) => s + (it.qty * it.rate), 0);
    const taxAmount = Number((subtotal * 0.15).toFixed(2));
    const totalWithTax = Number((subtotal + taxAmount).toFixed(2));

    kasEtmadSuiteService.addInvoice({
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(6, '0')}`,
      amount: subtotal,
      taxAmount,
      date: formData.date || new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      clientName: formData.clientName,
      project: formData.project || '',
      tags: ['كاس للتجارة', 'ZATCA مرحلة 2'],
      status: formData.status || 'غير مدفوع',
      paidAmount: parseFloat(formData.paidAmount) || 0,
      items: itemLines
    });
    addNotification({
      title: 'تم إنشاء الفاتورة',
      message: `تم إصدار الفاتورة للعميل ${formData.clientName} بقيمة ${totalWithTax.toLocaleString()} ر.س شاملة الضريبة.`,
      type: 'success'
    });
    setShowAddInvoiceModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveEstimate = () => {
    if (!formData.clientName) {
      alert('يرجى إدخال اسم العميل');
      return;
    }
    const subtotal = itemLines.reduce((s, it) => s + (it.qty * it.rate), 0);
    const taxAmount = Number((subtotal * 0.15).toFixed(2));

    kasEtmadSuiteService.addEstimate({
      estimateNumber: `EST-${String(estimates.length + 1).padStart(6, '0')}`,
      totalAmount: subtotal,
      taxAmount,
      date: formData.date || new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || new Date().toISOString().split('T')[0],
      clientName: formData.clientName,
      project: formData.project || '',
      reference: formData.reference || 'REF-KAS',
      status: formData.status || 'مسودة',
      items: itemLines
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

  const handleSaveCategory = () => {
    if (!formData.catName || !formData.catCode) {
      alert('يرجى إدخال اسم التصنيف والرمز');
      return;
    }
    kasEtmadSuiteService.addCategory({
      name: formData.catName,
      code: formData.catCode,
      description: formData.catDesc
    });
    setShowAddCategoryModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveStaff = () => {
    if (!formData.staffName || !formData.staffEmail) {
      alert('يرجى إدخال الاسم والبريد الإلكتروني');
      return;
    }
    kasEtmadSuiteService.addStaff({
      name: formData.staffName,
      email: formData.staffEmail,
      role: formData.staffRole || 'Employee',
      phone: formData.staffPhone
    });
    setShowAddStaffModal(false);
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
                else if (activeTab === 'settings') setShowAddCategoryModal(true);
                else if (activeTab === 'staff') setShowAddStaffModal(true);
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
          { id: 'staff', label: `الطاقم (${staff.length})`, icon: UserCheck },
          { id: 'knowledge-base', label: `قاعدة المعرفة (${knowledge.length})`, icon: BookOpen },
          { id: 'calendar', label: 'التقويم', icon: Calendar },
          { id: 'reports', label: 'التقارير المالية', icon: TrendingUp },
          { id: 'settings', label: `تصنيفات المنافسات (${categories.length})`, icon: Settings },
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
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
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
                        عرض / طباعة ZATCA
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
      {/* 4. CLIENTS VIEW (العملاء مع ملف العميل 360) */}
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
              <div 
                key={client.id} 
                onClick={() => setSelectedClientProfile(client)}
                className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.01]"
              >
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
      {/* 5. STAFF VIEW (الطاقم وفريق العمل) */}
      {/* ========================================================================= */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>أعضاء الطاقم وفريق عمل منظومة كاس</span>
            </h3>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>عضو جديد في الطاقم</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">الاسم الكامل</th>
                  <th className="p-3">البريد الإلكتروني</th>
                  <th className="p-3">الدور الوظيفي / الصلاحيات</th>
                  <th className="p-3">آخر تسجيل دخول</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {staff.map(st => (
                  <tr key={st.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                        {st.name.slice(0, 2)}
                      </div>
                      <span>{st.name}</span>
                    </td>
                    <td className="p-3 font-mono text-muted-foreground">{st.email}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        st.role.includes('Super_Admin') ? 'bg-purple-500/10 text-purple-600' : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {st.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-muted-foreground">{st.lastLogin}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">نشط</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SETTINGS VIEW (تصنيفات المنافسات والأكواد 01 - 9987) */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                <span>إعدادات وتصنيفات المنافسات الحكومية (منصة اعتماد)</span>
              </h3>
              <p className="text-xs text-muted-foreground">التصنيفات المعتمدة وأكوادها الرسمية في منظومة كاس</p>
            </div>
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>تصنيف جديد</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">اسم التصنيف</th>
                  <th className="p-3 font-mono">الرمز / الكود</th>
                  <th className="p-3">الوصف</th>
                  <th className="p-3 font-mono">تاريخ التحديث</th>
                  <th className="p-3 w-20 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {categories.map((cat, idx) => (
                  <tr key={cat.id || idx} className="hover:bg-emerald-500/5">
                    <td className="p-3 text-center font-mono text-muted-foreground">{idx + 1}</td>
                    <td className="p-3 font-bold text-foreground">{cat.name}</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">{cat.code}</td>
                    <td className="p-3 text-muted-foreground">{cat.description || '-'}</td>
                    <td className="p-3 font-mono text-muted-foreground">{cat.updatedAt}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm(`حذف تصنيف "${cat.name}"؟`)) {
                            kasEtmadSuiteService.deleteCategory(cat.id);
                            setReloadKey(k => k + 1);
                          }
                        }}
                        className="text-rose-600 hover:underline"
                      >
                        حذف
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
      {/* MODAL: CLIENT 360 PROFILE VIEW */}
      {/* ========================================================================= */}
      {selectedClientProfile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold text-base">
                  {selectedClientProfile.company.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{selectedClientProfile.company}</h3>
                  <p className="text-xs text-muted-foreground font-mono">الرقم الضريبي: {selectedClientProfile.vatNumber}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClientProfile(null)} className="p-1 rounded-lg text-muted-foreground hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs">
              <button
                onClick={() => setClientProfileTab('info')}
                className={`px-3 py-1.5 rounded-lg font-bold ${clientProfileTab === 'info' ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                البيانات العامة
              </button>
              <button
                onClick={() => setClientProfileTab('invoices')}
                className={`px-3 py-1.5 rounded-lg font-bold ${clientProfileTab === 'invoices' ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                الفواتير ({invoices.filter(i => i.clientName === selectedClientProfile.company).length})
              </button>
              <button
                onClick={() => setClientProfileTab('contracts')}
                className={`px-3 py-1.5 rounded-lg font-bold ${clientProfileTab === 'contracts' ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                العقود ({contracts.filter(c => c.clientName === selectedClientProfile.company).length})
              </button>
            </div>

            {clientProfileTab === 'info' && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-secondary/40 rounded-xl">
                  <div className="text-muted-foreground">جهة الاتصال الرئيسية</div>
                  <div className="font-bold text-foreground mt-0.5">{selectedClientProfile.primaryContact}</div>
                </div>
                <div className="p-3 bg-secondary/40 rounded-xl">
                  <div className="text-muted-foreground">رقم الهاتف</div>
                  <div className="font-bold text-foreground font-mono mt-0.5">{selectedClientProfile.phone}</div>
                </div>
                <div className="p-3 bg-secondary/40 rounded-xl">
                  <div className="text-muted-foreground">البريد الإلكتروني</div>
                  <div className="font-bold text-foreground font-mono mt-0.5">{selectedClientProfile.email}</div>
                </div>
                <div className="p-3 bg-secondary/40 rounded-xl">
                  <div className="text-muted-foreground">المدينة والعنوان</div>
                  <div className="font-bold text-foreground mt-0.5">{selectedClientProfile.city} - {selectedClientProfile.address}</div>
                </div>
              </div>
            )}

            {clientProfileTab === 'invoices' && (
              <div className="space-y-2 text-xs">
                {invoices.filter(i => i.clientName === selectedClientProfile.company).map(inv => (
                  <div key={inv.id} className="p-3 bg-secondary/30 rounded-xl flex justify-between items-center font-mono">
                    <div>
                      <span className="font-bold text-emerald-600">{inv.invoiceNumber}</span>
                      <span className="text-muted-foreground mr-3">بتاريخ {inv.date}</span>
                    </div>
                    <div className="font-bold">{inv.amount.toLocaleString()} ر.س</div>
                  </div>
                ))}
              </div>
            )}

            {clientProfileTab === 'contracts' && (
              <div className="space-y-2 text-xs">
                {contracts.filter(c => c.clientName === selectedClientProfile.company).map(cnt => (
                  <div key={cnt.id} className="p-3 bg-secondary/30 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-foreground">{cnt.subject}</div>
                      <div className="text-muted-foreground text-[11px] font-mono">{cnt.startDate} إلى {cnt.endDate}</div>
                    </div>
                    <div className="font-bold font-mono text-emerald-600">{cnt.contractValue.toLocaleString()} ر.س</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD INVOICE WITH ITEMIZED ROWS */}
      {/* ========================================================================= */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>إنشاء فاتورة ضريبية ذكية ZATCA المرحلة الثانية</span>
              </h3>
              <button onClick={() => setShowAddInvoiceModal(false)} className="p-1 rounded-lg text-muted-foreground hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">العميل / الجهة *</label>
                <select
                  value={formData.clientName || ''}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                >
                  <option value="">اختر العميل...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.company}>{c.company}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">المشروع المرتبط</label>
                <input
                  type="text"
                  placeholder="مشروع توريدات..."
                  value={formData.project || ''}
                  onChange={e => setFormData({ ...formData, project: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">تاريخ الفاتورة</label>
                <input
                  type="date"
                  value={formData.date || new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">تاريخ الاستحقاق</label>
                <input
                  type="date"
                  value={formData.dueDate || new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border font-mono"
                />
              </div>
            </div>

            {/* Itemized Rows Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground">بنود الفاتورة وجدول الكميات:</span>
                <button
                  type="button"
                  onClick={() => setItemLines([...itemLines, { description: 'بند جديد', qty: 1, rate: 500, taxPct: 15, total: 575 }])}
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ بند إضافي</span>
                </button>
              </div>

              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-secondary text-foreground font-semibold">
                    <tr>
                      <th className="p-2">الوصف</th>
                      <th className="p-2 w-20">الكمية</th>
                      <th className="p-2 w-28">السعر (ر.س)</th>
                      <th className="p-2 w-28 text-left">الإجمالي</th>
                      <th className="p-2 w-10 text-center">×</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {itemLines.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2">
                          <input
                            type="text"
                            value={it.description}
                            onChange={e => {
                              const copy = [...itemLines];
                              copy[idx].description = e.target.value;
                              setItemLines(copy);
                            }}
                            className="w-full px-2 py-1 bg-transparent border rounded"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={it.qty}
                            onChange={e => {
                              const copy = [...itemLines];
                              copy[idx].qty = parseFloat(e.target.value) || 0;
                              copy[idx].total = Number((copy[idx].qty * copy[idx].rate * 1.15).toFixed(2));
                              setItemLines(copy);
                            }}
                            className="w-full px-2 py-1 bg-transparent border rounded font-mono"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={it.rate}
                            onChange={e => {
                              const copy = [...itemLines];
                              copy[idx].rate = parseFloat(e.target.value) || 0;
                              copy[idx].total = Number((copy[idx].qty * copy[idx].rate * 1.15).toFixed(2));
                              setItemLines(copy);
                            }}
                            className="w-full px-2 py-1 bg-transparent border rounded font-mono"
                          />
                        </td>
                        <td className="p-2 text-left font-mono font-bold">{it.total.toLocaleString()} ر.س</td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => setItemLines(itemLines.filter((_, i) => i !== idx))}
                            className="text-rose-600 font-bold"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dynamic Totals & Tafqeet */}
              <div className="p-3 bg-secondary/40 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between font-mono">
                  <span>المبلغ قبل الضريبة:</span>
                  <span className="font-bold">{itemLines.reduce((s, it) => s + (it.qty * it.rate), 0).toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between font-mono text-emerald-600">
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span className="font-bold">{(itemLines.reduce((s, it) => s + (it.qty * it.rate), 0) * 0.15).toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between font-mono font-bold text-sm border-t pt-1 text-foreground">
                  <span>الإجمالي النهائي:</span>
                  <span>{(itemLines.reduce((s, it) => s + (it.qty * it.rate), 0) * 1.15).toLocaleString()} ر.س</span>
                </div>
                <div className="text-[11px] text-muted-foreground pt-1">
                  التفقيط: <span className="font-semibold text-foreground">{tafqeet(itemLines.reduce((s, it) => s + (it.qty * it.rate), 0) * 1.15)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button onClick={() => setShowAddInvoiceModal(false)} className="px-4 py-2 rounded-xl bg-secondary text-muted-foreground text-xs">إلغاء</button>
              <button onClick={handleSaveInvoice} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">حفظ وإصدار الفاتورة</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD CATEGORY */}
      {/* ========================================================================= */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">إضافة تصنيف منافسة جديد</h3>
              <button onClick={() => setShowAddCategoryModal(false)} className="p-1 text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">اسم التصنيف *</label>
                <input
                  type="text"
                  placeholder="المقاولات، التجارة..."
                  value={formData.catName || ''}
                  onChange={e => setFormData({ ...formData, catName: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">رمز / كود التصنيف *</label>
                <input
                  type="text"
                  placeholder="01, 02, 9987..."
                  value={formData.catCode || ''}
                  onChange={e => setFormData({ ...formData, catCode: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddCategoryModal(false)} className="px-4 py-2 bg-secondary rounded-xl">إلغاء</button>
              <button onClick={handleSaveCategory} className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold">حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD STAFF */}
      {/* ========================================================================= */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">إضافة عضو جديد في الطاقم</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="p-1 text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  placeholder="الاسم الثلاثي..."
                  value={formData.staffName || ''}
                  onChange={e => setFormData({ ...formData, staffName: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">البريد الإلكتروني *</label>
                <input
                  type="email"
                  placeholder="name@kas.com.sa"
                  value={formData.staffEmail || ''}
                  onChange={e => setFormData({ ...formData, staffEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">الدور الوظيفي</label>
                <select
                  value={formData.staffRole || 'Employee'}
                  onChange={e => setFormData({ ...formData, staffRole: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                >
                  <option value="Employee">Employee (موظف تشغيل)</option>
                  <option value="المنافسات">المنافسات (مسؤول دراسة العطاءات)</option>
                  <option value="المحاسب المالي المعتمد">المحاسب المالي المعتمد</option>
                  <option value="Super_Admin">Super_Admin (مدير عام)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddStaffModal(false)} className="px-4 py-2 bg-secondary rounded-xl">إلغاء</button>
              <button onClick={handleSaveStaff} className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold">حفظ العضو</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
