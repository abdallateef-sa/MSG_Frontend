import { useLanguage } from '@/i18n/LanguageContext';
import { useMasterData } from '@/context/MasterDataContext';

export default function CompanyWarehouseSelect({
  selectedCompany,
  onSelectCompany,
  selectedWarehouse,
  onSelectWarehouse,
  required = true,
  disabled = false,
}) {
  const { lang, t } = useLanguage();
  const { companies } = useMasterData();

  const currentCompanyObj = companies.find((c) => c.id === selectedCompany);
  const warehouses = currentCompanyObj ? currentCompanyObj.warehouses : [];

  const handleCompanyChange = (e) => {
    const compId = e.target.value;
    onSelectCompany(compId);
    onSelectWarehouse(''); // Reset warehouse when company changes
  };

  return (
    <div className="form-grid" style={{ gridColumn: '1 / -1' }}>
      <label>
        {t.selectCompany || 'اختيار الشركة'}
        <select
          required={required}
          disabled={disabled}
          value={selectedCompany || ''}
          onChange={handleCompanyChange}
        >
          <option value="" disabled>
            {t.chooseCompany || 'اختر الشركة'}
          </option>
          {companies.map((comp) => (
            <option key={comp.id} value={comp.id}>
              {lang === 'ar' ? comp.nameAr : comp.nameEn}
            </option>
          ))}
        </select>
      </label>

      <label>
        {t.selectWarehouse || 'اختيار المخزن / الفرع'}
        <select
          required={required}
          disabled={disabled || !selectedCompany}
          value={selectedWarehouse || ''}
          onChange={(e) => onSelectWarehouse(e.target.value)}
        >
          <option value="" disabled>
            {selectedCompany
              ? t.chooseWarehouse || 'اختر المخزن'
              : t.selectCompanyFirst || 'اختر الشركة أولاً'}
          </option>
          {warehouses.map((wh) => (
            <option key={wh.id} value={wh.id}>
              {lang === 'ar' ? wh.nameAr : wh.nameEn}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
