import { useLanguage } from '@/i18n/LanguageContext';

function InfoField({ label, value, dir, fullWidth = false }) {
  return (
    <div style={fullWidth ? { gridColumn: '1 / -1' } : undefined}>
      <small className="muted">{label}:</small>
      <div dir={dir} style={{ fontSize: '13px', wordBreak: 'break-word' }}>
        <b>{value}</b>
      </div>
    </div>
  );
}

export default function CourierApplicationInfo({ request }) {
  const { t } = useLanguage();
  const unavailable = t.notProvided;
  const documentLabels = {
    identity: t.identityDoc,
    passport: t.passportDoc,
    license: t.license,
    vehicle: t.vehicleDoc,
    photo: t.personalPhoto,
  };
  const uploadedDocuments = Object.entries(request.documents || {})
    .filter(([, uploaded]) => uploaded)
    .map(([id]) => documentLabels[id])
    .filter(Boolean);

  return (
    <section
      className="form-grid"
      aria-label={t.courierInfo}
      style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}
    >
      <InfoField label={t.fullName} value={request.fullName || unavailable} />
      <InfoField label={t.id} value={request.nationalId || unavailable} dir="ltr" />
      <InfoField label={t.dob} value={request.dateOfBirth || unavailable} dir="ltr" />
      <InfoField label={t.nationality} value={request.nationality || unavailable} />
      {request.passportNumber && (
        <InfoField label={t.passportNumber} value={request.passportNumber} dir="ltr" />
      )}
      <InfoField label={t.phone} value={`+966 ${request.phone || unavailable}`} dir="ltr" />
      <InfoField label={t.city} value={request.city || unavailable} />
      <InfoField label={t.preferredSupervisor} value={request.supervisorName || unavailable} />
      <InfoField label={t.vehicleOwnership} value={request.hasVehicle ? t.ownVehicle : t.companyVehicle} />
      {request.hasVehicle && (
        <>
          <InfoField label={t.plate} value={request.vehiclePlate || unavailable} />
          <InfoField label={t.type} value={request.vehicleType || unavailable} />
        </>
      )}
      <InfoField label={t.bank} value={request.bankName || unavailable} />
      <InfoField label={t.iban} value={request.iban || unavailable} dir="ltr" />
      <InfoField
        fullWidth
        label={t.uploadedDocuments}
        value={uploadedDocuments.length ? uploadedDocuments.join(' · ') : unavailable}
      />
    </section>
  );
}
