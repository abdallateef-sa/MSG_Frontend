import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import Icon from '@/components/ui/Icon';

const INITIAL_REQUESTS = [
  {
    id: 'REQ-092',
    title: 'تفويض مركبة',
    titleEn: 'Vehicle Authorization',
    category: 'financial',
    categoryLabelAr: 'مالي',
    categoryLabelEn: 'Financial',
    date: '24 أكتوبر 2026',
    amount: null,
    amountEn: null,
    status: 'approved',
    notes: 'تم اعتماد تفويض سيارة للمندوب.',
    notesEn: 'A vehicle authorization was approved for the courier.',
  },
  {
    id: 'REQ-085',
    title: 'سلفة مالية',
    titleEn: 'Financial Advance',
    category: 'financial',
    categoryLabelAr: 'مالي',
    categoryLabelEn: 'Financial',
    date: 'اليوم',
    amount: '1,000 ر.س',
    amountEn: '1,000 SAR',
    status: 'pending',
    notes: 'طلب سلفة تخصم من مستحقات الشهر القادم.',
    notesEn: 'Advance request to be deducted from next month’s earnings.',
  },
  {
    id: 'REQ-074',
    title: 'صيانة المركبة',
    titleEn: 'Vehicle Maintenance',
    category: 'vehicle',
    categoryLabelAr: 'مركبة',
    categoryLabelEn: 'Vehicle',
    date: '18 أكتوبر 2026',
    amount: null,
    amountEn: null,
    status: 'approved',
    notes: 'تغيير إطارات وفحص الفرامل.',
    notesEn: 'Tire replacement and brake inspection.',
  },
  {
    id: 'REQ-061',
    title: 'طلب إجازة',
    titleEn: 'Leave Request',
    category: 'admin',
    categoryLabelAr: 'إداري',
    categoryLabelEn: 'Administrative',
    date: '12 أكتوبر 2026',
    amount: null,
    amountEn: null,
    status: 'rejected',
    notes: 'تعذر الموافقة بسبب ضغط الطلبات التشغيلية في النطاق.',
    notesEn: 'Declined due to high operational dispatch volumes in the zone.',
  },
];

function option(value, ar, en) {
  return { value, ar, en };
}

function getOperationTypes(isAr) {
  const text = (ar, en) => (isAr ? ar : en);
  const field = (key, label, type = 'text', extra = {}) => ({ key, label, type, ...extra });
  const amount = field('amount', text('المبلغ المطلوب (ر.س)', 'Requested amount (SAR)'), 'number', {
    required: true,
    min: 1,
  });
  const reason = field('reason', text('السبب', 'Reason'), 'textarea', { required: true });

  return {
    financial: [
      {
        key: 'vehicleAuthorization',
        label: text('تفويض مركبة', 'Vehicle Authorization'),
        description: text('طلب تفويض دباب أو سيارة للعمل.', 'Request a motorcycle or car for work.'),
        icon: 'vehicle',
        fields: [
          field('vehicleType', text('نوع المركبة المطلوبة', 'Requested vehicle type'), 'select', {
            required: true,
            options: [option('motorcycle', 'دباب', 'Motorcycle'), option('car', 'سيارة', 'Car')],
          }),
        ],
      },
      {
        key: 'cancelVehicleAuthorization',
        label: text('إلغاء تفويض المركبة', 'Cancel Vehicle Authorization'),
        description: text('إلغاء تفويض مركبة قائم.', 'Cancel an active vehicle authorization.'),
        icon: 'cancelCompensation',
        fields: [
          field('vehiclePhotos', text('صور المركبة', 'Vehicle photos'), 'file', {
            required: true,
            multiple: true,
          }),
          reason,
        ],
      },
      {
        key: 'financialAdvance',
        label: text('سلفة مالية', 'Financial Advance'),
        description: text('طلب سلفة مالية.', 'Request a financial advance.'),
        icon: 'financialAdvance',
        fields: [amount, reason],
      },
      {
        key: 'appAdvance',
        label: text('سلفة بترو آب / Future App', 'PetroApp / Future App Advance'),
        description: text('طلب سلفة مرتبطة بحساب التطبيق.', 'Request an advance tied to an app account.'),
        icon: 'fuelCard',
        fields: [
          amount,
          field('appName', text('اسم التطبيق', 'Application'), 'select', {
            required: true,
            options: [option('petroapp', 'PetroApp', 'PetroApp'), option('future-app', 'Future App', 'Future App')],
          }),
          field('appAccountId', text('رقم / معرف الحساب', 'Account ID'), 'text', {
            required: true,
            dir: 'ltr',
          }),
        ],
      },
      {
        key: 'bankAccountChange',
        label: text('تغيير الحساب البنكي', 'Change Bank Account'),
        description: text('تحديث الحساب البنكي لاستلام المستحقات.', 'Update the bank account used for payments.'),
        icon: 'financialAdvance',
        fields: [
          field('iban', text('رقم الآيبان الجديد', 'New IBAN'), 'text', {
            required: true,
            dir: 'ltr',
            placeholder: 'SA0000000000000000000000',
          }),
          field('bankName', text('اسم البنك', 'Bank name'), 'select', {
            required: true,
            options: [
              option('al-rajhi', 'مصرف الراجحي', 'Al Rajhi Bank'),
              option('riyad', 'بنك الرياض', 'Riyad Bank'),
              option('al-ahli', 'البنك الأهلي السعودي', 'Saudi National Bank'),
            ],
          }),
          field('ibanProof', text('شهادة آيبان أو كشف حساب', 'IBAN certificate or bank statement'), 'file', {
            required: true,
          }),
        ],
      },
      {
        key: 'cancelPromissoryNote',
        label: text('إلغاء سند الأمر', 'Cancel Promissory Note'),
        description: text('طلب إلغاء سند قائم بعد إثبات السداد.', 'Request cancellation of an active note after proof of payment.'),
        icon: 'cancelCompensation',
        fields: [
          field('sanadId', text('السند القائم', 'Active promissory note'), 'select', {
            required: true,
            options: [option('SND-99881', 'SND-99881', 'SND-99881'), option('SND-90124', 'SND-90124', 'SND-90124')],
          }),
          reason,
          field('paymentProof', text('إثبات سداد السلفة', 'Advance payment proof'), 'file', {
            required: true,
          }),
        ],
      },
    ],
    vehicle: [
      {
        key: 'accidentReport',
        label: text('بلاغ حادث', 'Accident Report'),
        description: text('بلاغ حادث أثناء العمل.', 'Report an accident that occurred while working.'),
        icon: 'accidentReport',
        danger: true,
        fields: [
          field('accidentAt', text('تاريخ ووقت الحادث', 'Accident date and time'), 'datetime-local', {
            required: true,
          }),
          field('location', text('موقع الحادث', 'Accident location'), 'text', { required: true }),
          field('description', text('وصف الحادث', 'Accident description'), 'textarea', { required: true }),
          field('accidentPhotoFront', text('صورة الجهة الأمامية', 'Front view photo'), 'file', {
            required: true,
          }),
          field('accidentPhotoBack', text('صورة الجهة الخلفية', 'Rear view photo'), 'file', {
            required: true,
          }),
          field('accidentPhotoLeft', text('صورة الجهة اليسرى', 'Left side photo'), 'file', {
            required: true,
          }),
          field('accidentPhotoRight', text('صورة الجهة اليمنى', 'Right side photo'), 'file', {
            required: true,
          }),
          field('injuries', text('هل يوجد إصابات؟', 'Are there injuries?'), 'radio', {
            required: true,
            options: [option('no', 'لا', 'No'), option('yes', 'نعم', 'Yes')],
          }),
          field('injuryDescription', text('وصف الإصابات', 'Injury description'), 'textarea', {
            required: true,
            showWhen: (values) => values.injuries === 'yes',
          }),
          field('policeReport', text('محضر الشرطة (اختياري)', 'Police report (optional)'), 'file'),
        ],
      },
      {
        key: 'vehicleMaintenance',
        label: text('صيانة المركبة', 'Vehicle Maintenance'),
        description: text('طلب صيانة دورية أو طارئة.', 'Request routine or emergency maintenance.'),
        icon: 'maintenance',
        fields: [
          field('maintenanceType', text('نوع الصيانة', 'Maintenance type'), 'select', {
            required: true,
            options: [option('routine', 'دورية', 'Routine'), option('emergency', 'طارئة', 'Emergency')],
          }),
          field('faultDescription', text('وصف العطل', 'Fault description'), 'textarea', { required: true }),
          field('faultPhotos', text('صور توضح العطل (اختياري)', 'Fault photos (optional)'), 'file', {
            multiple: true,
          }),
          field('maintenanceInvoice', text('فاتورة الصيانة (اختياري)', 'Maintenance invoice (optional)'), 'file'),
          field('workshopName', text('اسم الورشة (اختياري)', 'Workshop name (optional)')),
        ],
      },
      {
        key: 'fuelCardReplacement',
        label: text('بدل فاقد وقود', 'Fuel Card Replacement'),
        description: text('طلب بدل فاقد أو تعويض وقود.', 'Request fuel replacement or compensation.'),
        icon: 'fuelCard',
        fields: [amount],
      },
    ],
    admin: [
      {
        key: 'leaveRequest',
        label: text('إجازة / استئذان', 'Leave / Time Off'),
        description: text('طلب إجازة كاملة أو استئذان.', 'Request a full leave or time off.'),
        icon: 'leave',
        fields: [
          field('leaveType', text('نوع الطلب', 'Request type'), 'select', {
            required: true,
            options: [
              option('full-leave', 'إجازة كاملة', 'Full leave'),
              option('sick-leave', 'إجازة مرضية', 'Sick leave'),
              option('permission', 'استئذان', 'Time off'),
            ],
          }),
          field('startDate', text('تاريخ البداية', 'Start date'), 'date', { required: true }),
          field('endDate', text('تاريخ النهاية', 'End date'), 'date', { required: true }),
          reason,
          field('medicalAttachment', text('مرفق طبي (اختياري، للإجازة المرضية فقط)', 'Medical attachment (optional, for sick leave only)'), 'file', {
            showWhen: (values) => values.leaveType === 'sick-leave',
          }),
        ],
      },
      {
        key: 'zoneChange',
        label: text('تغيير نطاق العمل', 'Change Work Zone'),
        description: text('طلب النقل إلى مدينة أو منطقة أخرى.', 'Request a transfer to another city or zone.'),
        icon: 'zone',
        fields: [
          field('targetCity', text('المنطقة / المدينة المطلوبة', 'Requested city / zone'), 'select', {
            required: true,
            options: [
              option('riyadh', 'الرياض', 'Riyadh'),
              option('jeddah', 'جدة', 'Jeddah'),
              option('dammam', 'الدمام', 'Dammam'),
            ],
          }),
          reason,
        ],
      },
      {
        key: 'uniformRequest',
        label: text('أدوات وزي التوصيل', 'Delivery Tools & Uniform'),
        description: text('طلب شنطة أو خوذة أو زي رسمي.', 'Request a delivery bag, helmet, or uniform.'),
        icon: 'uniform',
        fields: [
          field('itemType', text('نوع الأداة أو الزي', 'Requested item'), 'select', {
            required: true,
            options: [
              option('bag', 'شنطة توصيل', 'Delivery bag'),
              option('helmet', 'خوذة', 'Helmet'),
              option('uniform', 'زي رسمي', 'Uniform'),
            ],
          }),
          field('size', text('المقاس', 'Size'), 'select', {
            required: true,
            showWhen: (values) => values.itemType === 'uniform',
            options: [option('s', 'S', 'S'), option('m', 'M', 'M'), option('l', 'L', 'L'), option('xl', 'XL', 'XL')],
          }),
          field('quantity', text('الكمية', 'Quantity'), 'number', { required: true, min: 1 }),
          field('requestReason', text('السبب', 'Reason'), 'select', {
            required: true,
            options: [option('damaged', 'تالف', 'Damaged'), option('lost', 'فقدان', 'Lost'), option('first-issue', 'أول استلام', 'First issue')],
          }),
        ],
      },
      {
        key: 'resignation',
        label: text('استقالة / إنهاء خدمة', 'Resignation / End of Service'),
        description: text('تقديم طلب استقالة أو إنهاء خدمة.', 'Submit a resignation or end-of-service request.'),
        icon: 'logout',
        fields: [
          field('lastWorkingDay', text('تاريخ آخر يوم عمل', 'Requested last working day'), 'date', { required: true }),
          reason,
        ],
      },
      {
        key: 'documentRenewal',
        label: text('تجديد مستندات منتهية', 'Renew Expired Documents'),
        description: text('إرسال نسخة المستند بعد التجديد.', 'Submit a renewed document copy.'),
        icon: 'profile',
        fields: [
          field('documentType', text('نوع المستند', 'Document type'), 'select', {
            required: true,
            options: [option('id', 'هوية', 'National ID'), option('iqama', 'إقامة', 'Iqama'), option('license', 'رخصة قيادة', 'Driving license')],
          }),
          field('renewedDocument', text('صورة المستند الجديد', 'New document image'), 'file', {
            required: true,
          }),
        ],
      },
      {
        key: 'generalComplaint',
        label: text('شكوى عامة', 'General Complaint'),
        description: text('إرسال شكوى مع التفاصيل والمرفقات.', 'Submit a complaint with details and supporting files.'),
        icon: 'chat',
        fields: [
          field('complaintType', text('نوع الشكوى', 'Complaint type'), 'select', {
            required: true,
            options: [
              option('supervisor', 'ضد مشرف', 'Against supervisor'),
              option('company', 'ضد شركة توصيل', 'Against delivery company'),
              option('customer', 'ضد عميل', 'Against customer'),
              option('other', 'أخرى', 'Other'),
            ],
          }),
          field('description', text('وصف الشكوى', 'Complaint description'), 'textarea', { required: true }),
          field('incidentDate', text('تاريخ الواقعة', 'Incident date'), 'date', { required: true }),
          field('supportingFiles', text('مرفقات داعمة (اختياري)', 'Supporting files (optional)'), 'file', {
            multiple: true,
          }),
        ],
      },
    ],
  };
}

function RequestField({ field, values, attachments, onChange, onFiles, isAr }) {
  const isVisible = !field.showWhen || field.showWhen(values);
  if (!isVisible) return null;

  const requiredMark = field.required ? <span className="field-required">*</span> : null;
  const selectedFiles = attachments[field.key] || [];

  if (field.type === 'file') {
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={field.key}>
          <span>{field.label}</span> {requiredMark}
        </label>
        <input
          id={field.key}
          className="form-input op-file-input"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple={field.multiple}
          required={field.required}
          onChange={(event) => onFiles(field.key, event.target.files)}
        />
        {field.minFiles && <small className="op-file-hint">يجب إرفاق {field.minFiles} صور على الأقل.</small>}
        {selectedFiles.length > 0 && <small className="op-file-hint">{selectedFiles.join(' · ')}</small>}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={field.key}>
          <span>{field.label}</span> {requiredMark}
        </label>
        <div className="form-select-wrapper">
          <select
            id={field.key}
            className="form-select"
            value={values[field.key] || ''}
            required={field.required}
            onChange={(event) => onChange(field.key, event.target.value)}
          >
            <option value="">اختر من القائمة</option>
            {field.options.map((item) => (
              <option key={item.value} value={item.value}>
                {isAr ? item.ar : item.en}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  if (field.type === 'radio') {
    return (
      <fieldset className="form-group op-radio-group">
        <legend className="form-label">
          {field.label} {requiredMark}
        </legend>
        {field.options.map((item) => (
          <label key={item.value}>
            <input
              type="radio"
              name={field.key}
              value={item.value}
              checked={values[field.key] === item.value}
              onChange={(event) => onChange(field.key, event.target.value)}
            />
            {isAr ? item.ar : item.en}
          </label>
        ))}
      </fieldset>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={field.key}>
          <span>{field.label}</span> {requiredMark}
        </label>
        <textarea
          id={field.key}
          className="form-textarea"
          rows={3}
          value={values[field.key] || ''}
          required={field.required}
          onChange={(event) => onChange(field.key, event.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={field.key}>
        <span>{field.label}</span> {requiredMark}
      </label>
      <input
        id={field.key}
        className="form-input"
        type={field.type}
        min={field.min}
        dir={field.dir}
        placeholder={field.placeholder}
        value={values[field.key] || ''}
        required={field.required}
        onChange={(event) => onChange(field.key, event.target.value)}
      />
    </div>
  );
}

export default function Operations() {
  const { t, dir, lang } = useLanguage();
  const isAr = lang === 'ar';
  const typeOptions = useMemo(() => getOperationTypes(isAr), [isAr]);
  const categoryOptions = [
    { key: 'financial', label: t.financialRequests, icon: 'financialAdvance' },
    { key: 'vehicle', label: t.vehicleRequests, icon: 'vehicle' },
    { key: 'admin', label: t.adminRequests, icon: 'operations' },
  ];

  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('financial');
  const [requestType, setRequestType] = useState('vehicleAuthorization');
  const [formValues, setFormValues] = useState({});
  const [attachments, setAttachments] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);

  const currentTypeConfig = typeOptions[selectedCategory]?.find((item) => item.key === requestType);

  const resetRequestForm = () => {
    setFormValues({});
    setAttachments({});
    setFormError('');
  };

  const handleOpenModalWithAction = (category, typeKey) => {
    setSelectedCategory(category);
    setRequestType(typeKey);
    resetRequestForm();
    setIsModalOpen(true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setRequestType(typeOptions[category][0]?.key || '');
    resetRequestForm();
  };

  const handleTypeChange = (typeKey) => {
    setRequestType(typeKey);
    resetRequestForm();
  };

  const handleFieldChange = (key, value) => {
    setFormValues((current) => ({ ...current, [key]: value }));
    setFormError('');
  };

  const handleFilesChange = (key, files) => {
    setAttachments((current) => ({ ...current, [key]: Array.from(files || []).map((file) => file.name) }));
    setFormError('');
  };

  const handleSubmitRequest = (event) => {
    event.preventDefault();
    const missingRequiredField = currentTypeConfig.fields.some((field) => {
      if (!field.required || (field.showWhen && !field.showWhen(formValues))) return false;
      if (field.type === 'file') {
        return (attachments[field.key]?.length || 0) < (field.minFiles || 1);
      }
      return !formValues[field.key];
    });

    if (missingRequiredField) {
      setFormError(isAr ? 'يرجى تعبئة جميع الحقول والمرفقات المطلوبة.' : 'Please complete all required fields and attachments.');
      return;
    }

    const requestId = `REQ-${String(requests.length + 95).padStart(3, '0')}`;
    const categoryLabel = categoryOptions.find((category) => category.key === selectedCategory)?.label;
    const newRequest = {
      id: requestId,
      title: currentTypeConfig.label,
      titleEn: currentTypeConfig.label,
      typeKey: currentTypeConfig.key,
      category: selectedCategory,
      categoryLabelAr: selectedCategory === 'financial' ? 'مالي' : selectedCategory === 'vehicle' ? 'مركبة' : 'إداري',
      categoryLabelEn: selectedCategory === 'financial' ? 'Financial' : selectedCategory === 'vehicle' ? 'Vehicle' : 'Administrative',
      date: isAr ? 'اليوم' : 'Today',
      amount: formValues.amount ? `${formValues.amount} ${isAr ? 'ر.س' : 'SAR'}` : null,
      amountEn: formValues.amount ? `${formValues.amount} SAR` : null,
      status: 'pending',
      notes: currentTypeConfig.description,
      notesEn: currentTypeConfig.description,
      details: formValues,
      attachments,
      categoryLabel,
    };

    setRequests((current) => [newRequest, ...current]);
    setIsModalOpen(false);
    setSuccessMessage(t.requestSubmittedSuccess);
    window.setTimeout(() => setSuccessMessage(''), 4500);
  };

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      request.id.toLowerCase().includes(query) ||
      request.title.toLowerCase().includes(query) ||
      request.notes.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const statCount = (status) => requests.filter((request) => request.status === status).length;

  const selectedType = selectedRequest?.typeKey
    ? typeOptions[selectedRequest.category]?.find((type) => type.key === selectedRequest.typeKey)
    : null;

  const detailFields = selectedRequest?.details
    ? Object.entries(selectedRequest.details).filter(([, value]) => value !== '' && value != null)
    : [];

  const getDetailLabel = (key) => selectedType?.fields.find((field) => field.key === key)?.label || key;

  const getDetailValue = (key, value) => {
    const field = selectedType?.fields.find((item) => item.key === key);
    if (Array.isArray(value)) return value.join(' · ');
    const optionValue = field?.options?.find((optionItem) => optionItem.value === value);
    return optionValue ? (isAr ? optionValue.ar : optionValue.en) : String(value);
  };

  return (
    <div className="operations-page" dir={dir}>
      <AppHeader title={t.operationsAndRequests} variant="dashboard" />

      <main className="operations-main">
        <section className="operations-hero">
          <div className="operations-hero-content">
            <h1>{t.operationsAndRequests}</h1>
            <p>{t.operationsSubtitle}</p>
          </div>
          <button className="operations-new-btn" type="button" onClick={() => handleOpenModalWithAction('financial', 'vehicleAuthorization')}>
            <Icon name="plus" size={18} strokeWidth={2.4} />
            <span>{t.submitNewRequest}</span>
          </button>
        </section>

        {successMessage && (
          <div className="operations-success-banner" role="alert">
            <div className="success-icon-badge"><Icon name="check" size={18} strokeWidth={2.2} /></div>
            <span>{successMessage}</span>
          </div>
        )}

        <section className="operations-stats-grid">
          <div className="op-stat-card"><span className="op-stat-num">{requests.length}</span><span className="op-stat-title">{t.totalRequests}</span></div>
          <div className="op-stat-card warning"><span className="op-stat-num">{statCount('pending')}</span><span className="op-stat-title">{t.inReview}</span></div>
          <div className="op-stat-card success"><span className="op-stat-num">{statCount('approved')}</span><span className="op-stat-title">{t.approvedStatus}</span></div>
          <div className="op-stat-card danger"><span className="op-stat-num">{statCount('rejected')}</span><span className="op-stat-title">{t.rejectedStatus}</span></div>
        </section>

        <section className="operations-categories-section">
          {categoryOptions.map((category) => (
            <div className="op-category-group" key={category.key}>
              <div className="op-cat-header">
                <div className="op-cat-title-wrap">
                  <span className={`op-cat-badge ${category.key}`}><Icon name={category.icon} size={16} /></span>
                  <h3>{category.label}</h3>
                </div>
              </div>
              <div className="op-cards-grid">
                {typeOptions[category.key].map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    className={`op-card${type.danger ? ' danger-card' : ''}`}
                    onClick={() => handleOpenModalWithAction(category.key, type.key)}
                  >
                    <div className={`op-card-icon${type.danger ? ' danger' : ''}`}><Icon name={type.icon} size={24} /></div>
                    <div className="op-card-body"><h4>{type.label}</h4><p>{type.description}</p></div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="operations-history-section">
          <div className="op-history-header">
            <div className="op-history-title-wrap"><h2>{t.allRequests}</h2><span className="op-history-badge">{filteredRequests.length}</span></div>
            <div className="op-status-tabs" role="tablist">
              {[
                ['all', t.allFilter],
                ['pending', t.inReview],
                ['approved', t.approvedStatus],
                ['rejected', t.rejectedStatus],
              ].map(([status, label]) => (
                <button key={status} type="button" role="tab" aria-selected={filterStatus === status} className={`op-tab-btn ${filterStatus === status ? 'active' : ''}`} onClick={() => setFilterStatus(status)}>{label}</button>
              ))}
            </div>
          </div>

          <div className="op-search-bar">
            <Icon name="search" size={18} className="search-icon" />
            <input type="text" className="op-search-input" placeholder={t.searchRequests} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
            {searchQuery && <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')} aria-label="Clear search"><Icon name="close" size={14} /></button>}
          </div>

          <div className="op-requests-list">
            {filteredRequests.length === 0 ? (
              <div className="op-no-results"><Icon name="operations" size={40} /><p>{t.noRequestsFound}</p></div>
            ) : (
                filteredRequests.map((request) => (
                 <button key={request.id} type="button" className="op-request-item" onClick={() => setSelectedRequest(request)} aria-label={`${t.viewRequestDetails}: ${request.id}`}>
                   <div className="op-req-main-info">
                    <div className="op-req-top-line">
                      <h4 className="op-req-title">{request.title}</h4>
                      <span className={`op-req-status-badge ${request.status}`}>{request.status === 'approved' ? t.approvedStatus : request.status === 'rejected' ? t.rejectedStatus : t.inReview}</span>
                    </div>
                    <div className="op-req-meta-line">
                      <span className="op-req-id">{request.id}</span><span className="meta-separator">•</span><span className="op-req-date">{request.date}</span>
                      {request.amount && <><span className="meta-separator">•</span><span className="op-req-amount">{request.amount}</span></>}
                      <span className="meta-separator">•</span><span className={`op-req-cat-tag ${request.category}`}>{isAr ? request.categoryLabelAr : request.categoryLabelEn}</span>
                    </div>
                    {request.notes && <p className="op-req-notes">{request.notes}</p>}
                  </div>
                 </button>
               ))
            )}
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="op-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="op-modal" dir={dir} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="operation-request-title">
            <div className="op-modal-header">
              <div className="op-modal-title-group">
                <div className="op-modal-icon-badge"><Icon name="plus" size={18} strokeWidth={2.4} /></div>
                <div><h3 id="operation-request-title">{currentTypeConfig.label}</h3><p className="op-modal-subtitle">{currentTypeConfig.description}</p></div>
              </div>
              <button type="button" className="op-modal-close" onClick={() => setIsModalOpen(false)} aria-label={t.cancelBtn}><Icon name="close" size={18} /></button>
            </div>

            <form onSubmit={handleSubmitRequest} className="op-modal-form">
              <div className="form-group">
                <label className="form-label"><span>{t.requestCategory}</span></label>
                <div className="op-category-pills">
                  {categoryOptions.map((category) => <button key={category.key} type="button" className={`cat-pill ${selectedCategory === category.key ? 'active' : ''}`} onClick={() => handleCategoryChange(category.key)}><span className="cat-pill-dot" /><span>{category.label}</span></button>)}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="request-type"><span>{t.requestType}</span></label>
                <div className="form-select-wrapper">
                  <select id="request-type" className="form-select" value={requestType} onChange={(event) => handleTypeChange(event.target.value)}>
                    {typeOptions[selectedCategory].map((type) => <option key={type.key} value={type.key}>{type.label}</option>)}
                  </select>
                </div>
              </div>

              {currentTypeConfig.fields.map((field) => <RequestField key={field.key} field={field} values={formValues} attachments={attachments} onChange={handleFieldChange} onFiles={handleFilesChange} isAr={isAr} />)}
              {formError && <p className="op-form-error" role="alert">{formError}</p>}

              <div className="op-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>{t.cancelBtn}</button>
                <button type="submit" className="btn-submit"><Icon name="check" size={16} strokeWidth={2.4} /><span>{t.submitRequestBtn}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedRequest && (
        <div className="op-modal-backdrop" onClick={() => setSelectedRequest(null)}>
          <div
            className="op-modal op-request-details-modal"
            dir={dir}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-details-title"
          >
            <div className="op-modal-header">
              <div className="op-modal-title-group">
                <div className="op-modal-icon-badge"><Icon name="operations" size={18} /></div>
                <div>
                  <h3 id="request-details-title">{t.requestDetails}</h3>
                  <p className="op-modal-subtitle">{selectedRequest.id} · {isAr ? selectedRequest.title : selectedRequest.titleEn}</p>
                </div>
              </div>
              <button type="button" className="op-modal-close" onClick={() => setSelectedRequest(null)} aria-label={t.closeDetails}>
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="op-request-details-content">
              <div className="op-request-details-grid">
                <div className="op-detail-card">
                  <span className="op-detail-label">{t.requestStatusLabel}</span>
                  <span className={`op-req-status-badge ${selectedRequest.status}`}>
                    {selectedRequest.status === 'approved' ? t.approvedStatus : selectedRequest.status === 'rejected' ? t.rejectedStatus : t.inReview}
                  </span>
                </div>
                <div className="op-detail-card"><span className="op-detail-label">{t.requestDate}</span><strong>{selectedRequest.date}</strong></div>
                <div className="op-detail-card"><span className="op-detail-label">{t.requestCategory}</span><strong>{isAr ? selectedRequest.categoryLabelAr : selectedRequest.categoryLabelEn}</strong></div>
                {selectedRequest.amount && <div className="op-detail-card"><span className="op-detail-label">{t.requestAmount}</span><strong className="op-req-amount">{isAr ? selectedRequest.amount : selectedRequest.amountEn}</strong></div>}
              </div>

              {selectedRequest.notes && (
                <section className="op-details-section">
                  <h4>{t.requestNotes}</h4>
                  <p>{isAr ? selectedRequest.notes : selectedRequest.notesEn}</p>
                </section>
              )}

              {detailFields.length > 0 && (
                <section className="op-details-section">
                  <h4>{t.requestData}</h4>
                  <div className="op-request-detail-list">
                    {detailFields.map(([key, value]) => (
                      <div className="op-request-detail-row" key={key}>
                        <span>{getDetailLabel(key)}</span>
                        <strong>{getDetailValue(key, value)}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {Object.values(selectedRequest.attachments || {}).some((files) => files?.length) && (
                <section className="op-details-section">
                  <h4>{t.requestAttachments}</h4>
                  <div className="op-request-detail-list">
                    {Object.entries(selectedRequest.attachments).map(([key, files]) => files?.length > 0 && (
                      <div className="op-request-detail-row" key={key}>
                        <span>{getDetailLabel(key)}</span>
                        <strong>{files.join(' · ')}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav activeTab="operations" />
    </div>
  );
}
