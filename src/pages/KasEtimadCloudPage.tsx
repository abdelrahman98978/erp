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
  UserCheck, ShieldAlert, ArrowDownRight, Share2, FolderKanban
} from 'lucide-react';
import { 
  KasEtmadCompetition, KasEtmadInvoice, KasEtmadEstimate, 
  KasEtmadPayment, KasEtmadItem, KasEtmadClient, KasEtmadLead, 
  KasEtmadProject, KasEtmadTask, KasEtmadContract, KasEtmadExpense,
  KasEtmadTicket, KasEtmadKnowledgeArticle, KasEtmadCategory,
  KasEtmadStaff, KasEtmadProposal, KasEtmadSubscription, KasEtmadCreditNote,
  KasEtmadEstimateRequest, KasEtmadEmailTemplate, EtmadModuleTab
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
  const [itemGroupFilter, setItemGroupFilter] = useState<string>('all');

  // Live Timer State
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Modals state
  const [showAddCompModal, setShowAddCompModal] = useState<boolean>(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState<boolean>(false);
  const [showAddEstimateModal, setShowAddEstimateModal] = useState<boolean>(false);
  const [showAddProposalModal, setShowAddProposalModal] = useState<boolean>(false);
  const [showAddCreditNoteModal, setShowAddCreditNoteModal] = useState<boolean>(false);
  const [showAddSubscriptionModal, setShowAddSubscriptionModal] = useState<boolean>(false);
  const [showAddEstimateRequestModal, setShowAddEstimateRequestModal] = useState<boolean>(false);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState<boolean>(false);
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState<boolean>(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState<boolean>(false);
  const [showAddContractModal, setShowAddContractModal] = useState<boolean>(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);
  const [showAddTicketModal, setShowAddTicketModal] = useState<boolean>(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);
  const [showAddArticleModal, setShowAddArticleModal] = useState<boolean>(false);

  // Client 360 Modal
  const [selectedClientProfile, setSelectedClientProfile] = useState<KasEtmadClient | null>(null);
  const [clientProfileTab, setClientProfileTab] = useState<'info' | 'invoices' | 'estimates' | 'contracts' | 'projects'>('info');

  // Calendar State
  const [calendarMonth, setCalendarMonth] = useState<number>(7); // 0-indexed: 7 is August 2026
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'competitions' | 'invoices' | 'tasks' | 'contracts'>('all');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(30);

  // Reports State
  const [reportsTimeframe, setReportsTimeframe] = useState<'ytd' | 'q3' | 'q2' | 'q1' | 'month'>('ytd');

  // Quick Payment Modal
  const [showQuickPayModal, setShowQuickPayModal] = useState<boolean>(false);
  const [quickPayInvoice, setQuickPayInvoice] = useState<KasEtmadInvoice | null>(null);

  // Detail / Print Preview Modal
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [detailType, setDetailType] = useState<'competition' | 'invoice' | 'estimate' | 'contract' | 'payment'>('competition');

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
  const proposals = useMemo(() => kasEtmadSuiteService.getProposals(), [reloadKey]);
  const creditNotes = useMemo(() => kasEtmadSuiteService.getCreditNotes(), [reloadKey]);
  const subscriptions = useMemo(() => kasEtmadSuiteService.getSubscriptions(), [reloadKey]);
  const estimateRequests = useMemo(() => kasEtmadSuiteService.getEstimateRequests(), [reloadKey]);
  const emailTemplates = useMemo(() => kasEtmadSuiteService.getEmailTemplates(), [reloadKey]);
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

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(it => {
      const matchSearch = !searchQuery || 
        it.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (it.longDescription && it.longDescription.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchGroup = itemGroupFilter === 'all' || it.group === itemGroupFilter;
      return matchSearch && matchGroup;
    });
  }, [items, searchQuery, itemGroupFilter]);

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

  const handleConvertEstimateToInvoice = (est: KasEtmadEstimate) => {
    kasEtmadSuiteService.addInvoice({
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(6, '0')}`,
      amount: est.totalAmount,
      taxAmount: est.taxAmount,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      clientName: est.clientName,
      project: est.project || 'مشروع محول من عرض سعر',
      tags: ['محول من عرض سعر', 'ZATCA مرحلة 2'],
      status: 'غير مدفوع',
      paidAmount: 0,
      items: est.items
    });
    kasEtmadSuiteService.updateEstimate(est.id, { status: 'مقبول' });
    addNotification({
      title: 'تم تحويل عرض السعر إلى فاتورة',
      message: `تم تحويل ${est.estimateNumber} بنجاح إلى فاتورة ضريبية رسمية.`,
      type: 'success'
    });
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

  const handleSaveClient = () => {
    if (!formData.company || !formData.phone) {
      alert('يرجى إدخال اسم الشركة ورقم الهاتف');
      return;
    }
    kasEtmadSuiteService.addClient({
      company: formData.company,
      primaryContact: formData.primaryContact || 'المسؤول التجاري',
      email: formData.email || 'info@client.sa',
      phone: formData.phone,
      active: true,
      groups: ['جهات حكومية'],
      city: formData.city || 'الرياض',
      vatNumber: formData.vatNumber || '300000000000003',
      address: formData.address || '',
      createdAt: new Date().toISOString().split('T')[0]
    });
    setShowAddClientModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveLead = () => {
    if (!formData.leadName || !formData.company) {
      alert('يرجى إدخال اسم المسؤول والجهة');
      return;
    }
    kasEtmadSuiteService.addLead({
      name: formData.leadName,
      company: formData.company,
      email: formData.email || '',
      phone: formData.phone || '',
      opportunityValue: parseFloat(formData.opportunityValue) || 0,
      assignedTo: formData.assignedTo || 'م. أحمد البشير',
      status: formData.status || 'جديد',
      source: formData.source || 'منصة اعتماد',
      lastContact: new Date().toISOString().split('T')[0]
    });
    setShowAddLeadModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveProject = () => {
    if (!formData.projectName || !formData.clientName) {
      alert('يرجى إدخال اسم المشروع والجهة');
      return;
    }
    kasEtmadSuiteService.addProject({
      projectName: formData.projectName,
      clientName: formData.clientName,
      tags: ['كاس للتجارة', 'توريدات'],
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      deadline: formData.deadline || new Date().toISOString().split('T')[0],
      members: ['م. أحمد البشير', 'خالد السليم'],
      progress: 0,
      status: 'قيد التقدم',
      budget: parseFloat(formData.budget) || 0
    });
    setShowAddProjectModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveTask = () => {
    if (!formData.taskName || !formData.assignedTo) {
      alert('يرجى إدخال عنوان المهمة والمسؤول');
      return;
    }
    kasEtmadSuiteService.addTask({
      taskName: formData.taskName,
      status: formData.status || 'قيد التقدم',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      assignedTo: formData.assignedTo,
      priority: formData.priority || 'متوسط',
      project: formData.project,
      timeSpentHours: 0
    });
    setShowAddTaskModal(false);
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

  const handleSaveProposal = () => {
    if (!formData.subject || !formData.toClient) {
      alert('يرجى إدخال موضوع العرض واسم العميل / الجهة');
      return;
    }
    const subtotal = itemLines.reduce((s, it) => s + (it.qty * it.rate), 0) || parseFloat(formData.totalAmount) || 0;
    kasEtmadSuiteService.addProposal({
      proposalNumber: `PROP-${String(proposals.length + 1).padStart(6, '0')}`,
      subject: formData.subject,
      toClient: formData.toClient,
      totalAmount: subtotal,
      date: formData.date || new Date().toISOString().split('T')[0],
      openTill: formData.openTill || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      project: formData.project || '',
      tags: ['عرض تجاري', 'شركة كاس'],
      createdAt: new Date().toISOString().split('T')[0],
      status: formData.status || 'مسودة',
      items: itemLines
    });
    addNotification({
      title: 'تم إنشاء العرض التجاري',
      message: `تم تسجيل العرض (${formData.subject}) بنجاح.`,
      type: 'success'
    });
    setShowAddProposalModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveCreditNote = () => {
    if (!formData.clientName || !formData.totalAmount) {
      alert('يرجى تحديد العميل والمبلغ');
      return;
    }
    const tot = parseFloat(formData.totalAmount) || 0;
    kasEtmadSuiteService.addCreditNote({
      creditNoteNumber: `CN-${String(creditNotes.length + 1).padStart(6, '0')}`,
      clientName: formData.clientName,
      date: formData.date || new Date().toISOString().split('T')[0],
      status: formData.status || 'مسودة',
      project: formData.project || '',
      remainingAmount: tot,
      totalAmount: tot,
      invoiceRef: formData.invoiceRef || ''
    });
    addNotification({
      title: 'تم إنشاء إشعار الائتمان',
      message: `تم قيد إشعار الائتمان بمبلغ ${tot.toLocaleString()} ر.س.`,
      type: 'success'
    });
    setShowAddCreditNoteModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveSubscription = () => {
    if (!formData.subscriptionName || !formData.clientName || !formData.amount) {
      alert('يرجى تعبئة كافة الحقول المطلوبة للاشتراك');
      return;
    }
    const amt = parseFloat(formData.amount) || 0;
    kasEtmadSuiteService.addSubscription({
      subscriptionName: formData.subscriptionName,
      clientName: formData.clientName,
      billingInterval: formData.billingInterval || 'شهري',
      amount: amt,
      status: formData.status || 'نشط',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      nextBillingDate: formData.nextBillingDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    });
    addNotification({
      title: 'تم إنشاء الاشتراك الدوري',
      message: `تم تسجيل اشتراك (${formData.subscriptionName}) بنجاح.`,
      type: 'success'
    });
    setShowAddSubscriptionModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveEstimateRequest = () => {
    if (!formData.clientName || !formData.description) {
      alert('يرجى كتابة اسم العميل ووصف متطلبات العرض');
      return;
    }
    kasEtmadSuiteService.addEstimateRequest({
      requestNumber: `EREQ-${String(estimateRequests.length + 1).padStart(6, '0')}`,
      clientName: formData.clientName,
      description: formData.description,
      requestedDate: formData.requestedDate || new Date().toISOString().split('T')[0],
      status: 'جديد'
    });
    addNotification({
      title: 'تم تسجيل طلب عرض السعر',
      message: `تم تسجيل طلب العميل (${formData.clientName}) بنجاح.`,
      type: 'success'
    });
    setShowAddEstimateRequestModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveEmailTemplate = () => {
    if (!formData.templateName || !formData.subject) {
      alert('يرجى إدخال اسم القالب وموضوع البريد');
      return;
    }
    kasEtmadSuiteService.addEmailTemplate({
      name: formData.templateName,
      subject: formData.subject,
      category: formData.type || 'فاتورة',
      body: formData.body || 'نص الرسالة الافتراضي...',
      variables: ['{client_name}', '{invoice_number}', '{amount}', '{due_date}', '{company_name}'],
      lastModified: new Date().toISOString().split('T')[0]
    });
    addNotification({
      title: 'تم حفظ قالب البريد',
      message: `تم إنشاء قالب (${formData.templateName}) بنجاح.`,
      type: 'success'
    });
    setShowAddTemplateModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  const handleSaveArticle = () => {
    if (!formData.articleTitle || !formData.articleCategory) {
      alert('يرجى إدخال عنوان المقال والتصنيف');
      return;
    }
    kasEtmadSuiteService.addKnowledgeArticle({
      title: formData.articleTitle,
      category: formData.articleCategory || 'لوائح وأنظمة',
      summary: formData.articleDescription || 'ملخص المقال',
      content: formData.articleContent || formData.articleDescription || 'المحتوى الكامل للمقال...',
      publishedDate: new Date().toISOString().split('T')[0]
    });
    addNotification({
      title: 'تمت إضافة المقال',
      message: `تم إضافة (${formData.articleTitle}) إلى قاعدة المعرفة.`,
      type: 'success'
    });
    setShowAddArticleModal(false);
    setFormData({});
    setReloadKey(k => k + 1);
  };

  // Status Badge Helper
  const getStatusPill = (status: string) => {
    if (status.includes('تمت الترسية') || status === 'مدفوع' || status === 'مقبول' || status === 'مكتمل' || status === 'مكتملة' || status === 'ساري' || status === 'مغلق فائز') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">✓ {status}</span>;
    }
    if (status.includes('رفع العرض') || status === 'مدفوع جزئيًا' || status === 'مرسل' || status === 'قيد التقدم' || status === 'مفتوحة' || status === 'مفتوح' || status === 'مؤهل' || status === 'عرض سعر مرسل') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 border border-sky-500/20">⏳ {status}</span>;
    }
    if (status.includes('لاغي') || status === 'ملغي' || status === 'مرفوض' || status === 'غير مدفوع' || status === 'متأخر' || status === 'حرج' || status === 'مغلق خاسر') {
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
                else if (activeTab === 'clients') setShowAddClientModal(true);
                else if (activeTab === 'leads') setShowAddLeadModal(true);
                else if (activeTab === 'projects') setShowAddProjectModal(true);
                else if (activeTab === 'tasks') setShowAddTaskModal(true);
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
          { id: 'proposals', label: `العروض (${proposals.length})`, icon: Send },
          { id: 'credit-notes', label: `إشعارات الائتمان (${creditNotes.length})`, icon: ArrowDownRight },
          { id: 'payments', label: `المدفوعات (${payments.length})`, icon: Receipt },
          { id: 'subscriptions', label: `الاشتراكات (${subscriptions.length})`, icon: RefreshCw },
          { id: 'items', label: `جدول الكميات (${items.length})`, icon: Layers },
          { id: 'clients', label: `العملاء (${clients.length})`, icon: Users },
          { id: 'leads', label: `العملاء المحتملين (${leads.length})`, icon: UserPlus },
          { id: 'projects', label: `المشاريع (${projects.length})`, icon: Briefcase },
          { id: 'tasks', label: `المهام (${tasks.length})`, icon: CheckSquare },
          { id: 'contracts', label: `العقود (${contracts.length})`, icon: FileCheck },
          { id: 'expenses', label: `المصروفات (${expenses.length})`, icon: CreditCard },
          { id: 'tickets', label: `الدعم (${tickets.length})`, icon: HelpCircle },
          { id: 'estimate-requests', label: `طلب عرض سعر (${estimateRequests.length})`, icon: FilePlus },
          { id: 'staff', label: `الطاقم (${staff.length})`, icon: UserCheck },
          { id: 'knowledge-base', label: `قاعدة المعرفة (${knowledge.length})`, icon: BookOpen },
          { id: 'email-templates', label: `قوالب البريد (${emailTemplates.length})`, icon: Mail },
          { id: 'utilities', label: 'الأدوات المساعدة', icon: Calculator },
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
      {/* 1. DASHBOARD VIEW (لوحة التحكم التفاعلية والشاملة) */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top KPI Grid (8 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>المنافسات</span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-1.5 text-xl font-bold text-foreground font-mono">{stats.totalCompetitions}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">{stats.wonCompetitions} ترسية ({stats.winRate}%)</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between hover:border-sky-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>إجمالي الفواتير</span>
                <DollarSign className="w-4 h-4 text-sky-500" />
              </div>
              <div className="mt-1.5 text-sm font-bold text-sky-600 truncate font-mono">{stats.totalInvoicesAmount.toLocaleString()} ر.س</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">مبيعات كاس</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>المحصل</span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-1.5 text-sm font-bold text-emerald-600 truncate font-mono">{stats.paidAmount.toLocaleString()} ر.س</div>
              <div className="text-[10px] text-emerald-600 font-medium mt-0.5">في الحسابات</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between hover:border-rose-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>غير محصل</span>
                <Clock className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-1.5 text-sm font-bold text-rose-600 truncate font-mono">{stats.unpaidAmount.toLocaleString()} ر.س</div>
              <div className="text-[10px] text-rose-500 mt-0.5">مستحق السداد</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between hover:border-violet-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>العروض</span>
                <Send className="w-4 h-4 text-violet-500" />
              </div>
              <div className="mt-1.5 text-sm font-bold text-violet-600 truncate font-mono">{stats.totalProposalsValue.toLocaleString()} ر.س</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{proposals.length} عرض تجاري</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between hover:border-teal-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>الاشتراكات</span>
                <RefreshCw className="w-4 h-4 text-teal-500" />
              </div>
              <div className="mt-1.5 text-sm font-bold text-teal-600 truncate font-mono">{stats.totalSubscriptionsRevenue.toLocaleString()} ر.س</div>
              <div className="text-[10px] text-teal-600 mt-0.5">إيراد دوري</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between hover:border-indigo-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>المشاريع</span>
                <Briefcase className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-1.5 text-xl font-bold text-indigo-600 font-mono">{stats.activeProjects}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">جارية التنفيذ</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between hover:border-amber-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>المهام</span>
                <CheckSquare className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-1.5 text-xl font-bold text-amber-600 font-mono">{stats.activeTasks}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">قيد المتابعة</div>
            </div>
          </div>

          {/* Interactive Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Invoicing & Cashflow SVG Chart */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>حركة المبيعات والتحصيلات الشهرية (2026)</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">مقارنة الفواتير الصادرة والمبالغ المحصلة عبر منصة اعتماد</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                    الفواتير الصادرة
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-600">
                    <span className="w-3 h-3 rounded-sm bg-sky-500 inline-block" />
                    التحصيلات النقدية
                  </span>
                </div>
              </div>

              {/* SVG Bar & Curve Chart */}
              <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
                {[
                  { month: 'يناير', invoiced: 85000, collected: 80000 },
                  { month: 'فبراير', invoiced: 201341, collected: 144760 },
                  { month: 'مارس', invoiced: 165000, collected: 120000 },
                  { month: 'أبريل', invoiced: 110000, collected: 95000 },
                  { month: 'مايو', invoiced: 140000, collected: 130000 },
                  { month: 'يونيو', invoiced: 175000, collected: 150000 },
                  { month: 'يوليو', invoiced: 130000, collected: 115000 },
                  { month: 'أغسطس', invoiced: 220000, collected: 185000 },
                ].map((item, idx) => {
                  const maxVal = 250000;
                  const invHeight = Math.round((item.invoiced / maxVal) * 100);
                  const colHeight = Math.round((item.collected / maxVal) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded-lg pointer-events-none mb-1 shadow-lg text-center z-10">
                        <div>صادر: {item.invoiced.toLocaleString()} ر.س</div>
                        <div className="text-emerald-400">محصل: {item.collected.toLocaleString()} ر.س</div>
                      </div>
                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        <div 
                          className="w-3.5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all group-hover:brightness-110" 
                          style={{ height: `${invHeight}%` }} 
                        />
                        <div 
                          className="w-3.5 bg-gradient-to-t from-sky-600 to-sky-400 rounded-t-md transition-all group-hover:brightness-110" 
                          style={{ height: `${colHeight}%` }} 
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium truncate group-hover:text-foreground transition-colors">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Competitions Funnel & Win Rate Card */}
            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>مسار ترسية المنافسات الحكومية</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-mono">
                    {stats.winRate}% معدل الفوز
                  </span>
                </div>

                <div className="space-y-3 mt-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-foreground">1. تم رفع العرض الفني والمالي</span>
                      <span className="font-mono text-sky-600">2 منافسة (33%)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div className="bg-sky-500 h-2 rounded-full" style={{ width: '33%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-foreground">2. تمت الترسية بنجاح (فائز)</span>
                      <span className="font-mono text-emerald-600">2 منافسة (33%)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '33%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-foreground">3. تحت الدراسة والتسعير</span>
                      <span className="font-mono text-amber-600">1 منافسة (17%)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '17%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-foreground">4. لم يتم التسعير (لاغي)</span>
                      <span className="font-mono text-rose-500">1 منافسة (17%)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div className="bg-rose-500 h-2 rounded-full" style={{ width: '17%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center gap-2">
                <button
                  onClick={() => setShowAddCompModal(true)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ إضافة منافسة</span>
                </button>
                <button
                  onClick={() => setActiveTab('competitions')}
                  className="py-2 px-3 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-bold text-foreground"
                >
                  عرض الكل
                </button>
              </div>
            </div>
          </div>

          {/* Quick Tasks & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>حالات الفواتير والتحصيل</span>
                </h3>
                <span className="text-xs font-bold text-muted-foreground font-mono">2026</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-rose-600">غير مدفوع (33%)</span>
                    <span className="font-mono">1 / 3</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-rose-500 h-2 rounded-full" style={{ width: '33%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-600">مدفوع جزئياً (33%)</span>
                    <span className="font-mono">1 / 3</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '33%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-600">مدفوع بالكامل (33%)</span>
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
                            className="text-emerald-600 hover:underline font-bold"
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
                      <div className="flex items-center justify-center gap-1.5 text-[11px]">
                        <button
                          onClick={() => {
                            setSelectedDetail(inv);
                            setDetailType('invoice');
                            setShowDetailModal(true);
                          }}
                          className="text-emerald-600 hover:underline font-bold"
                        >
                          عرض / ZATCA
                        </button>
                        {inv.status !== 'مدفوع' && (
                          <>
                            <span className="text-muted-foreground">|</span>
                            <button
                              onClick={() => {
                                setQuickPayInvoice(inv);
                                setShowQuickPayModal(true);
                              }}
                              className="text-sky-600 hover:underline font-bold"
                            >
                              تسجيل سداد
                            </button>
                          </>
                        )}
                        <span className="text-muted-foreground">|</span>
                        <button
                          onClick={() => {
                            if (window.confirm(`حذف الفاتورة "${inv.invoiceNumber}"؟`)) {
                              kasEtmadSuiteService.deleteInvoice(inv.id);
                              setReloadKey(k => k + 1);
                              addNotification({ title: 'تم حذف الفاتورة', message: `تم حذف ${inv.invoiceNumber} بنجاح`, type: 'info' });
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
      )}

      {/* ========================================================================= */}
      {/* 4. ESTIMATES VIEW (عروض الأسعار) */}
      {/* ========================================================================= */}
      {activeTab === 'estimates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>عروض الأسعار وعطاءات المنافسات التقديرية</span>
            </h3>
            <button
              onClick={() => setShowAddEstimateModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>عرض سعر جديد</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">رقم العرض</th>
                  <th className="p-3 text-left">المبلغ</th>
                  <th className="p-3 text-left">الضريبة 15%</th>
                  <th className="p-3">الجهة / العميل</th>
                  <th className="p-3">المشروع</th>
                  <th className="p-3">تاريخ العرض</th>
                  <th className="p-3">تاريخ الصلاحية</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {estimates.map(est => (
                  <tr key={est.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-mono font-bold text-emerald-600">{est.estimateNumber}</td>
                    <td className="p-3 text-left font-mono font-bold text-foreground">{est.totalAmount.toLocaleString()} ر.س</td>
                    <td className="p-3 text-left font-mono text-muted-foreground">{est.taxAmount.toLocaleString()} ر.س</td>
                    <td className="p-3 font-semibold text-foreground">{est.clientName}</td>
                    <td className="p-3 text-muted-foreground">{est.project || '-'}</td>
                    <td className="p-3 font-mono text-muted-foreground">{est.date}</td>
                    <td className="p-3 font-mono text-muted-foreground">{est.expiryDate}</td>
                    <td className="p-3">{getStatusPill(est.status)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedDetail(est);
                            setDetailType('estimate');
                            setShowDetailModal(true);
                          }}
                          className="text-emerald-600 hover:underline font-bold text-[11px]"
                        >
                          معاينة
                        </button>
                        <button
                          onClick={() => handleConvertEstimateToInvoice(est)}
                          className="px-2 py-0.5 rounded bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-[10px] transition-colors"
                        >
                          تحويل لفاتورة
                        </button>
                      </div>
                    </td>
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
              <span>سند قبض جديد</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">رقم السند</th>
                  <th className="p-3">رقم الفاتورة</th>
                  <th className="p-3">العميل / الجهة</th>
                  <th className="p-3">طريقة الدفع</th>
                  <th className="p-3 font-mono">رقم المعاملة / المرجع</th>
                  <th className="p-3 text-left">المبلغ المحصل</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-mono font-bold text-emerald-600">{pay.paymentNumber}</td>
                    <td className="p-3 font-mono text-muted-foreground">{pay.invoiceNumber}</td>
                    <td className="p-3 font-semibold text-foreground">{pay.clientName}</td>
                    <td className="p-3">{pay.paymentMode}</td>
                    <td className="p-3 font-mono text-muted-foreground">{pay.transactionId}</td>
                    <td className="p-3 text-left font-mono font-bold text-emerald-600">{pay.amount.toLocaleString()} ر.س</td>
                    <td className="p-3 font-mono text-muted-foreground">{pay.date}</td>
                    <td className="p-3 text-muted-foreground">{pay.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ITEMS CATALOG VIEW (جدول الكميات) */}
      {/* ========================================================================= */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث في جدول الكميات والأصناف..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-secondary/50 border border-border text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={itemGroupFilter}
                onChange={e => setItemGroupFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs"
              >
                <option value="all">كل المجموعات</option>
                <option value="ضيافة وتمور">ضيافة وتمور</option>
                <option value="توريدات حكومية">توريدات حكومية</option>
                <option value="ديكور ومعارض">ديكور ومعارض</option>
                <option value="أجهزة وتقنية">أجهزة وتقنية</option>
              </select>

              <button
                onClick={() => setShowAddItemModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة صنف</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">الوصف / البند</th>
                  <th className="p-3">الوصف التفصيلي</th>
                  <th className="p-3">المجموعة</th>
                  <th className="p-3">الوحدة</th>
                  <th className="p-3 text-left">السعر (ر.س)</th>
                  <th className="p-3 text-center">الضريبة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-bold text-foreground">{item.description}</td>
                    <td className="p-3 text-muted-foreground">{item.longDescription || '-'}</td>
                    <td className="p-3 font-medium text-emerald-600">{item.group}</td>
                    <td className="p-3">{item.unit}</td>
                    <td className="p-3 text-left font-mono font-bold text-foreground">{item.rate.toLocaleString()} ر.س</td>
                    <td className="p-3 text-center font-mono">{item.taxPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. LEADS VIEW (العملاء المحتملين والفرص البيعية) */}
      {/* ========================================================================= */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-600" />
              <span>خط الأنابيب والفرص البيعية والمنافسات المحتملة</span>
            </h3>
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة فرصة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map(lead => (
              <div key={lead.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {lead.source}
                  </span>
                  {getStatusPill(lead.status)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{lead.company}</h4>
                  <div className="text-xs text-muted-foreground mt-0.5">المسؤول: {lead.name}</div>
                </div>
                <div className="p-3 bg-secondary/40 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">قيمة الفرصة المتوقعة:</span>
                  <span className="font-mono font-bold text-emerald-600">{lead.opportunityValue.toLocaleString()} ر.س</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono flex justify-between pt-1">
                  <span>📞 {lead.phone}</span>
                  <span>المسؤول: {lead.assignedTo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. PROJECTS VIEW (المشاريع) */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <span>مشاريع التوريد والتشغيل لشركة كاس</span>
            </h3>
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>مشروع جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(proj => (
              <div key={proj.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-foreground text-base leading-snug">{proj.projectName}</h4>
                    <div className="text-xs text-muted-foreground mt-1">الجهة: <span className="font-semibold text-foreground">{proj.clientName}</span></div>
                  </div>
                  {getStatusPill(proj.status)}
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>نسبة الإنجاز</span>
                    <span className="font-mono">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-secondary/30 p-3 rounded-xl">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">الميزانية المرصودة:</span>
                    <span className="font-bold font-mono text-emerald-600">{proj.budget.toLocaleString()} ر.س</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">الموعد النهائي:</span>
                    <span className="font-bold font-mono text-foreground">{proj.deadline}</span>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>فريق العمل: {proj.members.join(' • ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TASKS VIEW (المهام) */}
      {/* ========================================================================= */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              <span>سجل مهام التشغيل والتوريد</span>
            </h3>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>مهمة جديدة</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-secondary text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">عنوان المهمة</th>
                  <th className="p-3">المشروع</th>
                  <th className="p-3">المسؤول</th>
                  <th className="p-3">الأولوية</th>
                  <th className="p-3">تاريخ البدء</th>
                  <th className="p-3">تاريخ الاستحقاق</th>
                  <th className="p-3">ساعات العمل</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-bold text-foreground">{task.taskName}</td>
                    <td className="p-3 text-muted-foreground">{task.project || '-'}</td>
                    <td className="p-3 font-semibold">{task.assignedTo}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        task.priority === 'عاجل' ? 'bg-rose-500/10 text-rose-600' :
                        task.priority === 'مرتفع' ? 'bg-amber-500/10 text-amber-600' : 'bg-sky-500/10 text-sky-600'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-muted-foreground">{task.startDate}</td>
                    <td className="p-3 font-mono text-muted-foreground">{task.dueDate}</td>
                    <td className="p-3 font-mono">{task.timeSpentHours || 0} س</td>
                    <td className="p-3">{getStatusPill(task.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. CONTRACTS VIEW (العقود) */}
      {/* ========================================================================= */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>العقود والاتفاقيات الحكومية والتجارية</span>
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
                  <th className="p-3">العميل / الجهة</th>
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
                    <td className="p-3 font-bold text-foreground">{cnt.subject}</td>
                    <td className="p-3 font-semibold">{cnt.clientName}</td>
                    <td className="p-3">{cnt.contractType}</td>
                    <td className="p-3 text-left font-mono font-bold text-emerald-600">{cnt.contractValue.toLocaleString()} ر.س</td>
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
      {/* 11. EXPENSES VIEW (المصروفات) */}
      {/* ========================================================================= */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>مصروفات التشغيل وتكاليف المشاريع</span>
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
                  <th className="p-3">التصنيف</th>
                  <th className="p-3 text-left">المبلغ</th>
                  <th className="p-3 text-left">الضريبة (15%)</th>
                  <th className="p-3">المشروع المرتبط</th>
                  <th className="p-3">طريقة السداد</th>
                  <th className="p-3">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-bold text-foreground">{exp.expenseName}</td>
                    <td className="p-3 text-emerald-600 font-medium">{exp.category}</td>
                    <td className="p-3 text-left font-mono font-bold text-foreground">{exp.amount.toLocaleString()} ر.س</td>
                    <td className="p-3 text-left font-mono text-muted-foreground">{exp.taxAmount.toLocaleString()} ر.س</td>
                    <td className="p-3 text-muted-foreground">{exp.project || '-'}</td>
                    <td className="p-3">{exp.paymentMode}</td>
                    <td className="p-3 font-mono text-muted-foreground">{exp.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. TICKETS VIEW (الدعم والتذاكر) */}
      {/* ========================================================================= */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>تذاكر الدعم والربط مع الجهات والمنافسات</span>
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
                  <th className="p-3">الخدمة</th>
                  <th className="p-3">جهة الاتصال</th>
                  <th className="p-3">الأولوية</th>
                  <th className="p-3">آخر رد</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {tickets.map(tkt => (
                  <tr key={tkt.id} className="hover:bg-emerald-500/5">
                    <td className="p-3 font-bold text-foreground">{tkt.subject}</td>
                    <td className="p-3 font-medium text-emerald-600">{tkt.department}</td>
                    <td className="p-3 text-muted-foreground">{tkt.service}</td>
                    <td className="p-3">{tkt.contact}</td>
                    <td className="p-3 font-semibold">{tkt.priority}</td>
                    <td className="p-3 font-mono text-muted-foreground">{tkt.lastReply}</td>
                    <td className="p-3">{getStatusPill(tkt.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. KNOWLEDGE BASE VIEW (قاعدة المعرفة) */}
      {/* ========================================================================= */}
      {activeTab === 'knowledge-base' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>قاعدة المعرفة واللوائح التنظيمية لمنصة اعتماد</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledge.map(art => (
              <div key={art.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">
                  {art.category}
                </span>
                <h4 className="font-bold text-foreground text-sm">{art.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{art.summary}</p>
                <div className="p-3 bg-secondary/30 rounded-xl text-xs text-foreground leading-relaxed">
                  {art.content}
                </div>
                <div className="text-[11px] text-muted-foreground flex justify-between pt-1 font-mono">
                  <span>نشر في: {art.publishedDate}</span>
                  <span>👁️ {art.viewsCount} مشاهدة</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. CALENDAR VIEW (التقويم التفاعلي لمنافسات وعقود كاس) */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Calendar Header with Navigation and Filter */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  تقويم المواعيد والاستحقاقات
                </h3>
                <p className="text-xs text-muted-foreground">
                  {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][calendarMonth]} {calendarYear}
                </p>
              </div>
            </div>

            {/* Month Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (calendarMonth === 0) {
                    setCalendarMonth(11);
                    setCalendarYear(y => y - 1);
                  } else {
                    setCalendarMonth(m => m - 1);
                  }
                }}
                className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الشهر السابق</span>
              </button>

              <button
                onClick={() => {
                  setCalendarMonth(7); // August
                  setCalendarYear(2026);
                  setSelectedCalendarDay(30);
                }}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                اليوم
              </button>

              <button
                onClick={() => {
                  if (calendarMonth === 11) {
                    setCalendarMonth(0);
                    setCalendarYear(y => y + 1);
                  } else {
                    setCalendarMonth(m => m + 1);
                  }
                }}
                className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center gap-1"
              >
                <span>الشهر التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Event Category Filter */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'competitions', label: 'المنافسات (أخضر)' },
                { id: 'invoices', label: 'الفواتير (أزرق)' },
                { id: 'tasks', label: 'المهام (برتقالي)' },
                { id: 'contracts', label: 'العقود (بنفسجي)' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setCalendarFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    calendarFilter === f.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 7-Day Monthly Grid */}
            <div className="lg:col-span-3 bg-card border border-border rounded-2xl shadow-sm p-5 space-y-4">
              {/* Day names header */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground border-b border-border pb-3">
                {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, idx) => {
                  const dayNum = idx - 5; // Offset for August 2026 starting on Saturday
                  const isValidDay = dayNum >= 1 && dayNum <= 31;
                  const isSelected = selectedCalendarDay === dayNum;
                  const isToday = dayNum === 30 && calendarMonth === 7;

                  // Scheduled events for this day
                  const dayComp = isValidDay && (dayNum === 2 || dayNum === 4 || dayNum === 5 || dayNum === 30);
                  const dayInv = isValidDay && (dayNum === 10 || dayNum === 18 || dayNum === 20 || dayNum === 30);
                  const dayTask = isValidDay && (dayNum === 2 || dayNum === 5 || dayNum === 28 || dayNum === 30);

                  return (
                    <div
                      key={idx}
                      onClick={() => isValidDay && setSelectedCalendarDay(dayNum)}
                      className={`min-h-[85px] p-2 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                        !isValidDay 
                          ? 'opacity-20 border-transparent bg-secondary/10 pointer-events-none' 
                          : isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                          : isToday
                          ? 'border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-500'
                          : 'border-border/60 bg-secondary/20 hover:border-border hover:bg-secondary/40 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono text-xs ${
                          isToday ? 'bg-emerald-600 text-white' : isSelected ? 'font-black text-emerald-600' : 'text-foreground'
                        }`}>
                          {isValidDay ? dayNum : ''}
                        </span>
                        {isToday && <span className="text-[9px] font-bold text-emerald-600">اليوم</span>}
                      </div>

                      {isValidDay && (
                        <div className="space-y-1 mt-1">
                          {dayComp && (calendarFilter === 'all' || calendarFilter === 'competitions') && (
                            <div className="text-[9px] font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded truncate">
                              🏆 منافسة اعتماد
                            </div>
                          )}
                          {dayInv && (calendarFilter === 'all' || calendarFilter === 'invoices') && (
                            <div className="text-[9px] font-semibold bg-sky-500/20 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded truncate">
                              💰 استحقاق فاتورة
                            </div>
                          )}
                          {dayTask && (calendarFilter === 'all' || calendarFilter === 'tasks') && (
                            <div className="text-[9px] font-semibold bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded truncate">
                              📋 تسليم مهمة
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Agenda Side Panel */}
            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <div className="border-b border-border pb-3">
                <div className="text-xs text-muted-foreground font-semibold">تفاصيل اليوم المختار</div>
                <h4 className="text-lg font-bold text-foreground mt-0.5">
                  {selectedCalendarDay || 30} {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][calendarMonth]} {calendarYear}
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-emerald-600">
                    <span>🏆 موعد تقديم منافسة</span>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">معتمد</span>
                  </div>
                  <div className="font-semibold text-foreground">توريد وتركيب أنظمة إنارة لمستشفى الملك سلمان بالطائف</div>
                  <div className="text-[11px] text-muted-foreground font-mono">الجهة: الشؤون الصحية بالحرس الوطني</div>
                </div>

                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-sky-600">
                    <span>💰 استحقاق سداد فاتورة</span>
                    <span className="text-[10px] bg-sky-500/20 px-2 py-0.5 rounded-full">ZATCA</span>
                  </div>
                  <div className="font-semibold text-foreground">فاتورة رقم INV-000001 (قيمة: 106,006 ر.س)</div>
                  <div className="text-[11px] text-muted-foreground">العميل: مؤسسة خالد السليم للتجارة</div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-amber-600">
                    <span>📋 موعد إنجاز مهمة تشغيل</span>
                    <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full">عاجل</span>
                  </div>
                  <div className="font-semibold text-foreground">إدارة مشتريات الدمام – توريد مضخات غاطسة</div>
                  <div className="text-[11px] text-muted-foreground font-mono">المسؤول: محمد خالد</div>
                </div>
              </div>

              <button
                onClick={() => setShowAddTaskModal(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ جدولة حدث أو مهمة جديدة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 15. REPORTS VIEW (التقارير المالية وإقرارات ZATCA لشركة كاس) */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>التقارير المالية والإقرارات الضريبية ZATCA</span>
              </h3>
              <p className="text-xs text-muted-foreground">شركة كاس للتجارة والمقاولات • السجل الضريبي 310245879600003</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-secondary rounded-xl p-1 text-xs font-bold">
                {[
                  { id: 'ytd', label: 'كامل عام 2026' },
                  { id: 'q3', label: 'الربع الثالث Q3' },
                  { id: 'q2', label: 'الربع الثاني Q2' }
                ].map(tf => (
                  <button
                    key={tf.id}
                    onClick={() => setReportsTimeframe(tf.id as any)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      reportsTimeframe === tf.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة التقرير</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-2">
              <span className="text-xs text-muted-foreground font-semibold">إجمالي المبيعات والفواتير</span>
              <div className="text-2xl font-bold font-mono text-emerald-600">{stats.totalInvoicesAmount.toLocaleString()} ر.س</div>
              <div className="text-xs text-muted-foreground">ضريبة القيمة المضافة 15%: {(stats.totalInvoicesAmount * 0.15).toLocaleString()} ر.س</div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-2">
              <span className="text-xs text-muted-foreground font-semibold">المبالغ المحصلة فعلياً</span>
              <div className="text-2xl font-bold font-mono text-sky-600">{stats.paidAmount.toLocaleString()} ر.س</div>
              <div className="text-xs text-sky-600 font-semibold">{Math.round((stats.paidAmount / (stats.totalInvoicesAmount || 1)) * 100)}% من إجمالي المستحقات</div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-2">
              <span className="text-xs text-muted-foreground font-semibold">تكاليف التشغيل والمصروفات</span>
              <div className="text-2xl font-bold font-mono text-rose-600">{stats.totalExpenses.toLocaleString()} ر.س</div>
              <div className="text-xs text-muted-foreground">ضريبة المدخلات المستردة: {(stats.totalExpenses * 0.15).toLocaleString()} ر.س</div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-2">
              <span className="text-xs text-muted-foreground font-semibold">صافي الربح التشغيلي</span>
              <div className="text-2xl font-bold font-mono text-foreground">{(stats.totalInvoicesAmount - stats.totalExpenses).toLocaleString()} ر.س</div>
              <div className="text-xs text-emerald-600 font-bold">هامش ربح تقديري: {Math.round(((stats.totalInvoicesAmount - stats.totalExpenses) / (stats.totalInvoicesAmount || 1)) * 100)}%</div>
            </div>
          </div>

          {/* Official ZATCA VAT 15% Return Table */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  نموذج إقرار ضريبة القيمة المضافة (15%) - هيئة الزكاة والضريبة والجمارك ZATCA
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">الحساب الضريبي الموحد لمؤسسة خالد عبدالعزيز السليم (كاس)</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full font-bold text-xs font-mono">
                جاهز للإقرار
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead className="bg-secondary text-foreground font-bold border-b border-border">
                  <tr>
                    <th className="p-3">البند الضريبي</th>
                    <th className="p-3 text-left">المبلغ الخاضع (ر.س)</th>
                    <th className="p-3 text-left">نسبة الضريبة</th>
                    <th className="p-3 text-left">مبلغ الضريبة (ر.س)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  <tr>
                    <td className="p-3 font-semibold text-foreground">1. المبيعات الخاضعة للنسبة الأساسية (15%)</td>
                    <td className="p-3 text-left font-bold">{stats.totalInvoicesAmount.toLocaleString()}</td>
                    <td className="p-3 text-left">15%</td>
                    <td className="p-3 text-left font-bold text-emerald-600">{(stats.totalInvoicesAmount * 0.15).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">2. المشتريات الخاضعة للنسبة الأساسية (ضريبة المدخلات)</td>
                    <td className="p-3 text-left font-bold">{stats.totalExpenses.toLocaleString()}</td>
                    <td className="p-3 text-left">15%</td>
                    <td className="p-3 text-left font-bold text-rose-600">{(stats.totalExpenses * 0.15).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-emerald-500/5 font-extrabold text-foreground border-t-2 border-emerald-500">
                    <td className="p-3 text-sm">صافي ضريبة القيمة المضافة المستحقة للسداد للهيئة (1 - 2)</td>
                    <td className="p-3 text-left">{(stats.totalInvoicesAmount - stats.totalExpenses).toLocaleString()}</td>
                    <td className="p-3 text-left">15%</td>
                    <td className="p-3 text-left text-sm text-emerald-600">{((stats.totalInvoicesAmount - stats.totalExpenses) * 0.15).toLocaleString(undefined, { minimumFractionDigits: 2 })} ر.س</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-secondary/50 text-[11px] text-muted-foreground">
              * تم احتساب المبالغ تلقائياً بموجب الفواتير المعتمدة والمصروفات المسجلة في منظومة سحابة كاس.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 16. CLIENTS VIEW (العملاء مع ملف العميل 360) */}
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
      {/* 17. STAFF VIEW (الطاقم وفريق العمل) */}
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
      {/* 18. SETTINGS VIEW (تصنيفات المنافسات والأكواد 01 - 9987) */}
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
      {/* PROPOSALS VIEW (العروض) */}
      {/* ========================================================================= */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Send className="w-4 h-4 text-violet-600" />
              <span>العروض التجارية</span>
              <span className="text-xs text-muted-foreground">({proposals.length} عرض)</span>
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => {
                setFormData({});
                setItemLines([{ description: '', qty: 1, rate: 0, taxPct: 15, total: 0 }]);
                setShowAddProposalModal(true);
              }} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /><span>عرض تجاري جديد</span>
              </button>
              <button onClick={() => kasEtmadSuiteService.exportProposalsToXLSX()} className="px-3 py-2 rounded-xl bg-secondary text-xs font-bold flex items-center gap-1 cursor-pointer">
                <Download className="w-3.5 h-3.5" /><span>تصدير</span>
              </button>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/50 text-muted-foreground">
                  <th className="px-4 py-3 text-right font-bold">عرض #</th>
                  <th className="px-4 py-3 text-right font-bold">الموضوع</th>
                  <th className="px-4 py-3 text-right font-bold">إلى</th>
                  <th className="px-4 py-3 text-right font-bold">الإجمالي</th>
                  <th className="px-4 py-3 text-right font-bold">التاريخ</th>
                  <th className="px-4 py-3 text-right font-bold">مفتوح حتى</th>
                  <th className="px-4 py-3 text-right font-bold">المشروع</th>
                  <th className="px-4 py-3 text-right font-bold">الحالة</th>
                  <th className="px-4 py-3 text-right font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {proposals.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">لا توجد عروض بعد</td></tr>
                ) : proposals.map(p => (
                  <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-violet-600">{p.proposalNumber}</td>
                    <td className="px-4 py-3 font-semibold text-foreground max-w-[200px] truncate">{p.subject}</td>
                    <td className="px-4 py-3 text-foreground">{p.toClient}</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600">{p.totalAmount.toLocaleString()} ر.س</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{p.date}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{p.openTill}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.project || '—'}</td>
                    <td className="px-4 py-3">{getStatusPill(p.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelectedDetail(p); setDetailType('estimate'); setShowDetailModal(true); }} className="p-1.5 rounded-lg hover:bg-secondary text-sky-600 cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => kasEtmadSuiteService.deleteProposal(p.id) && setReloadKey(k => k + 1)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREDIT NOTES VIEW (إشعارات الائتمان) */}
      {/* ========================================================================= */}
      {activeTab === 'credit-notes' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-orange-600" />
              <span>إشعارات الائتمان</span>
              <span className="text-xs text-muted-foreground">({creditNotes.length} إشعار)</span>
            </h3>
            <button onClick={() => {
              setFormData({});
              setShowAddCreditNoteModal(true);
            }} className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /><span>إشعار ائتمان جديد</span>
            </button>
          </div>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/50 text-muted-foreground">
                  <th className="px-4 py-3 text-right font-bold">إشعار #</th>
                  <th className="px-4 py-3 text-right font-bold">العميل</th>
                  <th className="px-4 py-3 text-right font-bold">التاريخ</th>
                  <th className="px-4 py-3 text-right font-bold">فاتورة مرجعية</th>
                  <th className="px-4 py-3 text-right font-bold">المشروع</th>
                  <th className="px-4 py-3 text-right font-bold">المبلغ المتبقي</th>
                  <th className="px-4 py-3 text-right font-bold">الإجمالي</th>
                  <th className="px-4 py-3 text-right font-bold">الحالة</th>
                  <th className="px-4 py-3 text-right font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {creditNotes.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">لا توجد إشعارات ائتمان</td></tr>
                ) : creditNotes.map(cn => (
                  <tr key={cn.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-orange-600">{cn.creditNoteNumber}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{cn.clientName}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{cn.date}</td>
                    <td className="px-4 py-3 font-mono text-sky-600">{cn.invoiceRef || '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{cn.project || '—'}</td>
                    <td className="px-4 py-3 font-mono font-bold text-amber-600">{cn.remainingAmount.toLocaleString()} ر.س</td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">{cn.totalAmount.toLocaleString()} ر.س</td>
                    <td className="px-4 py-3">{getStatusPill(cn.status)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => kasEtmadSuiteService.deleteCreditNote(cn.id) && setReloadKey(k => k + 1)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBSCRIPTIONS VIEW (الاشتراكات) */}
      {/* ========================================================================= */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-teal-600" />
              <span>الاشتراكات الدورية</span>
              <span className="text-xs text-muted-foreground">({subscriptions.length} اشتراك)</span>
            </h3>
            <button onClick={() => {
              setFormData({});
              setShowAddSubscriptionModal(true);
            }} className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /><span>اشتراك دوري جديد</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map(sub => (
              <div key={sub.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-relaxed">{sub.subscriptionName}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub.clientName}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${sub.status === 'نشط' ? 'bg-emerald-100 text-emerald-700' : sub.status === 'متوقف' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{sub.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-secondary/50">
                    <span className="text-muted-foreground block">المبلغ</span>
                    <span className="font-bold font-mono text-foreground">{sub.amount.toLocaleString()} ر.س</span>
                  </div>
                  <div className="p-2 rounded-xl bg-secondary/50">
                    <span className="text-muted-foreground block">الفترة</span>
                    <span className="font-bold text-foreground">{sub.billingInterval}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-secondary/50">
                    <span className="text-muted-foreground block">بدء</span>
                    <span className="font-mono text-foreground">{sub.startDate}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-secondary/50">
                    <span className="text-muted-foreground block">الفوترة القادمة</span>
                    <span className="font-mono text-foreground">{sub.nextBillingDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                  <button onClick={() => { kasEtmadSuiteService.updateSubscription(sub.id, { status: sub.status === 'نشط' ? 'متوقف' : 'نشط' }); setReloadKey(k => k + 1); }} className="flex-1 py-1.5 rounded-lg bg-secondary text-xs font-bold text-foreground hover:bg-secondary/80 cursor-pointer">
                    {sub.status === 'نشط' ? 'إيقاف' : 'تفعيل'}
                  </button>
                  <button onClick={() => kasEtmadSuiteService.deleteSubscription(sub.id) && setReloadKey(k => k + 1)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ESTIMATE REQUESTS VIEW (طلب عرض سعر) */}
      {/* ========================================================================= */}
      {activeTab === 'estimate-requests' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FilePlus className="w-4 h-4 text-indigo-600" />
              <span>طلبات عروض الأسعار</span>
              <span className="text-xs text-muted-foreground">({estimateRequests.length} طلب)</span>
            </h3>
            <button onClick={() => {
              setFormData({});
              setShowAddEstimateRequestModal(true);
            }} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /><span>طلب عرض سعر جديد</span>
            </button>
          </div>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/50 text-muted-foreground">
                  <th className="px-4 py-3 text-right font-bold">طلب #</th>
                  <th className="px-4 py-3 text-right font-bold">العميل</th>
                  <th className="px-4 py-3 text-right font-bold">الوصف</th>
                  <th className="px-4 py-3 text-right font-bold">التاريخ</th>
                  <th className="px-4 py-3 text-right font-bold">الحالة</th>
                  <th className="px-4 py-3 text-right font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {estimateRequests.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">لا توجد طلبات</td></tr>
                ) : estimateRequests.map(req => (
                  <tr key={req.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600">{req.requestNumber}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{req.clientName || '—'}</td>
                    <td className="px-4 py-3 text-foreground max-w-[300px] truncate">{req.description || '—'}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{req.requestedDate}</td>
                    <td className="px-4 py-3">{getStatusPill(req.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {req.status === 'جديد' && (
                          <button onClick={() => {
                            kasEtmadSuiteService.updateEstimateRequest(req.id, { status: 'تم التحويل لعرض سعر' });
                            setReloadKey(k => k + 1);
                            addNotification({ title: 'تم تحويل الطلب', message: 'تم تحويله لعرض سعر بنجاح.', type: 'success' });
                          }} className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-bold hover:bg-emerald-200 cursor-pointer">
                            تحويل لعرض سعر
                          </button>
                        )}
                        <button onClick={() => kasEtmadSuiteService.deleteEstimateRequest(req.id) && setReloadKey(k => k + 1)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EMAIL TEMPLATES VIEW (قوالب البريد الإلكتروني) */}
      {/* ========================================================================= */}
      {activeTab === 'email-templates' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-pink-600" />
              <span>قوالب البريد الإلكتروني</span>
              <span className="text-xs text-muted-foreground">({emailTemplates.length} قالب)</span>
            </h3>
            <button onClick={() => {
              setFormData({});
              setShowAddTemplateModal(true);
            }} className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /><span>قالب بريد جديد</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailTemplates.map(tmpl => (
              <div key={tmpl.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tmpl.category === 'فاتورة' ? 'bg-sky-100 text-sky-700' :
                        tmpl.category === 'عرض سعر' ? 'bg-violet-100 text-violet-700' :
                        tmpl.category === 'إشعار دفع' ? 'bg-emerald-100 text-emerald-700' :
                        tmpl.category === 'متابعة' ? 'bg-amber-100 text-amber-700' :
                        'bg-pink-100 text-pink-700'
                      }`}>{tmpl.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground mt-2">{tmpl.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">الموضوع: {tmpl.subject}</p>
                  </div>
                  <button onClick={() => kasEtmadSuiteService.deleteEmailTemplate(tmpl.id) && setReloadKey(k => k + 1)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 text-xs text-foreground leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto font-mono">{tmpl.body}</div>
                <div className="flex flex-wrap gap-1">
                  {tmpl.variables.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-mono text-muted-foreground">{v}</span>
                  ))}
                </div>
                <div className="text-[10px] text-muted-foreground">آخر تعديل: {tmpl.lastModified}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UTILITIES VIEW (الأدوات المساعدة) */}
      {/* ========================================================================= */}
      {activeTab === 'utilities' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* VAT Calculator */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                <span>حاسبة ضريبة القيمة المضافة (15%)</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">المبلغ قبل الضريبة</label>
                  <input type="number" placeholder="أدخل المبلغ..." value={formData.vatAmount || ''} onChange={e => setFormData({ ...formData, vatAmount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-secondary/50 border rounded-xl text-sm font-mono" />
                </div>
                {formData.vatAmount && parseFloat(formData.vatAmount) > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">المبلغ قبل الضريبة:</span>
                      <span className="font-bold font-mono">{parseFloat(formData.vatAmount).toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">ضريبة 15%:</span>
                      <span className="font-bold font-mono text-amber-600">{(parseFloat(formData.vatAmount) * 0.15).toLocaleString(undefined, { minimumFractionDigits: 2 })} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-emerald-200 dark:border-emerald-800 pt-2">
                      <span className="font-bold text-emerald-700">الإجمالي شامل الضريبة:</span>
                      <span className="font-extrabold font-mono text-emerald-700">{(parseFloat(formData.vatAmount) * 1.15).toLocaleString(undefined, { minimumFractionDigits: 2 })} ر.س</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reverse VAT Calculator */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-sky-600" />
                <span>حاسبة عكسية (استخراج المبلغ من الإجمالي)</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">المبلغ شامل الضريبة</label>
                  <input type="number" placeholder="أدخل الإجمالي..." value={formData.reverseVat || ''} onChange={e => setFormData({ ...formData, reverseVat: e.target.value })}
                    className="w-full px-4 py-2.5 bg-secondary/50 border rounded-xl text-sm font-mono" />
                </div>
                {formData.reverseVat && parseFloat(formData.reverseVat) > 0 && (
                  <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">المبلغ قبل الضريبة:</span>
                      <span className="font-bold font-mono">{(parseFloat(formData.reverseVat) / 1.15).toLocaleString(undefined, { minimumFractionDigits: 2 })} ر.س</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">قيمة الضريبة 15%:</span>
                      <span className="font-bold font-mono text-amber-600">{(parseFloat(formData.reverseVat) - parseFloat(formData.reverseVat) / 1.15).toLocaleString(undefined, { minimumFractionDigits: 2 })} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-sky-200 dark:border-sky-800 pt-2">
                      <span className="font-bold text-sky-700">الإجمالي شامل الضريبة:</span>
                      <span className="font-extrabold font-mono text-sky-700">{parseFloat(formData.reverseVat).toLocaleString(undefined, { minimumFractionDigits: 2 })} ر.س</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <PieChart className="w-5 h-5 text-violet-600" />
                <span>ملخص الأداء السريع</span>
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-secondary/50">
                  <span className="text-muted-foreground">إجمالي الإيرادات</span>
                  <span className="font-bold font-mono text-emerald-600">{stats.totalInvoicesAmount.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-secondary/50">
                  <span className="text-muted-foreground">إجمالي المصروفات</span>
                  <span className="font-bold font-mono text-rose-600">{stats.totalExpenses.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-secondary/50">
                  <span className="text-muted-foreground">صافي الربح التقديري</span>
                  <span className="font-bold font-mono text-foreground">{(stats.paidAmount - stats.totalExpenses).toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-secondary/50">
                  <span className="text-muted-foreground">فواتير معلقة</span>
                  <span className="font-bold font-mono text-amber-600">{stats.unpaidAmount.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-secondary/50">
                  <span className="text-muted-foreground">إيرادات الاشتراكات الدورية</span>
                  <span className="font-bold font-mono text-teal-600">{stats.totalSubscriptionsRevenue.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-secondary/50">
                  <span className="text-muted-foreground">نسبة فوز المنافسات</span>
                  <span className="font-bold text-foreground">{stats.winRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DETAIL / OFFICIAL ZATCA PRINT PREVIEW */}
      {/* ========================================================================= */}
      {showDetailModal && selectedDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="text-xs text-slate-500 font-bold tracking-wider">مؤسسة خالد عبدالعزيز السليم للتجارة والمقاولات (كاس)</div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">فاتورة ضريبية إلكترونية ZATCA</h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">الرقم الضريبي: 310245879600003</div>
              </div>
              <div className="p-2 border rounded-xl bg-slate-50 text-center">
                <QrCode className="w-16 h-16 mx-auto text-slate-900" />
                <span className="text-[9px] font-bold text-slate-600 block mt-1">ZATCA QR VERIFIED</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-slate-500 block">رقم الفاتورة:</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedDetail.invoiceNumber || selectedDetail.estimateNumber || selectedDetail.referenceNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">التاريخ:</span>
                <span className="font-mono font-bold text-sm text-slate-900">{selectedDetail.date || selectedDetail.createdAt}</span>
              </div>
              <div>
                <span className="text-slate-500 block">العميل / الجهة:</span>
                <span className="font-bold text-sm text-slate-900">{selectedDetail.clientName || selectedDetail.governmentEntity}</span>
              </div>
              <div>
                <span className="text-slate-500 block">الحالة:</span>
                <span className="font-bold text-emerald-700">{selectedDetail.status}</span>
              </div>
            </div>

            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-slate-100 font-bold border-b">
                <tr>
                  <th className="p-2">البند</th>
                  <th className="p-2 w-16">الكمية</th>
                  <th className="p-2 w-24">السعر</th>
                  <th className="p-2 w-24 text-left">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(selectedDetail.items || [{ description: selectedDetail.title || 'توريدات معتمدة', qty: 1, rate: selectedDetail.amount || selectedDetail.totalItemsValue || 1000, total: selectedDetail.amount || selectedDetail.totalItemsValue || 1150 }]).map((it: any, i: number) => (
                  <tr key={i}>
                    <td className="p-2 font-medium">{it.description}</td>
                    <td className="p-2 font-mono">{it.qty}</td>
                    <td className="p-2 font-mono">{it.rate?.toLocaleString()} ر.س</td>
                    <td className="p-2 text-left font-mono font-bold">{(it.qty * it.rate)?.toLocaleString()} ر.س</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-slate-50 p-4 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between font-mono">
                <span>المبلغ الخاضع للضريبة:</span>
                <span className="font-bold">{(selectedDetail.amount || selectedDetail.totalItemsValue || selectedDetail.totalAmount || 0).toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between font-mono text-emerald-700 font-bold">
                <span>ضريبة القيمة المضافة (15%):</span>
                <span>{(selectedDetail.taxAmount || ((selectedDetail.amount || selectedDetail.totalItemsValue || 0) * 0.15)).toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between font-mono font-extrabold text-sm border-t pt-2 text-slate-900">
                <span>المبلغ الإجمالي المستحق:</span>
                <span>{((selectedDetail.amount || selectedDetail.totalItemsValue || selectedDetail.totalAmount || 0) * 1.15).toLocaleString()} ر.س</span>
              </div>
              <div className="text-[11px] text-slate-600 pt-1 font-semibold">
                التفقيط: {tafqeet((selectedDetail.amount || selectedDetail.totalItemsValue || selectedDetail.totalAmount || 0) * 1.15)}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة المستند الرسمي</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD INVOICE */}
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
      {/* MODAL: ADD ESTIMATE */}
      {/* ========================================================================= */}
      {showAddEstimateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">إصدار عرض سعر وعطاء تقديري جديد</h3>
              <button onClick={() => setShowAddEstimateModal(false)} className="p-1 text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium mb-1">العميل / الجهة *</label>
                <input
                  type="text"
                  placeholder="اسم الجهة أو العميل..."
                  value={formData.clientName || ''}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">المشروع</label>
                <input
                  type="text"
                  placeholder="مشروع..."
                  value={formData.project || ''}
                  onChange={e => setFormData({ ...formData, project: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddEstimateModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs">إلغاء</button>
              <button onClick={handleSaveEstimate} className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs">حفظ عرض السعر</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD PAYMENT */}
      {/* ========================================================================= */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-foreground">تسجيل سند قبض بنكي جديد</h3>
              <button onClick={() => setShowAddPaymentModal(false)} className="p-1 text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">رقم الفاتورة *</label>
                <input
                  type="text"
                  placeholder="INV-000001"
                  value={formData.invoiceNumber || ''}
                  onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">المبلغ المحصل (ر.س) *</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={formData.amount || ''}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">طريقة السداد</label>
                <select
                  value={formData.paymentMode || 'تحويل بنكي'}
                  onChange={e => setFormData({ ...formData, paymentMode: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                >
                  <option value="تحويل بنكي">تحويل بنكي</option>
                  <option value="سداد">سداد</option>
                  <option value="بطاقة مدى / ائتمان">بطاقة مدى / ائتمان</option>
                  <option value="شيك مصدّق">شيك مصدّق</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddPaymentModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs">إلغاء</button>
              <button onClick={handleSavePayment} className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs">حفظ السند</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD ITEM */}
      {/* ========================================================================= */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-foreground">إضافة صنف جديد لجدول الكميات</h3>
              <button onClick={() => setShowAddItemModal(false)} className="p-1 text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">اسم / وصف البند *</label>
                <input
                  type="text"
                  placeholder="وصف البند..."
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">السعر الإفرادي (ر.س) *</label>
                <input
                  type="number"
                  placeholder="150"
                  value={formData.rate || ''}
                  onChange={e => setFormData({ ...formData, rate: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">المجموعة</label>
                <select
                  value={formData.group || 'توريدات حكومية'}
                  onChange={e => setFormData({ ...formData, group: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                >
                  <option value="توريدات حكومية">توريدات حكومية</option>
                  <option value="ضيافة وتمور">ضيافة وتمور</option>
                  <option value="ديكور ومعارض">ديكور ومعارض</option>
                  <option value="أجهزة وتقنية">أجهزة وتقنية</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddItemModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs">إلغاء</button>
              <button onClick={handleSaveItem} className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs">حفظ الصنف</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD CLIENT */}
      {/* ========================================================================= */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-foreground">إضافة عميل / جهة حكومية جديدة</h3>
              <button onClick={() => setShowAddClientModal(false)} className="p-1 text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">اسم المنشأة / الجهة *</label>
                <input
                  type="text"
                  placeholder="أمانة، وزارة، شركة..."
                  value={formData.company || ''}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">رقم الهاتف *</label>
                <input
                  type="text"
                  placeholder="011..."
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">الرقم الضريبي VAT</label>
                <input
                  type="text"
                  placeholder="300000000000003"
                  value={formData.vatNumber || ''}
                  onChange={e => setFormData({ ...formData, vatNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddClientModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs">إلغاء</button>
              <button onClick={handleSaveClient} className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs">حفظ العميل</button>
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
              <button onClick={() => setShowAddCategoryModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs">إلغاء</button>
              <button onClick={handleSaveCategory} className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs">حفظ</button>
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
              <button onClick={() => setShowAddStaffModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs">إلغاء</button>
              <button onClick={handleSaveStaff} className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs">حفظ العضو</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CLIENT 360 PROFILE (ملف العميل المتكامل) */}
      {/* ========================================================================= */}
      {selectedClientProfile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  {selectedClientProfile.company.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">{selectedClientProfile.company}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
                      عميل معتمد
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    الرقم الضريبي: <span className="font-mono">{selectedClientProfile.vatNumber || '310245879600003'}</span> • المدينة: {selectedClientProfile.city}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClientProfile(null)} 
                className="p-1.5 rounded-xl text-muted-foreground hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[11px] text-muted-foreground block">إجمالي التعاملات</span>
                <span className="text-base font-bold font-mono text-foreground mt-0.5 block">
                  {invoices.filter(i => i.clientName.includes(selectedClientProfile.company) || selectedClientProfile.company.includes(i.clientName)).reduce((s, i) => s + i.amount, 0).toLocaleString()} ر.س
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[11px] text-muted-foreground block">المسدد</span>
                <span className="text-base font-bold font-mono text-emerald-600 mt-0.5 block">
                  {invoices.filter(i => i.clientName.includes(selectedClientProfile.company) || selectedClientProfile.company.includes(i.clientName)).reduce((s, i) => s + (i.paidAmount || 0), 0).toLocaleString()} ر.س
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[11px] text-muted-foreground block">المتبقي</span>
                <span className="text-base font-bold font-mono text-rose-500 mt-0.5 block">
                  {(invoices.filter(i => i.clientName.includes(selectedClientProfile.company) || selectedClientProfile.company.includes(i.clientName)).reduce((s, i) => s + i.amount, 0) - invoices.filter(i => i.clientName.includes(selectedClientProfile.company) || selectedClientProfile.company.includes(i.clientName)).reduce((s, i) => s + (i.paidAmount || 0), 0)).toLocaleString()} ر.س
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[11px] text-muted-foreground block">العقود النشطة</span>
                <span className="text-base font-bold font-mono text-indigo-600 mt-0.5 block">
                  {contracts.filter(c => c.clientName.includes(selectedClientProfile.company) || selectedClientProfile.company.includes(c.clientName)).length} عقد
                </span>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex items-center gap-1 border-b border-border text-xs font-bold">
              {[
                { id: 'info', label: 'معلومات الجهة والاتصال' },
                { id: 'invoices', label: 'سجل الفواتير' },
                { id: 'estimates', label: 'عروض الأسعار' },
                { id: 'contracts', label: 'العقود والاتفاقيات' },
                { id: 'projects', label: 'المشاريع المرتبطة' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setClientProfileTab(tab.id as any)}
                  className={`px-4 py-2 border-b-2 transition-all ${
                    clientProfileTab === tab.id
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {clientProfileTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3 p-4 rounded-2xl bg-secondary/30 border border-border/60">
                  <h4 className="font-bold text-foreground text-sm">بيانات الاتصال والتواصل</h4>
                  <div className="space-y-2 text-muted-foreground">
                    <div>المسؤول الرئيسي: <span className="font-semibold text-foreground">{selectedClientProfile.primaryContact}</span></div>
                    <div>الهاتف / الجوال: <span className="font-mono text-foreground">{selectedClientProfile.phone}</span></div>
                    <div>البريد الإلكتروني: <span className="font-mono text-foreground">{selectedClientProfile.email}</span></div>
                    <div>المدينة / المقر: <span className="text-foreground">{selectedClientProfile.city}</span></div>
                    <div>العنوان: <span className="text-foreground">{selectedClientProfile.address || 'شارع الملك فهد، الرياض'}</span></div>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-2xl bg-secondary/30 border border-border/60">
                  <h4 className="font-bold text-foreground text-sm">التصنيف والمجموعات</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedClientProfile.groups.map((g, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                        {g}
                      </span>
                    ))}
                  </div>
                  <div className="pt-3 border-t text-muted-foreground">
                    تاريخ التسجيل: <span className="font-mono text-foreground">{selectedClientProfile.createdAt}</span>
                  </div>
                </div>
              </div>
            )}

            {clientProfileTab === 'invoices' && (
              <div className="border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-right border-collapse">
                  <thead className="bg-secondary text-foreground font-semibold">
                    <tr>
                      <th className="p-3">رقم الفاتورة</th>
                      <th className="p-3 text-left">المبلغ</th>
                      <th className="p-3">التاريخ</th>
                      <th className="p-3">تاريخ الاستحقاق</th>
                      <th className="p-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {invoices.filter(i => i.clientName.includes(selectedClientProfile.company) || selectedClientProfile.company.includes(i.clientName)).map(inv => (
                      <tr key={inv.id} className="hover:bg-emerald-500/5">
                        <td className="p-3 font-mono font-bold text-emerald-600">{inv.invoiceNumber}</td>
                        <td className="p-3 text-left font-mono font-bold">{inv.amount.toLocaleString()} ر.س</td>
                        <td className="p-3 font-mono text-muted-foreground">{inv.date}</td>
                        <td className="p-3 font-mono text-muted-foreground">{inv.dueDate}</td>
                        <td className="p-3">{getStatusPill(inv.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {clientProfileTab === 'contracts' && (
              <div className="space-y-3">
                {contracts.filter(c => c.clientName.includes(selectedClientProfile.company) || selectedClientProfile.company.includes(c.clientName)).map(cnt => (
                  <div key={cnt.id} className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-foreground">{cnt.subject}</h5>
                      <div className="text-muted-foreground mt-0.5 font-mono">{cnt.startDate} إلى {cnt.endDate} • {cnt.contractType}</div>
                    </div>
                    <div className="text-left font-mono font-bold text-emerald-600">
                      {cnt.contractValue.toLocaleString()} ر.س
                    </div>
                  </div>
                ))}
              </div>
            )}

            {clientProfileTab === 'projects' && (
              <div className="space-y-3">
                {projects.filter(p => p.clientName.includes(selectedClientProfile.company) || selectedClientProfile.company.includes(p.clientName)).map(proj => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-2 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>{proj.projectName}</span>
                      <span className="font-mono text-emerald-600">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${proj.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <button
                onClick={() => setSelectedClientProfile(null)}
                className="px-4 py-2 bg-secondary rounded-xl text-xs font-bold text-foreground"
              >
                إغلاق
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFormData({ clientName: selectedClientProfile.company });
                    setShowAddInvoiceModal(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إنشاء فاتورة لهذا العميل</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: QUICK PAYMENT RECORDING */}
      {/* ========================================================================= */}
      {showQuickPayModal && quickPayInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <span>تسجيل دفعة سداد للفاتورة</span>
              </h3>
              <button onClick={() => setShowQuickPayModal(false)} className="p-1 text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-secondary/50 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رقم الفاتورة:</span>
                  <span className="font-mono font-bold text-foreground">{quickPayInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">العميل:</span>
                  <span className="font-bold text-foreground">{quickPayInvoice.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المبلغ المستحق:</span>
                  <span className="font-mono font-bold text-rose-500">{(quickPayInvoice.amount - (quickPayInvoice.paidAmount || 0)).toLocaleString()} ر.س</span>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">مبلغ السداد المدفوع (ر.س) *</label>
                <input
                  type="number"
                  placeholder="المبلغ..."
                  defaultValue={quickPayInvoice.amount - (quickPayInvoice.paidAmount || 0)}
                  id="quickPayAmountInput"
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">طريقة السداد</label>
                <select id="quickPayModeInput" defaultValue="تحويل بنكي" className="w-full px-3 py-2 bg-secondary/50 border rounded-xl">
                  <option value="تحويل بنكي">تحويل بنكي (الراجحي / الإنماء)</option>
                  <option value="سداد">نظام سداد للمدفوعات الحكومية</option>
                  <option value="بطاقة مدى / ائتمان">بطاقة مدى / ائتمان</option>
                  <option value="شيك مصدّق">شيك مصرفي مصدّق</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">الرقم المرجعي / رقم المعاملة</label>
                <input
                  type="text"
                  placeholder="TXN-..."
                  id="quickPayTxnInput"
                  defaultValue={`TXN-${Date.now().toString().slice(-6)}`}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowQuickPayModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs font-bold">إلغاء</button>
              <button
                onClick={() => {
                  const amtInput = document.getElementById('quickPayAmountInput') as HTMLInputElement;
                  const modeInput = document.getElementById('quickPayModeInput') as HTMLSelectElement;
                  const txnInput = document.getElementById('quickPayTxnInput') as HTMLInputElement;
                  const amt = parseFloat(amtInput?.value) || (quickPayInvoice.amount - (quickPayInvoice.paidAmount || 0));

                  kasEtmadSuiteService.addPayment({
                    paymentNumber: `PAY-${String(payments.length + 1).padStart(6, '0')}`,
                    invoiceNumber: quickPayInvoice.invoiceNumber,
                    paymentMode: (modeInput?.value || 'تحويل بنكي') as any,
                    transactionId: txnInput?.value || `TXN-${Date.now()}`,
                    clientName: quickPayInvoice.clientName,
                    amount: amt,
                    date: new Date().toISOString().split('T')[0],
                    notes: `سداد مسجل عبر منظومة سحابة كاس`
                  });

                  const newPaid = (quickPayInvoice.paidAmount || 0) + amt;
                  const newStatus = newPaid >= quickPayInvoice.amount ? 'مدفوع' : 'مدفوع جزئيًا';
                  kasEtmadSuiteService.updateInvoice(quickPayInvoice.id, {
                    paidAmount: newPaid,
                    status: newStatus as any
                  });

                  addNotification({
                    title: 'تم تسجيل السداد بنجاح',
                    message: `تم قيد دفعة بمبلغ ${amt.toLocaleString()} ر.س للفاتورة ${quickPayInvoice.invoiceNumber}`,
                    type: 'success'
                  });

                  setShowQuickPayModal(false);
                  setReloadKey(k => k + 1);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs"
              >
                تأكيد وقيد السداد
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL: ADD PROPOSAL (إنشاء عرض تجاري) */}
      {/* ========================================================================= */}
      {showAddProposalModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Send className="w-5 h-5 text-violet-600" />
                <span>إنشاء عرض تجاري جديد (Proposal)</span>
              </h3>
              <button onClick={() => setShowAddProposalModal(false)} className="p-1 text-muted-foreground hover:bg-secondary rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium mb-1">موضوع العرض *</label>
                <input
                  type="text"
                  placeholder="مثال: عرض توريد مواد وتجهيزات..."
                  value={formData.subject || ''}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">العميل / الجهة المستهدفة *</label>
                <input
                  type="text"
                  placeholder="اسم الجهة..."
                  value={formData.toClient || ''}
                  onChange={e => setFormData({ ...formData, toClient: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">إجمالي قيمة العرض (ر.س) *</label>
                <input
                  type="number"
                  placeholder="المبلغ..."
                  value={formData.totalAmount || ''}
                  onChange={e => setFormData({ ...formData, totalAmount: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">تاريخ العرض</label>
                <input
                  type="date"
                  value={formData.date || new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">صلاحية العرض حتى</label>
                <input
                  type="date"
                  value={formData.openTill || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, openTill: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">المشروع المرتبط</label>
                <input
                  type="text"
                  placeholder="اسم المشروع إن وجد..."
                  value={formData.project || ''}
                  onChange={e => setFormData({ ...formData, project: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">الحالة</label>
                <select
                  value={formData.status || 'مسودة'}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                >
                  <option value="مسودة">مسودة</option>
                  <option value="مرسل">مرسل للعميل</option>
                  <option value="مقبول">مقبول ومعتمد</option>
                  <option value="مرفوض">مرفوض</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddProposalModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs font-bold">إلغاء</button>
              <button onClick={handleSaveProposal} className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs">
                حفظ وإصدار العرض
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD CREDIT NOTE (إشعار ائتمان) */}
      {/* ========================================================================= */}
      {showAddCreditNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-orange-600" />
                <span>إصدار إشعار ائتمان مالي جديد (Credit Note)</span>
              </h3>
              <button onClick={() => setShowAddCreditNoteModal(false)} className="p-1 text-muted-foreground hover:bg-secondary rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">العميل *</label>
                <input
                  type="text"
                  placeholder="اسم العميل..."
                  value={formData.clientName || ''}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">رقم الفاتورة المرجعية</label>
                <input
                  type="text"
                  placeholder="INV-000001"
                  value={formData.invoiceRef || ''}
                  onChange={e => setFormData({ ...formData, invoiceRef: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">مبلغ الإشعار (ر.س) *</label>
                <input
                  type="number"
                  placeholder="المبلغ..."
                  value={formData.totalAmount || ''}
                  onChange={e => setFormData({ ...formData, totalAmount: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">التاريخ</label>
                <input
                  type="date"
                  value={formData.date || new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddCreditNoteModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs font-bold">إلغاء</button>
              <button onClick={handleSaveCreditNote} className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs">
                قيد إشعار الائتمان
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD SUBSCRIPTION (إنشاء اشتراك دوري) */}
      {/* ========================================================================= */}
      {showAddSubscriptionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-teal-600" />
                <span>تسجيل اشتراك دوري جديد</span>
              </h3>
              <button onClick={() => setShowAddSubscriptionModal(false)} className="p-1 text-muted-foreground hover:bg-secondary rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">اسم / حزمة الاشتراك *</label>
                <input
                  type="text"
                  placeholder="مثال: اشتراك صيانة سنوية..."
                  value={formData.subscriptionName || ''}
                  onChange={e => setFormData({ ...formData, subscriptionName: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">العميل *</label>
                <input
                  type="text"
                  placeholder="اسم العميل..."
                  value={formData.clientName || ''}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">المبلغ الدوري (ر.س) *</label>
                  <input
                    type="number"
                    placeholder="المبلغ..."
                    value={formData.amount || ''}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">دورة الفوترة</label>
                  <select
                    value={formData.billingInterval || 'شهري'}
                    onChange={e => setFormData({ ...formData, billingInterval: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                  >
                    <option value="شهري">شهري</option>
                    <option value="ربع سنوي">ربع سنوي (3 أشهر)</option>
                    <option value="نصف سنوي">نصف سنوي (6 أشهر)</option>
                    <option value="سنوي">سنوي</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">تاريخ البدء</label>
                  <input
                    type="date"
                    value={formData.startDate || new Date().toISOString().split('T')[0]}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">تاريخ الفوترة القادمة</label>
                  <input
                    type="date"
                    value={formData.nextBillingDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]}
                    onChange={e => setFormData({ ...formData, nextBillingDate: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddSubscriptionModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs font-bold">إلغاء</button>
              <button onClick={handleSaveSubscription} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs">
                حفظ وتفعيل الاشتراك
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD ESTIMATE REQUEST (طلب عرض سعر) */}
      {/* ========================================================================= */}
      {showAddEstimateRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-indigo-600" />
                <span>تسجيل طلب عرض سعر جديد</span>
              </h3>
              <button onClick={() => setShowAddEstimateRequestModal(false)} className="p-1 text-muted-foreground hover:bg-secondary rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">اسم العميل / الجهة الطالبة *</label>
                <input
                  type="text"
                  placeholder="مثال: وزارة النقل..."
                  value={formData.clientName || ''}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">تفاصيل ومواصفات الطلب *</label>
                <textarea
                  rows={4}
                  placeholder="اكتب متطلبات العرض والمواصفات المطلوبة..."
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">تاريخ استلام الطلب</label>
                <input
                  type="date"
                  value={formData.requestedDate || new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, requestedDate: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddEstimateRequestModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs font-bold">إلغاء</button>
              <button onClick={handleSaveEstimateRequest} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs">
                تسجيل الطلب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD EMAIL TEMPLATE (قالب بريد) */}
      {/* ========================================================================= */}
      {showAddTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Mail className="w-5 h-5 text-pink-600" />
                <span>إنشاء قالب بريد إلكتروني جديد</span>
              </h3>
              <button onClick={() => setShowAddTemplateModal(false)} className="p-1 text-muted-foreground hover:bg-secondary rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">اسم القالب *</label>
                <input
                  type="text"
                  placeholder="مثال: إشعار استحقاق فاتورة..."
                  value={formData.templateName || ''}
                  onChange={e => setFormData({ ...formData, templateName: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">تصنيف القالب</label>
                <select
                  value={formData.type || 'الفواتير'}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                >
                  <option value="الفواتير">الفواتير</option>
                  <option value="عروض الأسعار">عروض الأسعار</option>
                  <option value="إشعارات الدفع">إشعارات الدفع</option>
                  <option value="المنافسات">المنافسات</option>
                  <option value="عام">عام</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">موضوع الرسالة (Subject) *</label>
                <input
                  type="text"
                  placeholder="موضوع البريد..."
                  value={formData.subject || ''}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">نص الرسالة (Body) *</label>
                <textarea
                  rows={5}
                  placeholder="نص البريد مع المتغيرات مثل {client_name} و {invoice_number}..."
                  value={formData.body || ''}
                  onChange={e => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/50 border rounded-xl font-mono text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddTemplateModal(false)} className="px-4 py-2 bg-secondary rounded-xl text-xs font-bold">إلغاء</button>
              <button onClick={handleSaveEmailTemplate} className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-xs">
                حفظ القالب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
