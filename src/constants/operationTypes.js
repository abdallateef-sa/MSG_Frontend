/**
 * Operational request catalogue: categories, types, and their form fields.
 * Shared by the Operations page (create request) and the request-details modal
 * used in the courier, supervisor, and HR portals.
 */

function option(value, ar, en) {
  return { value, ar, en };
}

export function getOperationTypes(isAr) {
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
