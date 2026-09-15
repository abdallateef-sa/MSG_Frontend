import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useOperations } from '@/context/OperationsContext';
import { OPERATION_STATUS, isOperationPending } from '@/constants/requestStatus';
import { getOperationTypes } from '@/constants/operationTypes';
import AppHeader from '@/components/shared/AppHeader';
import PortalBottomNav from '@/components/shared/PortalBottomNav';
import OperationRequestCard from '@/components/shared/OperationRequestCard';
import OperationRequestDetailsModal from '@/components/shared/OperationRequestDetailsModal';
import Icon from '@/components/ui/Icon';

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

  const location = useLocation();
  const preset = location.state?.openRequest;
  const presetId = location.state?.openRequestId;

  const { user } = useAuth();
  const { requests, addRequest } = useOperations();

  // Supervisors only see their own operational requests here; their couriers'
  // requests are handled in the supervisor review screen.
  const visibleRequests =
    user.role === 'supervisor'
      ? requests.filter(
          (request) =>
            request.requesterRole === 'supervisor' && request.supervisorId === user.id,
        )
      : requests;

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(Boolean(preset));
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(preset?.category || 'financial');
  const [requestType, setRequestType] = useState(preset?.type || 'vehicleAuthorization');
  const [formValues, setFormValues] = useState({});
  const [attachments, setAttachments] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(
    () => requests.find((item) => item.id === presetId) || null,
  );

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
      status:
        user.role === 'supervisor'
          ? OPERATION_STATUS.PENDING_HR
          : OPERATION_STATUS.PENDING_SUPERVISOR,
      notes: currentTypeConfig.description,
      notesEn: currentTypeConfig.description,
      details: formValues,
      attachments,
      categoryLabel,
      requesterRole: user.role,
      supervisorId: user.role === 'supervisor' ? user.id : user.supervisorId,
    };

    addRequest(newRequest);
    setIsModalOpen(false);
    setSuccessMessage(t.requestSubmittedSuccess);
    window.setTimeout(() => setSuccessMessage(''), 4500);
  };

  const filteredRequests = visibleRequests.filter((request) => {
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'pending' ? isOperationPending(request.status) : request.status === filterStatus);
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      request.id.toLowerCase().includes(query) ||
      request.title.toLowerCase().includes(query) ||
      request.notes.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const statCount = (status) =>
    visibleRequests.filter((request) =>
      status === 'pending' ? isOperationPending(request.status) : request.status === status,
    ).length;

  return (
    <div className="operations-page" dir={dir}>
      <AppHeader
        title={t.operationsAndRequests}
        variant={user.role === 'supervisor' ? 'supervisor' : 'dashboard'}
      />

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
          <div className="op-stat-card"><span className="op-stat-num">{visibleRequests.length}</span><span className="op-stat-title">{t.totalRequests}</span></div>
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
                <OperationRequestCard
                  key={request.id}
                  request={request}
                  onClick={() => setSelectedRequest(request)}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {isModalOpen && currentTypeConfig && (
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
        <OperationRequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      <PortalBottomNav activeTab="operations" />
    </div>
  );
}
