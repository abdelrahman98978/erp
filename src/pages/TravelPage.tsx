import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useCompany } from '../contexts/CompanyContext';
import { realErpDataStore } from '../services/realErpDataStore';
import { useAppStore } from '../stores/appStore';
import { Plane, Plus, FileSpreadsheet, Search, X, Check, CheckCircle, Trash2 } from 'lucide-react';

export interface FlightRecord {
  id: string;
  travel_type: 'وصول' | 'ترحيل' | 'داخلي';
  client_name: string;
  maid_name: string;
  nationality: string;
  passport_number: string;
  airline: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  flight_date: string;
  flight_time: string;
  ticket_number: string;
  driver_assigned?: string;
  status: 'مؤكد ومجدول' | 'في الجو' | 'تم الوصول والاستقبال' | 'تم التسليم للإيواء' | 'تم التسليم للعميل' | 'ملغي';
}

const MOCK_FLIGHTS: FlightRecord[] = [
  {
    id: 'FL-801',
    travel_type: 'وصول',
    client_name: 'بندر صالح الهويريني',
    maid_name: 'MARIA SANTOS CORTEZ',
    nationality: 'الفلبين',
    passport_number: 'P9982710B',
    airline: 'الخطوط السعودية (SAUDIA)',
    flight_number: 'SV-861',
    departure_airport: 'مطار نينوي أكينو مانيلا (MNL)',
    arrival_airport: 'مطار الملك خالد الدولي - الرياض (RUH)',
    flight_date: '2026-08-18',
    flight_time: '14:30',
    ticket_number: '065-992837411',
    driver_assigned: 'محمد السائق (مركبة رقم 12)',
    status: 'مؤكد ومجدول',
  },
  {
    id: 'FL-802',
    travel_type: 'وصول',
    client_name: 'سارة خالد الدوسري',
    maid_name: 'ALEMITU BEKELE',
    nationality: 'إثيوبيا',
    passport_number: 'EP8829104',
    airline: 'الخطوط الإثيوبية (Ethiopian Airlines)',
    flight_number: 'ET-402',
    departure_airport: 'مطار بولي الدولي أديس أبابا (ADD)',
    arrival_airport: 'مطار الملك عبدالعزيز الدولي - جدة (JED)',
    flight_date: '2026-08-17',
    flight_time: '09:15',
    ticket_number: '071-884729103',
    driver_assigned: 'أحمد السائق (مركبة رقم 5)',
    status: 'تم الوصول والاستقبال',
  },
  {
    id: 'FL-803',
    travel_type: 'ترحيل',
    client_name: 'شركة دار الرواد',
    maid_name: 'FLORENCE NABATANZI',
    nationality: 'أوغندا',
    passport_number: 'UG1102938',
    airline: 'طيران ناس (Flynas)',
    flight_number: 'XY-220',
    departure_airport: 'مطار الملك فهد بالدمام (DMM)',
    arrival_airport: 'مطار عنتيبي الدولي (EBB)',
    flight_date: '2026-08-19',
    flight_time: '23:45',
    ticket_number: '065-119283745',
    driver_assigned: 'خالد السائق (فريق الترحيل)',
    status: 'مؤكد ومجدول',
  },
];

export const TravelPage: React.FC = () => {
  const { activeCompany } = useCompany();
  const { addNotification } = useAppStore();
  const [flights, setFlights] = useState<FlightRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'arrivals' | 'deportations'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    realErpDataStore.getRecords<FlightRecord>('flights', MOCK_FLIGHTS).then(data => {
      setFlights(data);
    });
  }, []);

  // Form State
  const [travelType, setTravelType] = useState<'وصول' | 'ترحيل'>('وصول');
  const [clientName, setClientName] = useState('');
  const [maidName, setMaidName] = useState('');
  const [nationality, setNationality] = useState('الفلبين');
  const [passportNumber, setPassportNumber] = useState('');
  const [airline, setAirline] = useState('الخطوط السعودية (SAUDIA)');
  const [flightNumber, setFlightNumber] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('مطار الملك خالد الدولي - الرياض (RUH)');
  const [flightDate, setFlightDate] = useState(new Date().toISOString().slice(0, 10));
  const [flightTime, setFlightTime] = useState('12:00');
  const [ticketNumber, setTicketNumber] = useState('');

  const handleAddFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maidName || !flightNumber) return;

    const newFlight: FlightRecord = {
      id: `FL-${800 + flights.length + 1}`,
      travel_type: travelType,
      client_name: clientName || 'حساب المجموعة',
      maid_name: maidName,
      nationality,
      passport_number: passportNumber || 'PH992810',
      airline,
      flight_number: flightNumber,
      departure_airport: travelType === 'وصول' ? 'مطار بلد المصدر' : 'مطار المملكة',
      arrival_airport: arrivalAirport,
      flight_date: flightDate,
      flight_time: flightTime,
      ticket_number: ticketNumber || '065-000000000',
      driver_assigned: 'بانتظار الإسناد',
      status: 'مؤكد ومجدول',
    };

    await realErpDataStore.addRecord('flights', newFlight);
    setFlights([newFlight, ...flights]);
    addNotification({
      title: 'جدولة رحلة طيران جديدة',
      message: `تمت جدولة رحلة العاملة (${maidName}) برقم الرحلة ${flightNumber} بنجاح.`,
      type: 'success',
    });
    setShowAddModal(false);
    setMaidName('');
    setFlightNumber('');
  };

  const handleUpdateStatus = async (flight: FlightRecord, newStatus: FlightRecord['status']) => {
    const updated = { ...flight, status: newStatus };
    await realErpDataStore.updateRecord<FlightRecord>('flights', flight.id, { status: newStatus });
    setFlights(flights.map(f => f.id === flight.id ? updated : f));
    addNotification({
      title: 'تحديث حالة الرحلة',
      message: `تم تحديث حالة رحلة العاملة (${flight.maid_name}) إلى (${newStatus}).`,
      type: 'info',
    });
  };

  const handleDeleteFlight = async (flight: FlightRecord) => {
    if (window.confirm(`هل أنت متأكد من حذف جدول رحلة (${flight.maid_name})؟`)) {
      await realErpDataStore.deleteRecord('flights', flight.id);
      setFlights(flights.filter(f => f.id !== flight.id));
      addNotification({
        title: 'حذف الرحلة',
        message: `تم حذف الرحلة #${flight.id} بنجاح.`,
        type: 'error',
      });
    }
  };

  const getFilteredFlights = () => {
    return flights.filter((f) => {
      const matchesSearch =
        f.maid_name.includes(searchQuery) ||
        f.client_name.includes(searchQuery) ||
        f.flight_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.passport_number.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'arrivals') return f.travel_type === 'وصول';
      if (activeTab === 'deportations') return f.travel_type === 'ترحيل';

      return true;
    });
  };

  const currentDisplayList = getFilteredFlights();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>TRAVEL & FLIGHTS HUB</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              إدارة اللوجستيات وحجوزات الطيران
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              متابعة رحلات وصول العمالة الجديدة، رحلات الترحيل، وإسناد فرق وسائقي الاستقبال بالمطارات لـ {activeCompany.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="button-white-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>+ جدولة رحلة طيران</span>
          </button>

          <button
            onClick={() => exportData('travel_flights', currentDisplayList, 'excel', `رحلات الطيران - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-600" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'all', label: `جميع الرحلات (${flights.length})` },
          { id: 'arrivals', label: 'رحلات الوصول (Arrivals)' },
          { id: 'deportations', label: 'رحلات الترحيل (Deportation)' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isActive ? '#000000' : '#e4e4e7',
                backgroundColor: isActive ? '#000000' : '#ffffff',
                color: isActive ? '#ffffff' : '#27272a',
                fontWeight: isActive ? 550 : 420,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Flights Table */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="البحث برقم الرحلة، اسم العاملة، أو الجواز..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-input"
              style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
            />
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
            العدد المعروض: {currentDisplayList.length} رحلة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">#</th>
                <th className="p-3.5">نوع الرحلة</th>
                <th className="p-3.5">بيانات العاملة</th>
                <th className="p-3.5">العميل</th>
                <th className="p-3.5">شركة الطيران ورقم الرحلة</th>
                <th className="p-3.5">مطار الوصول</th>
                <th className="p-3.5">تاريخ وتوقيت الرحلة</th>
                <th className="p-3.5">سائق الاستقبال</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {currentDisplayList.map((f) => (
                <tr key={f.id} className="hover:bg-zinc-50">
                  <td className="p-3.5 font-mono font-bold text-black">{f.id}</td>
                  <td className="p-3.5">
                    <Badge text={f.travel_type} type={f.travel_type === 'وصول' ? 'success' : 'danger'} />
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-black">{f.maid_name}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{f.nationality} • {f.passport_number}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-black">{f.client_name}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-black">{f.airline}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{f.flight_number}</div>
                  </td>
                  <td className="p-3.5 text-zinc-600">{f.arrival_airport}</td>
                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-black">{f.flight_date}</div>
                    <div className="text-zinc-500">{f.flight_time}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-black">{f.driver_assigned || 'غير مسند'}</td>
                  <td className="p-3.5">
                    <Badge text={f.status} type={f.status.includes('تم') ? 'success' : 'purple'} />
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {f.status !== 'تم الوصول والاستقبال' && (
                        <button
                          onClick={() => handleUpdateStatus(f, 'تم الوصول والاستقبال')}
                          className="button-primary-pill"
                          style={{ padding: '2px 8px', fontSize: '10.5px', minHeight: '26px' }}
                          title="تأكيد الاستقبال"
                        >
                          <Check className="w-3 h-3 ml-1" />
                          <span>استقبال</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteFlight(f)}
                        className="p-1 rounded-full hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors"
                        title="حذف الرحلة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Flight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in dir-rtl text-right">
          <div className="w-full max-w-xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plane className="w-4 h-4 text-emerald-400" />
                <span>جدولة رحلة طيران جديدة (Logistics Form)</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFlight} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-white text-black">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">نوع الرحلة *</label>
                  <select
                    value={travelType}
                    onChange={(e) => setTravelType(e.target.value as any)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option value="وصول">رحلة وصول إلى المملكة</option>
                    <option value="ترحيل">رحلة ترحيل ومغادرة</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">اسم العاملة *</label>
                  <input
                    type="text"
                    required
                    value={maidName}
                    onChange={(e) => setMaidName(e.target.value)}
                    placeholder="اسم العاملة بالجواز"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">شركة الطيران *</label>
                  <select
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option>الخطوط السعودية (SAUDIA)</option>
                    <option>الخطوط الإثيوبية (Ethiopian)</option>
                    <option>الخطوط الفلبينية (Philippine Airlines)</option>
                    <option>طيران ناس (Flynas)</option>
                    <option>طيران الإمارات (Emirates)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">رقم الرحلة *</label>
                  <input
                    type="text"
                    required
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="SV-861"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">تاريخ الرحلة *</label>
                  <input
                    type="date"
                    required
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">توقيت الوصول *</label>
                  <input
                    type="time"
                    required
                    value={flightTime}
                    onChange={(e) => setFlightTime(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-700 block mb-1 font-semibold">مطار الوصول بالمملكة *</label>
                <select
                  value={arrivalAirport}
                  onChange={(e) => setArrivalAirport(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option>مطار الملك خالد الدولي - الرياض (RUH)</option>
                  <option>مطار الملك عبدالعزيز الدولي - جدة (JED)</option>
                  <option>مطار الملك فهد الدولي - الدمام (DMM)</option>
                  <option>مطار الأمير محمد بن عبدالعزيز - المدينة (MED)</option>
                  <option>مطار أبها الإقليمي (AHB)</option>
                </select>
              </div>

              <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3 -mx-6 -mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="button-outline-on-light"
                  style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}
                >
                  حفظ وجدولة الرحلة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPage;
