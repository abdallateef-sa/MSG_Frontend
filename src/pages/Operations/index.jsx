import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import Icon from '@/components/ui/Icon';

const INITIAL_REQUESTS = [
  {
    id: 'REQ-092',
    title: 'تعويض مركبة',
    titleEn: 'Vehicle Compensation',
    category: 'financial',
    categoryLabelAr: 'مالي',
    categoryLabelEn: 'Financial',
    date: '24 أكتوبر 2026',
    amount: '450 ر.س',
    amountEn: '450 SAR',
    status: 'approved',
    notes: 'تعويض صيانة وتغيير زيت دوري معتمد.',
    notesEn: 'Periodic oil change and maintenance approved.',
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
    notesEn: 'Advance request to be deducted next month.',
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
    title: 'طلب إجازة / استئذان',
    titleEn: 'Leave / Time Off',
    category: 'admin',
    categoryLabelAr: 'إداري',
    categoryLabelEn: 'Administrative',
    date: '12 أكتوبر 2026',
    amount: null,
    amountEn: null,
    status: 'rejected',
    notes: 'تعذر الموافقة بسبب ضغط الطلبات التشغيلية في النطاق.',
    notesEn: 'Declined due to high operational dispatch volumes in zone.',
  },
];

export default function Operations() {
  const { t, dir, lang } = useLanguage();
  const isAr = lang === 'ar';

  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // New Request Form State
  const [selectedCategory, setSelectedCategory] = useState('financial');
  const [requestType, setRequestType] = useState('vehicleCompensation');
  const [subject, setSubject] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const categoryOptions = [
    { key: 'financial', label: t.financialRequests },
    { key: 'vehicle', label: t.vehicleRequests },
    { key: 'admin', label: t.adminRequests },
  ];

  const typeOptions = {
    financial: [
      { key: 'vehicleCompensation', label: t.vehicleCompensation, requiresAmount: true },
      { key: 'financialAdvance', label: t.financialAdvance, requiresAmount: true },
      { key: 'cancelCompensation', label: t.cancelCompensation, requiresAmount: true },
    ],
    vehicle: [
      { key: 'accidentReport', label: t.accidentReport, requiresAmount: false },
      { key: 'vehicleMaintenance', label: t.vehicleMaintenance, requiresAmount: false },
      { key: 'fuelCardReplacement', label: t.fuelCardReplacement, requiresAmount: false },
    ],
    admin: [
      { key: 'leaveRequest', label: t.leaveRequest, requiresAmount: false },
      { key: 'zoneChange', label: t.zoneChange, requiresAmount: false },
      { key: 'uniformRequest', label: t.uniformRequest, requiresAmount: false },
    ],
  };

  const currentTypeConfig = typeOptions[selectedCategory]?.find((opt) => opt.key === requestType);

  const handleOpenModalWithAction = (cat, typeKey) => {
    setSelectedCategory(cat);
    setRequestType(typeKey);
    setSubject('');
    setAmount('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setRequestType(typeOptions[cat][0]?.key || '');
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();

    const selectedTypeObj = typeOptions[selectedCategory]?.find((o) => o.key === requestType);
    const newReqId = `REQ-0${requests.length + 95}`;

    const newRequest = {
      id: newReqId,
      title: selectedTypeObj?.label || (isAr ? 'طلب تشغيلي' : 'Operational Request'),
      titleEn: selectedTypeObj?.label || 'Operational Request',
      category: selectedCategory,
      categoryLabelAr:
        selectedCategory === 'financial'
          ? 'مالي'
          : selectedCategory === 'vehicle'
            ? 'مركبة'
            : 'إداري',
      categoryLabelEn:
        selectedCategory === 'financial'
          ? 'Financial'
          : selectedCategory === 'vehicle'
            ? 'Vehicle'
            : 'Administrative',
      date: isAr ? 'اليوم' : 'Today',
      amount: amount ? `${amount} ${isAr ? 'ر.س' : 'SAR'}` : null,
      amountEn: amount ? `${amount} SAR` : null,
      status: 'pending',
      notes: notes || subject || (isAr ? 'طلب جديد قيد التدقيق' : 'New request in review'),
      notesEn: notes || subject || 'New request in review',
    };

    setRequests((prev) => [newRequest, ...prev]);
    setIsModalOpen(false);
    setSuccessMessage(t.requestSubmittedSuccess);

    setTimeout(() => {
      setSuccessMessage('');
    }, 4500);
  };

  // Stats calculation
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const searchLower = searchQuery.toLowerCase().trim();
    const titleText = (isAr ? req.title : req.titleEn || req.title).toLowerCase();
    const notesText = (isAr ? req.notes : req.notesEn || req.notes).toLowerCase();
    const matchesSearch =
      !searchLower ||
      req.id.toLowerCase().includes(searchLower) ||
      titleText.includes(searchLower) ||
      notesText.includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="operations-page" dir={dir}>
      <AppHeader title={t.operationsAndRequests} variant="dashboard" />

      <main className="operations-main">
        {/* Banner / Overview Header */}
        <section className="operations-hero">
          <div className="operations-hero-content">
            <h1>{t.operationsAndRequests}</h1>
            <p>{t.operationsSubtitle}</p>
          </div>
          <button
            className="operations-new-btn"
            type="button"
            onClick={() => handleOpenModalWithAction('financial', 'vehicleCompensation')}
          >
            <Icon name="plus" size={18} strokeWidth={2.4} />
            <span>{t.submitNewRequest}</span>
          </button>
        </section>

        {/* Success Alert Toast */}
        {successMessage && (
          <div className="operations-success-banner" role="alert">
            <div className="success-icon-badge">
              <Icon name="check" size={18} strokeWidth={2.2} />
            </div>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Stats Row */}
        <section className="operations-stats-grid">
          <div className="op-stat-card">
            <span className="op-stat-num">{totalCount}</span>
            <span className="op-stat-title">{t.totalRequests}</span>
          </div>
          <div className="op-stat-card warning">
            <span className="op-stat-num">{pendingCount}</span>
            <span className="op-stat-title">{t.inReview}</span>
          </div>
          <div className="op-stat-card success">
            <span className="op-stat-num">{approvedCount}</span>
            <span className="op-stat-title">{t.approvedStatus}</span>
          </div>
          <div className="op-stat-card danger">
            <span className="op-stat-num">{rejectedCount}</span>
            <span className="op-stat-title">{t.rejectedStatus}</span>
          </div>
        </section>

        {/* Categories Sections */}
        <section className="operations-categories-section">
          {/* 1. Financial & Compensation */}
          <div className="op-category-group">
            <div className="op-cat-header">
              <div className="op-cat-title-wrap">
                <span className="op-cat-badge financial">
                  <Icon name="financialAdvance" size={16} />
                </span>
                <h3>{t.financialRequests}</h3>
              </div>
            </div>
            <div className="op-cards-grid">
              <button
                type="button"
                className="op-card"
                onClick={() => handleOpenModalWithAction('financial', 'vehicleCompensation')}
              >
                <div className="op-card-icon">
                  <Icon name="vehicleCompensation" size={24} />
                </div>
                <div className="op-card-body">
                  <h4>{t.vehicleCompensation}</h4>
                  <p>{isAr ? 'طلب تعويض استهلاك أو وقود المركبة' : 'Vehicle allowance claim'}</p>
                </div>
              </button>

              <button
                type="button"
                className="op-card"
                onClick={() => handleOpenModalWithAction('financial', 'financialAdvance')}
              >
                <div className="op-card-icon">
                  <Icon name="financialAdvance" size={24} />
                </div>
                <div className="op-card-body">
                  <h4>{t.financialAdvance}</h4>
                  <p>{isAr ? 'طلب سلفة تخصم من الراتب' : 'Salary advance request'}</p>
                </div>
              </button>

              <button
                type="button"
                className="op-card"
                onClick={() => handleOpenModalWithAction('financial', 'cancelCompensation')}
              >
                <div className="op-card-icon">
                  <Icon name="cancelCompensation" size={24} />
                </div>
                <div className="op-card-body">
                  <h4>{t.cancelCompensation}</h4>
                  <p>{isAr ? 'إلغاء أو تعديل طلب تعويض مالي' : 'Cancel or amend compensation'}</p>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Vehicle & Maintenance */}
          <div className="op-category-group">
            <div className="op-cat-header">
              <div className="op-cat-title-wrap">
                <span className="op-cat-badge vehicle">
                  <Icon name="vehicle" size={16} />
                </span>
                <h3>{t.vehicleRequests}</h3>
              </div>
            </div>
            <div className="op-cards-grid">
              <button
                type="button"
                className="op-card danger-card"
                onClick={() => handleOpenModalWithAction('vehicle', 'accidentReport')}
              >
                <div className="op-card-icon danger">
                  <Icon name="accidentReport" size={24} />
                </div>
                <div className="op-card-body">
                  <h4>{t.accidentReport}</h4>
                  <p>
                    {isAr
                      ? 'بلاغ حادث سير طارئ أثناء التوصيل'
                      : 'Emergency traffic incident report'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                className="op-card"
                onClick={() => handleOpenModalWithAction('vehicle', 'vehicleMaintenance')}
              >
                <div className="op-card-icon">
                  <Icon name="maintenance" size={24} />
                </div>
                <div className="op-card-body">
                  <h4>{t.vehicleMaintenance}</h4>
                  <p>{isAr ? 'صيانة دورية أو إصلاح عطل فني' : 'Routine or technical repair'}</p>
                </div>
              </button>

              <button
                type="button"
                className="op-card"
                onClick={() => handleOpenModalWithAction('vehicle', 'fuelCardReplacement')}
              >
                <div className="op-card-icon">
                  <Icon name="fuelCard" size={24} />
                </div>
                <div className="op-card-body">
                  <h4>{t.fuelCardReplacement}</h4>
                  <p>
                    {isAr ? 'طلب بطاقة بتروأب جديدة أو بدل تالف' : 'PetroApp card issue/re-issue'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Operations & Administrative */}
          <div className="op-category-group">
            <div className="op-cat-header">
              <div className="op-cat-title-wrap">
                <span className="op-cat-badge admin">
                  <Icon name="operations" size={16} />
                </span>
                <h3>{t.adminRequests}</h3>
              </div>
            </div>
            <div className="op-cards-grid">
              <button
                type="button"
                className="op-card"
                onClick={() => handleOpenModalWithAction('admin', 'leaveRequest')}
              >
                <div className="op-card-icon">
                  <Icon name="leave" size={24} />
                </div>
                <div className="op-card-body">
                  <h4>{t.leaveRequest}</h4>
                  <p>{isAr ? 'إجازة اعتيادية أو عذر طارئ' : 'Scheduled or emergency leave'}</p>
                </div>
              </button>

              <button
                type="button"
                className="op-card"
                onClick={() => handleOpenModalWithAction('admin', 'zoneChange')}
              >
                <div className="op-card-icon">
                  <Icon name="zone" size={24} />
                </div>
                <div className="op-card-body">
                  <h4>{t.zoneChange}</h4>
                  <p>{isAr ? 'طلب نقل نطاق العمل أو المستودع' : 'Transfer dispatch zone or hub'}</p>
                </div>
              </button>

              <button
                type="button"
                className="op-card"
                onClick={() => handleOpenModalWithAction('admin', 'uniformRequest')}
              >
                <div className="op-card-icon">
                  <Icon name="uniform" size={24} />
                </div>
                <div className="op-card-body">
                  <h4>{t.uniformRequest}</h4>
                  <p>{isAr ? 'استلام صندوق توصيل، زي، أو خوذة' : 'Request delivery box or gear'}</p>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Requests History & Tracking */}
        <section className="operations-history-section">
          <div className="op-history-header">
            <div className="op-history-title-wrap">
              <h2>{t.allRequests}</h2>
              <span className="op-history-badge">{filteredRequests.length}</span>
            </div>

            {/* Filter Pills */}
            <div className="op-status-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={filterStatus === 'all'}
                className={`op-tab-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                {t.allFilter}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filterStatus === 'pending'}
                className={`op-tab-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                {t.inReview}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filterStatus === 'approved'}
                className={`op-tab-btn ${filterStatus === 'approved' ? 'active' : ''}`}
                onClick={() => setFilterStatus('approved')}
              >
                {t.approvedStatus}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filterStatus === 'rejected'}
                className={`op-tab-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilterStatus('rejected')}
              >
                {t.rejectedStatus}
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="op-search-bar">
            <Icon name="search" size={18} className="search-icon" />
            <input
              type="text"
              className="op-search-input"
              placeholder={t.searchRequests}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>

          {/* List of Requests */}
          <div className="op-requests-list">
            {filteredRequests.length === 0 ? (
              <div className="op-no-results">
                <Icon name="operations" size={40} />
                <p>{t.noRequestsFound}</p>
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div key={req.id} className="op-request-item">
                  <div className="op-req-main-info">
                    <div className="op-req-top-line">
                      <h4 className="op-req-title">
                        {isAr ? req.title : req.titleEn || req.title}
                      </h4>
                      <span className={`op-req-status-badge ${req.status}`}>
                        {req.status === 'approved' && t.approvedStatus}
                        {req.status === 'pending' && t.inReview}
                        {req.status === 'rejected' && t.rejectedStatus}
                      </span>
                    </div>

                    <div className="op-req-meta-line">
                      <span className="op-req-id">{req.id}</span>
                      <span className="meta-separator">•</span>
                      <span className="op-req-date">{req.date}</span>
                      {req.amount && (
                        <>
                          <span className="meta-separator">•</span>
                          <span className="op-req-amount">
                            {isAr ? req.amount : req.amountEn || req.amount}
                          </span>
                        </>
                      )}
                      <span className="meta-separator">•</span>
                      <span className={`op-req-cat-tag ${req.category}`}>
                        {isAr ? req.categoryLabelAr : req.categoryLabelEn}
                      </span>
                    </div>

                    {req.notes && (
                      <p className="op-req-notes">{isAr ? req.notes : req.notesEn || req.notes}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="op-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="op-modal"
            dir={dir}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="op-modal-header">
              <div className="op-modal-title-group">
                <div className="op-modal-icon-badge">
                  <Icon name="plus" size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <h3>{t.submitNewRequest}</h3>
                  <p className="op-modal-subtitle">{t.modalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                className="op-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label={t.cancelBtn}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="op-modal-form">
              {/* Category selector */}
              <div className="form-group">
                <label className="form-label">
                  <span>{t.requestCategory}</span>
                </label>
                <div className="op-category-pills">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      className={`cat-pill ${selectedCategory === cat.key ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat.key)}
                    >
                      <span className="cat-pill-dot" />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Request Type Selector */}
              <div className="form-group">
                <label className="form-label">
                  <span>{t.requestType}</span>
                </label>
                <div className="form-select-wrapper">
                  <select
                    className="form-select"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    required
                  >
                    {typeOptions[selectedCategory]?.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject / Reason */}
              <div className="form-group">
                <label className="form-label">
                  <span>{t.requestSubject}</span>
                  <span className="field-required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t.subjectPlaceholder}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              {/* Amount (if applicable) */}
              {currentTypeConfig?.requiresAmount && (
                <div className="form-group">
                  <label className="form-label">
                    <span>{t.requestAmount}</span>
                    <span className="field-required">*</span>
                  </label>
                  <div className="amount-input-wrapper">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="form-input amount-input"
                      placeholder="350"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    <span className="currency-badge">{t.currencySar}</span>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">
                  <span>{t.requestNotes}</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder={t.notesPlaceholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="op-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  {t.cancelBtn}
                </button>
                <button type="submit" className="btn-submit">
                  <Icon name="check" size={16} strokeWidth={2.4} />
                  <span>{t.submitRequestBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab="operations" />
    </div>
  );
}
