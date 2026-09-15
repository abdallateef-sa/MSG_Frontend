import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';

const STORAGE_KEY = 'msg-courier-shipments';

const SHIPMENT_TYPES = [
  { key: 'ppd', labelKey: 'shipmentPpd' },
  { key: 'cod', labelKey: 'shipmentCod' },
  { key: 'pickup', labelKey: 'shipmentPickup' },
];

const emptyCounts = () => ({
  ppd: { received: '', delivered: '' },
  cod: { received: '', delivered: '' },
  pickup: { received: '', delivered: '' },
});

function getTodayKey() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function readShipments() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function ShipmentTracker() {
  const { t, lang } = useLanguage();
  const todayKey = getTodayKey();
  const [records, setRecords] = useState(readShipments);
  const [counts, setCounts] = useState(() => {
    const today = readShipments().find((record) => record.date === todayKey);
    return today?.counts || emptyCounts();
  });
  const [saved, setSaved] = useState(false);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    [lang],
  );

  const handleChange = (type, field, value) => {
    const numeric = value.replace(/[^\d]/g, '');
    setCounts((current) => ({ ...current, [type]: { ...current[type], [field]: numeric } }));
    setSaved(false);
  };

  const total = (field) =>
    SHIPMENT_TYPES.reduce((sum, { key }) => sum + (Number(counts[key][field]) || 0), 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextRecord = { date: todayKey, counts, updatedAt: new Date().toISOString() };
    const next = [nextRecord, ...records.filter((record) => record.date !== todayKey)].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setRecords(next);
    setSaved(true);
  };

  return (
    <section className="shipment-card">
      <div className="shipment-header">
        <div className="shipment-header-title">
          <span className="shipment-header-icon">
            <Icon name="operations" size={18} />
          </span>
          <div>
            <h2>{t.shipmentLog}</h2>
            <p className="muted">{t.shipmentLogSubtitle}</p>
          </div>
        </div>
        <span className="shipment-date">
          <Icon name="calendar" size={15} />
          {todayLabel}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="shipment-sections">
          {[
            { field: 'received', title: t.shipmentsReceived, icon: 'package' },
            { field: 'delivered', title: t.shipmentsDelivered, icon: 'check' },
          ].map(({ field, title, icon }) => (
            <div className="shipment-block" key={field}>
              <div className="shipment-block-head">
                <span className="shipment-block-icon">
                  <Icon name={icon} size={16} strokeWidth={2} />
                </span>
                <h3>{title}</h3>
                <span className="shipment-block-total">
                  {t.shipmentTotal}: <strong>{total(field)}</strong>
                </span>
              </div>

              <div className="shipment-block-rows">
                {SHIPMENT_TYPES.map(({ key, labelKey }) => (
                  <label className="shipment-field" key={key}>
                    <span className="shipment-field-label">{t[labelKey]}</span>
                    <input
                      className="shipment-input"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      placeholder="0"
                      value={counts[key][field]}
                      aria-label={`${t[labelKey]} - ${title}`}
                      onChange={(event) => handleChange(key, field, event.target.value)}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="shipment-actions">
          <button className="primary-button shipment-save" type="submit">
            <Icon name="check" size={16} strokeWidth={2.4} />
            <span>{t.saveShipments}</span>
          </button>
        </div>
      </form>

      {saved && (
        <p className="shipment-success" role="status">
          <Icon name="check" size={15} strokeWidth={2.4} />
          {t.shipmentsSaved}
        </p>
      )}
    </section>
  );
}
