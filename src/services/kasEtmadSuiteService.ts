import * as XLSX from 'xlsx';
import {
  KasEtmadCompetition,
  KasEtmadInvoice,
  KasEtmadEstimate,
  KasEtmadPayment,
  KasEtmadCreditNote,
  KasEtmadItem,
  KasEtmadClient,
  KasEtmadLead,
  KasEtmadProject,
  KasEtmadTask,
  KasEtmadContract,
  KasEtmadSubscription,
  KasEtmadExpense,
  KasEtmadTicket,
  KasEtmadKnowledgeArticle
} from '../types/kasEtmadSuite';

const STORAGE_KEY = 'kas_etmad_suite_data_v1';

export const INITIAL_COMPETITIONS: KasEtmadCompetition[] = [
  {
    id: 'comp-1',
    seq: 35,
    title: 'مشروع تركيب خيام هرمية لزوم ميدان العرض بقيادة لواء الخليفة عمر بن الخطاب بوزارة الحرس الوطني بالقطاع الغربي (الطائف)',
    referenceNumber: '260339001923',
    isWinner: 'No',
    dueDate: '2026-03-02',
    deadlineDate: '2026-03-04',
    category: 'التجارة',
    governmentEntity: 'وزارة الحرس الوطني - القطاع الغربي',
    createdAt: '2026-03-01',
    totalItemsValue: 86500.00,
    status: 'تم رفع العرض الفني والمالي',
    notes: 'تم تقديم العينات والملف الفني المعتمد',
    contactName: 'م. أحمد البشير',
    contactPhone: '0554166722',
  },
  {
    id: 'comp-2',
    seq: 36,
    title: 'T.MA( 5778 )Heavy Duty Stainless Steel 2 Tier Catering Trolley',
    referenceNumber: '260339004112',
    isWinner: 'No',
    dueDate: '2026-03-02',
    deadlineDate: '2026-03-04',
    category: 'التجارة',
    governmentEntity: 'تجمع الشرقية الصحي',
    createdAt: '2026-03-01',
    totalItemsValue: 42300.00,
    status: 'لم يتم التسعير(لاغي)',
    notes: 'عدم توفر الاستوك لدى الوكيل',
    contactName: 'سلطان الحربي',
    contactPhone: '0138503977',
  },
  {
    id: 'comp-3',
    seq: 37,
    title: 'توريد مستلزمات صناعية لمستشفى الملك سلمان التخصصي للشؤون الصحية بوزارة الحرس الوطني بالطائف T.MA( 8014 )',
    referenceNumber: '260339007812',
    isWinner: 'Yes',
    dueDate: '2026-03-02',
    deadlineDate: '2026-03-04',
    category: 'التجارة',
    governmentEntity: 'الشؤون الصحية بالحرس الوطني - الطائف',
    createdAt: '2026-03-01',
    totalItemsValue: 124800.00,
    winningValue: 124800.00,
    status: 'تمت الترسية',
    notes: 'تم استلام التعميد وتوقيع محضر التوريد',
    contactName: 'فيصل السليم',
    contactPhone: '0500000000',
  },
  {
    id: 'comp-4',
    seq: 38,
    title: 'توريد وتركيب وتنفيذ أعمال إنارات (إضاءات) لمداخل مستشفى الملك سلمان التخصصي في الطائف التابع للشؤون الصحية بوزارة الحرس الوطني',
    referenceNumber: '260339008941',
    isWinner: 'No',
    dueDate: '2026-03-02',
    deadlineDate: '2026-03-04',
    category: 'التجارة',
    governmentEntity: 'الشؤون الصحية بالحرس الوطني',
    createdAt: '2026-03-01',
    totalItemsValue: 97500.00,
    status: 'تم رفع العرض الفني والمالي',
    notes: 'بانتظار اعتماد التقييم الفني',
    contactName: 'عبدالرحمن الشهري',
    contactPhone: '0553630676',
  },
  {
    id: 'comp-5',
    seq: 40,
    title: 'طلب حصول شهادة إعتماد آيزو للسلامة والصحة المهنية وتطوير الإجراءات',
    referenceNumber: '260339011245',
    isWinner: 'No',
    dueDate: '2026-03-05',
    deadlineDate: '2026-03-05',
    category: 'دعاية وإعلان',
    governmentEntity: 'مستشفى قوى الأمن بالدمام',
    createdAt: '2026-03-01',
    totalItemsValue: 55000.00,
    status: 'جديد',
    notes: 'قيد إعداد العرض المالي والفني',
    contactName: 'مازن الغامدي',
    contactPhone: '0118027838',
  },
  {
    id: 'comp-6',
    seq: 43,
    title: 'احتفالات عيد الفطر المبارك لعام 2026م وتجهيز مقرات الضيافة الفاخرة',
    referenceNumber: '260339014522',
    isWinner: 'Yes',
    dueDate: '2026-03-05',
    deadlineDate: '2026-03-05',
    category: 'التجارة',
    governmentEntity: 'أمانة منطقة الرياض',
    createdAt: '2026-03-01',
    totalItemsValue: 185000.00,
    winningValue: 185000.00,
    status: 'تمت الترسية',
    notes: 'ترسية كاملة وتوريد بوكسات الضيافة والتمور الملكية',
    contactName: 'خالد عبدالعزيز السليم',
    contactPhone: '0508987888',
  }
];

export const INITIAL_INVOICES: KasEtmadInvoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-000001',
    amount: 106006.00,
    taxAmount: 13566.00,
    date: '2026-02-10',
    dueDate: '2026-03-10',
    clientName: 'مؤسسة خالد السليم للتجارة (كاس)',
    project: 'مشروع توريدات اليوم الوطني 96',
    tags: ['توريدات حكومية', 'ZATCA مرحلة 2'],
    status: 'مدفوع جزئيًا',
    paidAmount: 50000.00,
    items: [
      { description: 'بوكسات توزيعات فاخرة مخصصة', qty: 500, rate: 120, taxPct: 15, total: 69000.00 },
      { description: 'تمور سكري ملكي فاخر مغلف', qty: 200, rate: 185, taxPct: 15, total: 42550.00 }
    ]
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-000002',
    amount: 575.00,
    taxAmount: 75.00,
    date: '2026-02-16',
    dueDate: '2026-03-18',
    clientName: 'مؤسسة اللمسة الخارقة للاتصالات',
    project: 'تأمين مستلزمات حاسب آلي',
    tags: ['تقنية'],
    status: 'غير مدفوع',
    paidAmount: 0.00,
    items: [
      { description: 'صيانة وتوريد ملحقات شبكية', qty: 1, rate: 500, taxPct: 15, total: 575.00 }
    ]
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-000003',
    amount: 94760.00,
    taxAmount: 12360.00,
    date: '2026-02-20',
    dueDate: '2026-03-20',
    clientName: 'قوات الطوارئ الخاصة',
    project: 'تجهيز استوديو فوتوغرافي متكامل',
    tags: ['معارض وتجهيزات'],
    status: 'مدفوع',
    paidAmount: 94760.00,
    items: [
      { description: 'تجهيز معدات استوديو فوتوغرافي متكامل', qty: 1, rate: 82400, taxPct: 15, total: 94760.00 }
    ]
  }
];

export const INITIAL_ESTIMATES: KasEtmadEstimate[] = [
  {
    id: 'est-1',
    estimateNumber: 'EST-000001',
    totalAmount: 98842.50,
    taxAmount: 12892.50,
    date: '2026-02-15',
    expiryDate: '2026-04-15',
    clientName: 'أمارة منطقة الجوف',
    project: 'تأمين ذبائح وضيافة الإمارة',
    reference: 'REF-JOUF-2026',
    status: 'مقبول',
    items: [
      { description: 'تأمين ذبائح نعيمي فاخر وضيافة متكاملة', qty: 85, rate: 1000, taxPct: 15, total: 97750.00 }
    ]
  },
  {
    id: 'est-2',
    estimateNumber: 'EST-000002',
    totalAmount: 85617.50,
    taxAmount: 11167.50,
    date: '2026-02-18',
    expiryDate: '2026-04-18',
    clientName: 'الشؤون الصحية بالحرس الوطني',
    project: 'استئجار خيمة وديكورات تراثية ليوم التأسيس',
    reference: 'REF-MNGHA-HERITAGE',
    status: 'مرسل',
    items: [
      { description: 'خيمة ملكية وديكورات تراثية وعرضة نجدية', qty: 1, rate: 74450, taxPct: 15, total: 85617.50 }
    ]
  }
];

export const INITIAL_CLIENTS: KasEtmadClient[] = [
  {
    id: 'client-1',
    company: 'مؤسسة خالد السليم للتجارة (كاس)',
    primaryContact: 'خالد عبدالعزيز السليم',
    email: 'info@kas.com.sa',
    phone: '0508987888',
    active: true,
    groups: ['المجموعة الرئيسية', 'توريدات حكومية'],
    city: 'الرياض',
    vatNumber: '310245879600003',
    createdAt: '2025-01-01'
  },
  {
    id: 'client-2',
    company: 'وزارة الحرس الوطني - الشؤون الصحية',
    primaryContact: 'م. فهد الزهراني',
    email: 'purchasing@ngha.med.sa',
    phone: '0114912222',
    active: true,
    groups: ['جهات حكومية', 'صحة'],
    city: 'الرياض',
    vatNumber: '300000000000003',
    createdAt: '2025-02-15'
  },
  {
    id: 'client-3',
    company: 'تجمع الشرقية الصحي',
    primaryContact: 'عبدالرحمن العماني',
    email: 'alalomani@moh.gov.sa',
    phone: '0138503977',
    active: true,
    groups: ['تجمعات صحية', 'توريدات طبية'],
    city: 'الدمام',
    vatNumber: '300000000000004',
    createdAt: '2025-03-10'
  },
  {
    id: 'client-4',
    company: 'الهيئة العامة للموانئ - ميناء جدة الإسلامي',
    primaryContact: 'عبدالله الشهري',
    email: 'jip-info@ports.gov.sa',
    phone: '0126270000',
    active: true,
    groups: ['موانئ ولوجستيات', 'فعاليات وطنية'],
    city: 'جدة',
    vatNumber: '300000000000005',
    createdAt: '2025-05-20'
  }
];

export const INITIAL_LEADS: KasEtmadLead[] = [
  {
    id: 'lead-1',
    name: 'سعود القحطاني',
    company: 'هيئة تطوير بوابة الدرعية',
    email: 's.qahtani@dgda.gov.sa',
    phone: '0551122334',
    opportunityValue: 450000.00,
    assignedTo: 'م. أحمد البشير',
    status: 'عرض سعر مرسل',
    source: 'منصة اعتماد',
    lastContact: '2026-08-25'
  },
  {
    id: 'lead-2',
    name: 'ماجد الشمري',
    company: 'أمانة منطقة القصيم',
    email: 'm.shammari@qassim.gov.sa',
    phone: '0544332211',
    opportunityValue: 220000.00,
    assignedTo: 'فيصل السليم',
    status: 'مؤهل',
    source: 'معارض وفعاليات',
    lastContact: '2026-08-28'
  }
];

export const INITIAL_PROJECTS: KasEtmadProject[] = [
  {
    id: 'proj-1',
    projectName: 'مشروع توريدات احتفالات اليوم الوطني 96 لميناء جدة',
    clientName: 'الهيئة العامة للموانئ',
    tags: ['فعاليات', 'توريدات', 'كاس'],
    startDate: '2026-08-15',
    deadline: '2026-09-22',
    members: ['أحمد البشير', 'فيصل السليم', 'عبدالرحمن الشهري'],
    progress: 85,
    status: 'قيد التقدم',
    budget: 95018.75
  },
  {
    id: 'proj-2',
    projectName: 'توريد وتركيب أثاث مكتبي لمركز التدريب الأمني',
    clientName: 'وزارة الداخلية - الديوان العام',
    tags: ['أثاث', 'توريدات حكومية'],
    startDate: '2026-07-01',
    deadline: '2026-08-30',
    members: ['سلطان الحربي', 'مازن الغامدي'],
    progress: 100,
    status: 'مكتمل',
    budget: 200169.00
  }
];

export const INITIAL_TASKS: KasEtmadTask[] = [
  {
    id: 'task-1',
    taskName: 'إدارة مشتريات الدمام – توريد مضخات غاطسة بمستشفى الامام عبدالرحمن بالدمام',
    status: 'قيد التقدم',
    startDate: '2026-08-25',
    dueDate: '2026-09-05',
    assignedTo: 'محمد خالد',
    priority: 'عاجل',
    project: 'مشروع توريدات الحرس الوطني',
    timeSpentHours: 14.5
  },
  {
    id: 'task-2',
    taskName: 'تسليم عينات التمور والبوكسات الملكية لإدارة المراسم والضيافة',
    status: 'مكتملة',
    startDate: '2026-08-20',
    dueDate: '2026-08-28',
    assignedTo: 'أحمد البشير',
    priority: 'مرتفع',
    project: 'مشروع توريدات اليوم الوطني 96',
    timeSpentHours: 8.0
  },
  {
    id: 'task-3',
    taskName: 'مراجعة وتدقيق جدول الكميات لمنافسة أمانة الرياض',
    status: 'قيد المراجعة',
    startDate: '2026-08-29',
    dueDate: '2026-09-02',
    assignedTo: 'فيصل السليم',
    priority: 'مرتفع',
    timeSpentHours: 4.0
  }
];

class KasEtmadSuiteService {
  private competitions: KasEtmadCompetition[] = [];
  private invoices: KasEtmadInvoice[] = [];
  private estimates: KasEtmadEstimate[] = [];
  private payments: KasEtmadPayment[] = [];
  private creditNotes: KasEtmadCreditNote[] = [];
  private items: KasEtmadItem[] = [];
  private clients: KasEtmadClient[] = [];
  private leads: KasEtmadLead[] = [];
  private projects: KasEtmadProject[] = [];
  private tasks: KasEtmadTask[] = [];
  private contracts: KasEtmadContract[] = [];
  private subscriptions: KasEtmadSubscription[] = [];
  private expenses: KasEtmadExpense[] = [];
  private tickets: KasEtmadTicket[] = [];
  private knowledgeArticles: KasEtmadKnowledgeArticle[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.competitions = parsed.competitions || INITIAL_COMPETITIONS;
        this.invoices = parsed.invoices || INITIAL_INVOICES;
        this.estimates = parsed.estimates || INITIAL_ESTIMATES;
        this.clients = parsed.clients || INITIAL_CLIENTS;
        this.leads = parsed.leads || INITIAL_LEADS;
        this.projects = parsed.projects || INITIAL_PROJECTS;
        this.tasks = parsed.tasks || INITIAL_TASKS;
        this.payments = parsed.payments || [];
        this.creditNotes = parsed.creditNotes || [];
        this.items = parsed.items || [];
        this.contracts = parsed.contracts || [];
        this.subscriptions = parsed.subscriptions || [];
        this.expenses = parsed.expenses || [];
        this.tickets = parsed.tickets || [];
        this.knowledgeArticles = parsed.knowledgeArticles || [];
        return;
      }
    } catch {}

    this.competitions = INITIAL_COMPETITIONS;
    this.invoices = INITIAL_INVOICES;
    this.estimates = INITIAL_ESTIMATES;
    this.clients = INITIAL_CLIENTS;
    this.leads = INITIAL_LEADS;
    this.projects = INITIAL_PROJECTS;
    this.tasks = INITIAL_TASKS;
  }

  private saveToStorage() {
    try {
      const data = {
        competitions: this.competitions,
        invoices: this.invoices,
        estimates: this.estimates,
        payments: this.payments,
        creditNotes: this.creditNotes,
        items: this.items,
        clients: this.clients,
        leads: this.leads,
        projects: this.projects,
        tasks: this.tasks,
        contracts: this.contracts,
        subscriptions: this.subscriptions,
        expenses: this.expenses,
        tickets: this.tickets,
        knowledgeArticles: this.knowledgeArticles
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage quota reached', e);
    }
  }

  // Getters
  public getCompetitions(): KasEtmadCompetition[] { return this.competitions; }
  public getInvoices(): KasEtmadInvoice[] { return this.invoices; }
  public getEstimates(): KasEtmadEstimate[] { return this.estimates; }
  public getPayments(): KasEtmadPayment[] { return this.payments; }
  public getCreditNotes(): KasEtmadCreditNote[] { return this.creditNotes; }
  public getItems(): KasEtmadItem[] { return this.items; }
  public getClients(): KasEtmadClient[] { return this.clients; }
  public getLeads(): KasEtmadLead[] { return this.leads; }
  public getProjects(): KasEtmadProject[] { return this.projects; }
  public getTasks(): KasEtmadTask[] { return this.tasks; }
  public getContracts(): KasEtmadContract[] { return this.contracts; }
  public getSubscriptions(): KasEtmadSubscription[] { return this.subscriptions; }
  public getExpenses(): KasEtmadExpense[] { return this.expenses; }
  public getTickets(): KasEtmadTicket[] { return this.tickets; }
  public getKnowledgeArticles(): KasEtmadKnowledgeArticle[] { return this.knowledgeArticles; }

  // Competitions CRUD
  public addCompetition(item: Omit<KasEtmadCompetition, 'id' | 'seq'>): KasEtmadCompetition {
    const newItem: KasEtmadCompetition = {
      ...item,
      id: `comp-${Date.now()}`,
      seq: this.competitions.length + 1
    };
    this.competitions.unshift(newItem);
    this.saveToStorage();
    return newItem;
  }
  public updateCompetition(id: string, updates: Partial<KasEtmadCompetition>): boolean {
    const idx = this.competitions.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.competitions[idx] = { ...this.competitions[idx], ...updates };
    this.saveToStorage();
    return true;
  }
  public deleteCompetition(id: string): boolean {
    const idx = this.competitions.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.competitions.splice(idx, 1);
    this.saveToStorage();
    return true;
  }

  // Invoices CRUD
  public addInvoice(item: Omit<KasEtmadInvoice, 'id'>): KasEtmadInvoice {
    const newItem: KasEtmadInvoice = {
      ...item,
      id: `inv-${Date.now()}`
    };
    this.invoices.unshift(newItem);
    this.saveToStorage();
    return newItem;
  }
  public updateInvoice(id: string, updates: Partial<KasEtmadInvoice>): boolean {
    const idx = this.invoices.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.invoices[idx] = { ...this.invoices[idx], ...updates };
    this.saveToStorage();
    return true;
  }
  public deleteInvoice(id: string): boolean {
    const idx = this.invoices.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.invoices.splice(idx, 1);
    this.saveToStorage();
    return true;
  }

  // Estimates CRUD
  public addEstimate(item: Omit<KasEtmadEstimate, 'id'>): KasEtmadEstimate {
    const newItem: KasEtmadEstimate = {
      ...item,
      id: `est-${Date.now()}`
    };
    this.estimates.unshift(newItem);
    this.saveToStorage();
    return newItem;
  }
  public updateEstimate(id: string, updates: Partial<KasEtmadEstimate>): boolean {
    const idx = this.estimates.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.estimates[idx] = { ...this.estimates[idx], ...updates };
    this.saveToStorage();
    return true;
  }
  public deleteEstimate(id: string): boolean {
    const idx = this.estimates.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.estimates.splice(idx, 1);
    this.saveToStorage();
    return true;
  }

  // Clients CRUD
  public addClient(item: Omit<KasEtmadClient, 'id'>): KasEtmadClient {
    const newItem: KasEtmadClient = {
      ...item,
      id: `client-${Date.now()}`
    };
    this.clients.unshift(newItem);
    this.saveToStorage();
    return newItem;
  }
  public updateClient(id: string, updates: Partial<KasEtmadClient>): boolean {
    const idx = this.clients.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.clients[idx] = { ...this.clients[idx], ...updates };
    this.saveToStorage();
    return true;
  }
  public deleteClient(id: string): boolean {
    const idx = this.clients.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.clients.splice(idx, 1);
    this.saveToStorage();
    return true;
  }

  // Tasks CRUD
  public addTask(item: Omit<KasEtmadTask, 'id'>): KasEtmadTask {
    const newItem: KasEtmadTask = {
      ...item,
      id: `task-${Date.now()}`
    };
    this.tasks.unshift(newItem);
    this.saveToStorage();
    return newItem;
  }
  public updateTask(id: string, updates: Partial<KasEtmadTask>): boolean {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.tasks[idx] = { ...this.tasks[idx], ...updates };
    this.saveToStorage();
    return true;
  }
  public deleteTask(id: string): boolean {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    this.saveToStorage();
    return true;
  }

  // Projects CRUD
  public addProject(item: Omit<KasEtmadProject, 'id'>): KasEtmadProject {
    const newItem: KasEtmadProject = {
      ...item,
      id: `proj-${Date.now()}`
    };
    this.projects.unshift(newItem);
    this.saveToStorage();
    return newItem;
  }
  public updateProject(id: string, updates: Partial<KasEtmadProject>): boolean {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.projects[idx] = { ...this.projects[idx], ...updates };
    this.saveToStorage();
    return true;
  }
  public deleteProject(id: string): boolean {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.projects.splice(idx, 1);
    this.saveToStorage();
    return true;
  }

  // Leads CRUD
  public addLead(item: Omit<KasEtmadLead, 'id'>): KasEtmadLead {
    const newItem: KasEtmadLead = {
      ...item,
      id: `lead-${Date.now()}`
    };
    this.leads.unshift(newItem);
    this.saveToStorage();
    return newItem;
  }
  public updateLead(id: string, updates: Partial<KasEtmadLead>): boolean {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) return false;
    this.leads[idx] = { ...this.leads[idx], ...updates };
    this.saveToStorage();
    return true;
  }
  public deleteLead(id: string): boolean {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) return false;
    this.leads.splice(idx, 1);
    this.saveToStorage();
    return true;
  }

  // Dashboard Aggregated KPIs
  public getDashboardStats() {
    const totalInvoicesAmount = this.invoices.reduce((sum, i) => sum + i.amount, 0);
    const unpaidAmount = this.invoices.filter(i => i.status === 'غير مدفوع' || i.status === 'متأخر').reduce((sum, i) => sum + i.amount, 0);
    const paidAmount = this.invoices.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
    const totalCompetitions = this.competitions.length;
    const wonCompetitions = this.competitions.filter(c => c.isWinner === 'Yes' || c.status === 'تمت الترسية').length;
    const activeTasks = this.tasks.filter(t => t.status !== 'مكتملة').length;
    const activeProjects = this.projects.filter(p => p.status === 'قيد التقدم').length;
    const totalLeadsValue = this.leads.reduce((sum, l) => sum + l.opportunityValue, 0);

    return {
      totalInvoicesAmount,
      unpaidAmount,
      paidAmount,
      totalCompetitions,
      wonCompetitions,
      winRate: totalCompetitions > 0 ? Math.round((wonCompetitions / totalCompetitions) * 100) : 0,
      activeTasks,
      activeProjects,
      totalLeadsValue,
      totalClients: this.clients.length
    };
  }

  // Export to Excel
  public exportCompetitionsToXLSX() {
    const headers = ['#', 'اسم المنافسة', 'هل هو فائز؟', 'تاريخ الاستحقاق', 'الموعد النهائي', 'تصنيف', 'الجهة الحكومية', 'تاريخ الإنشاء', 'إجمالي البنود', 'الحالة'];
    const rows = this.competitions.map(c => [
      c.seq,
      c.title,
      c.isWinner,
      c.dueDate,
      c.deadlineDate,
      c.category,
      c.governmentEntity,
      c.createdAt,
      c.totalItemsValue,
      c.status
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المنافسات');
    XLSX.writeFile(wb, `KAS_Competitions_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  public exportInvoicesToXLSX() {
    const headers = ['رقم الفاتورة', 'المبلغ', 'إجمالي الضريبة', 'التاريخ', 'العميل', 'المشروع', 'تاريخ الاستحقاق', 'الحالة', 'المدفوع'];
    const rows = this.invoices.map(i => [
      i.invoiceNumber,
      i.amount,
      i.taxAmount,
      i.date,
      i.clientName,
      i.project || '',
      i.dueDate,
      i.status,
      i.paidAmount
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الفواتير');
    XLSX.writeFile(wb, `KAS_Invoices_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}

export const kasEtmadSuiteService = new KasEtmadSuiteService();
