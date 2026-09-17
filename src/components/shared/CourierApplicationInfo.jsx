import { useLanguage } from '@/i18n/LanguageContext';
import Icon from '@/components/ui/Icon';
import { useMasterData } from '@/context/MasterDataContext';

const DOC_ICONS = {
  identity: 'idCard',
  passport: 'passport',
  license: 'file',
  vehicle: 'vehicle',
  photo: 'image',
};

function InfoField({ label, value, dir, fullWidth = false }) {
  return (
    <div className="courier-info-field" style={fullWidth ? { gridColumn: '1 / -1' } : undefined}>
      <small className="muted">{label}</small>
      <div dir={dir}>{value}</div>
    </div>
  );
}

export default function CourierApplicationInfo({ request }) {
  const { t, lang } = useLanguage();
  const { companies } = useMasterData();
  const isAr = lang === 'ar';
  const unavailable = t.notProvided;

  const company = companies.find((item) => item.id === request.companyId);
  const warehouse = company?.warehouses.find((item) => item.id === request.warehouseId);
  const companyName = company ? (isAr ? company.nameAr : company.nameEn) : null;
  const warehouseName = warehouse ? (isAr ? warehouse.nameAr : warehouse.nameEn) : null;

  const documentEntries = [
    ['identity', t.identityDoc],
    ['passport', t.passportDoc],
    ['license', t.license],
    ['vehicle', t.vehicleDoc],
    ['photo', t.personalPhoto],
  ].filter(([id]) => request.documents?.[id]);

  return (
    <div className="courier-info">
      <div className="section-title">
        <Icon name="profile" size={18} />
        <h2>{t.courierInfo}</h2>
      </div>

      <section className="form-grid courier-info-grid" aria-label={t.courierInfo}>
        <InfoField label={t.fullName} value={request.fullName || unavailable} />
        <InfoField label={t.id} value={request.nationalId || unavailable} dir="ltr" />
        <InfoField label={t.dob} value={request.dateOfBirth || unavailable} dir="ltr" />
        <InfoField label={t.nationality} value={request.nationality || unavailable} />
        <InfoField label={t.passportNumber} value={request.passportNumber || unavailable} dir="ltr" />
        <InfoField label={t.phone} value={`+966 ${request.phone || unavailable}`} dir="ltr" />
        <InfoField label={t.city} value={request.city || unavailable} />
        <InfoField label={t.preferredSupervisor} value={request.supervisorName || unavailable} />
        <InfoField
          label={t.vehicleOwnership}
          value={request.hasVehicle ? t.ownVehicle : t.companyVehicle}
        />
        {request.hasVehicle && (
          <>
            <InfoField label={t.plate} value={request.vehiclePlate || unavailable} />
            <InfoField label={t.type} value={request.vehicleType || unavailable} />
          </>
        )}
        <InfoField label={t.bank} value={request.bankName || unavailable} />
        <InfoField label={t.iban} value={request.iban || unavailable} dir="ltr" />
        {companyName && <InfoField label={t.assignedCompany} value={companyName} />}
        {warehouseName && <InfoField label={t.assignedWarehouse} value={warehouseName} />}
        {request.sanadNumber && (
          <InfoField label={t.sanadNumberLabel} value={request.sanadNumber} dir="ltr" />
        )}
        {request.sanadDate && (
          <InfoField label={t.sanadDateLabel} value={request.sanadDate} dir="ltr" />
        )}
        {request.sanadAmount && (
          <InfoField label={t.sanadAmountLabel} value={request.sanadAmount} dir="ltr" />
        )}
      </section>

      <div className="section-title courier-info-section-gap">
        <Icon name="file" size={18} />
        <h2>{t.uploadedDocuments}</h2>
      </div>

      {documentEntries.length ? (
        <div className="doc-gallery">
          {documentEntries.map(([id, label]) => {
            const value = request.documents[id];
            const isData = typeof value === 'string' && value.startsWith('data:');
            const isImage = isData && value.startsWith('data:image');
            const isPdf = isData && value.startsWith('data:application/pdf');
            const isUrl = typeof value === 'string' && /^https?:/i.test(value);
            const href = isData || isUrl ? value : undefined;

            const media = (
              <span className="doc-thumb-media">
                {isImage ? (
                  <img src={value} alt={label} loading="lazy" />
                ) : (
                  <Icon name={isPdf ? 'file' : DOC_ICONS[id] || 'file'} size={20} />
                )}
                {isPdf && <em className="doc-thumb-tag">PDF</em>}
              </span>
            );

            return (
              <figure className="doc-thumb" key={id}>
                {href ? (
                  <a
                    className="doc-thumb-link"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    title={label}
                  >
                    {media}
                  </a>
                ) : (
                  media
                )}
                <figcaption>{label}</figcaption>
              </figure>
            );
          })}
        </div>
      ) : (
        <p className="muted">{unavailable}</p>
      )}
    </div>
  );
}
