import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useCompany } from '../contexts/CompanyContext';

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
  const [flights, setFlights] = useState<FlightRecord[]>(MOCK_FLIGHTS);
  const [activeTab, setActiveTab] = useState<'all' | 'arrivals' | 'deportations'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleAddFlight = (e: React.FormEvent) => {
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

    setFlights([newFlight, ...flights]);
    setShowAddModal(false);
    setMaidName('');
    setFlightNumber('');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-plane-departure text-blue-600"></i>
            إدارة اللوجستيات وحجوزات الطيران (Travel & Flights Hub)
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B' }}>
            متابعة رحلات وصول العمالة الجديدة، رحلات الترحيل، وإسناد فرق وسائقي الاستقبال بالمطارات
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#005154',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 81, 84, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="fa-solid fa-plus text-xs"></i>
            جدولة رحلة طيران جديدة
          </button>

          <button
            onClick={() => exportData('travel_flights', currentDisplayList, 'excel', `رحلات الطيران - ${activeCompany.name}`)}
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
        {[
          { id: 'all', label: `جميع الرحلات (${flights.length})`, icon: 'fa-folder-open' },
          { id: 'arrivals', label: 'رحلات الوصول (Arrivals)', icon: 'fa-plane-arrival' },
          { id: 'deportations', label: 'رحلات الترحيل (Deportation)', icon: 'fa-plane-departure' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isActive ? '#005154' : '#E2E8F0',
                backgroundColor: isActive ? '#005154' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#334155',
                fontWeight: isActive ? '800' : '600',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <i className={`fa-solid ${tab.icon}`} style={{ fontSize: '11px' }}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Flights Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="البحث برقم الرحلة، اسم العاملة، أو الجواز..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', width: '320px' }}
          />
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>
            العدد المعروض: {currentDisplayList.length} رحلة
          </span>
        </div>

        <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>نوع الرحلة</th>
              <th>بيانات العاملة</th>
              <th>العميل</th>
              <th>شركة الطيران ورقم الرحلة</th>
              <th>مطار الوصول</th>
              <th>تاريخ وتوقيت الرحلة</th>
              <th>سائق الاستقبال</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {currentDisplayList.map((f) => (
              <tr key={f.id}>
                <td><strong style={{ color: '#005154' }}>{f.id}</strong></td>
                <td><Badge text={f.travel_type} type={f.travel_type === 'وصول' ? 'success' : 'danger'} /></td>
                <td>
                  <div style={{ fontWeight: '800', color: '#0F172A' }}>{f.maid_name}</div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'monospace' }}>{f.nationality} • {f.passport_number}</div>
                </td>
                <td><span style={{ fontWeight: '700' }}>{f.client_name}</span></td>
                <td>
                  <div style={{ fontWeight: '800', color: '#1E3A8A' }}>{f.airline}</div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'monospace' }}>{f.flight_number}</div>
                </td>
                <td><span style={{ fontSize: '11px' }}>{f.arrival_airport}</span></td>
                <td>
                  <strong style={{ color: '#D97706' }}>{f.flight_date}</strong>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>{f.flight_time}</div>
                </td>
                <td><span style={{ fontSize: '11px', color: '#005154', fontWeight: '700' }}>{f.driver_assigned || 'غير مسند'}</span></td>
                <td><Badge text={f.status} type={f.status.includes('تم') ? 'success' : 'purple'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Flight Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '640px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
              جدولة رحلة طيران جديدة (ClickERP Logistics)
            </h3>

            <form onSubmit={handleAddFlight}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>نوع الرحلة *</label>
                  <select value={travelType} onChange={(e) => setTravelType(e.target.value as any)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}>
                    <option value="وصول">رحلة وصول إلى المملكة</option>
                    <option value="ترحيل">رحلة ترحيل ومغادرة</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>اسم العاملة *</label>
                  <input type="text" required value={maidName} onChange={(e) => setMaidName(e.target.value)} placeholder="اسم العاملة بالجواز" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>شركة الطيران *</label>
                  <select value={airline} onChange={(e) => setAirline(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}>
                    <option>الخطوط السعودية (SAUDIA)</option>
                    <option>الخطوط الإثيوبية (Ethiopian)</option>
                    <option>الخطوط الفلبينية (Philippine Airlines)</option>
                    <option>طيران ناس (Flynas)</option>
                    <option>طيران الإمارات (Emirates)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>رقم الرحلة *</label>
                  <input type="text" required value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} placeholder="SV-861" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>تاريخ الرحلة *</label>
                  <input type="date" required value={flightDate} onChange={(e) => setFlightDate(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>توقيت الوصول *</label>
                  <input type="time" required value={flightTime} onChange={(e) => setFlightTime(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>مطار الوصول بالمملكة *</label>
                <select value={arrivalAirport} onChange={(e) => setArrivalAirport(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}>
                  <option>مطار الملك خالد الدولي - الرياض (RUH)</option>
                  <option>مطار الملك عبدالعزيز الدولي - جدة (JED)</option>
                  <option>مطار الملك فهد الدولي - الدمام (DMM)</option>
                  <option>مطار الأمير محمد بن عبدالعزيز - المدينة (MED)</option>
                  <option>مطار أبها الإقليمي (AHB)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#005154', color: '#FFFFFF', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}
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
