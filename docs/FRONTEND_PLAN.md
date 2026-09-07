# خطة تنفيذ الفرونت اند: تدفق تسجيل المندوب (Supervisor → HR → سند → أبشر → عقد)

> نسخة محدّثة تدمج الخطة الأصلية مع تعديل مرحلة "السند وموافقة أبشر" بعد توضيح إنها عملية يدوية بالكامل بدون أي تكامل API خارجي.

---

## جدول المحتويات

1. [نظرة عامة على التدفق الجديد](#1-نظرة-عامة-على-التدفق-الجديد)
2. [ملاحظة أساسية قبل البدء](#2-ملاحظة-أساسية-قبل-البدء)
3. [المرحلة 1: تعديل فورم التسجيل](#3-المرحلة-1-تعديل-فورم-التسجيل)
4. [المرحلة 2: تحديث صفحة حالة الطلب](#4-المرحلة-2-تحديث-صفحة-حالة-الطلب)
5. [المرحلة 3: شاشة المشرف](#5-المرحلة-3-شاشة-المشرف)
6. [المرحلة 4: شاشة HR](#6-المرحلة-4-شاشة-hr)
7. [المرحلة 5: مرحلة السند وموافقة أبشر (محدّثة)](#7-المرحلة-5-مرحلة-السند-وموافقة-أبشر-محدثة)
8. [المرحلة 6: العقد](#8-المرحلة-6-العقد)
9. [ترتيب التنفيذ المقترح](#9-ترتيب-التنفيذ-المقترح)
10. [ملفات جديدة - ملخص سريع](#10-ملفات-جديدة---ملخص-سريع)

---

## 1. نظرة عامة على التدفق الجديد

```
المندوب يسجل (+ يجاوب: معاه سيارة؟)
        │
        ▼
   مراجعة المشرف ── رفض ──► CANCELLED (سبب: رفض المشرف)
        │
     موافقة (+ اختيار شركة/مخزن)
        │
        ▼
   مراجعة HR (يدخل بيانات المندوب في سند يدويًا)
        │
   HR يضغط "تم الإرسال لأبشر"
        │
        ▼
   بانتظار قرار المندوب في تطبيق أبشر
   (المندوب بيوافق/يرفض من جوه أبشر — بره نظامنا تمامًا)
        │
   HR يسجل النتيجة يدويًا في النظام
        │
        ├── وافق ──► يظهر للمندوب العقد (نوعين: مع/بدون سيارة) ──► ACTIVE
        │
        └── رفض  ──► CANCELLED (سبب: رفض أبشر)
```

---

## 2. ملاحظة أساسية قبل البدء

المشروع حاليًا **UI prototype بحت** (زي ما هو موثق في `ARCHITECTURE.md` قسم 9):
- مفيش backend ولا API فعلي
- مفيش state مشترك بين خطوات التسجيل (كل صفحة `useState` لوحدها)
- مفيش auth حقيقي (الدخول وهمي)

قبل إضافة الشاشات الجديدة، لازم نحل نقطتين بأسلوب متسق مع باقي المشروع (mock data + placeholders واضحة، بالظبط زي `MOCK_APP_NUMBER` الموجود):

1. **حفظ بيانات التسجيل بين الخطوات** (خصوصًا `hasVehicle`) → عن طريق Context بسيط جديد
2. **تمييز الشاشات الجديدة (مشرف/HR)** → routes منفصلة بدون auth حقيقي دلوقتي، بنفس فلسفة الصفحة الحالية، هيتم ربطها بصلاحيات فعلية وقت ربط الـ backend

> **مهم:** مرحلة السند وأبشر **مفيهاش أي تكامل API خارجي** — كل الأزرار والحالات في الفرونت بتتغير بفعل يدوي من HR فقط. راجع ملف `BACKEND_SANAD_ABSHER.md` لتفاصيل الـ endpoints المطلوبة من الباك اند لدعم هذا الفعل اليدوي.

---

## 3. المرحلة 1: تعديل فورم التسجيل

**الهدف:** إضافة سؤال "معاك سيارة؟" وربطه بمنطق إظهار/إخفاء حقول المركبة.

### الملفات المتأثرة

| الملف | التعديل |
|---|---|
| `src/i18n/copy.js` | إضافة مفاتيح `hasVehicle`, `yes`, `no` في `ar` و `en` |
| `src/pages/PersonalInfo/index.jsx` | إضافة radio/select لـ `hasVehicle` وحفظه في الـ context |
| `src/context/OnboardingContext.jsx` **(جديد)** | context بسيط يمسك بيانات كل خطوات التسجيل |
| `src/pages/VehicleBank/index.jsx` | قراءة `hasVehicle`؛ لو `false` يخفي قسم "المركبة" ويسيب "البنك" بس |
| `src/main.jsx` | لف `<App />` بـ `<OnboardingProvider>` بعد `LanguageProvider` |

### شكل الـ Context المقترح

```js
// src/context/OnboardingContext.jsx
const OnboardingContext = createContext(null);

// الشكل:
// {
//   personal: {},
//   vehicleBank: {},
//   hasVehicle: null,   // true | false | null
//   documents: {},
// }

// الدوال:
// updatePersonal(data)
// updateVehicleBank(data)
// setHasVehicle(bool)
```

---

## 4. المرحلة 2: تحديث صفحة حالة الطلب

**الهدف:** استبدال الـ `stages` المتحرقة (hard-coded) في `CourierStatus` بمنطق حالات ديناميكي يعكس الـ workflow الجديد بالكامل.

### ملف جديد: `src/constants/requestStatus.js`

```js
export const REQUEST_STATUS = {
  PENDING_SUPERVISOR: 'pending_supervisor',
  PENDING_HR: 'pending_hr',
  PENDING_ABSHER: 'pending_absher',   // جديدة
  PENDING_CONTRACT: 'pending_contract',
  ACTIVE: 'active',
  CANCELLED: 'cancelled',             // موحّدة لكل أنواع الإلغاء
};

export const CANCEL_REASON = {
  SUPERVISOR_REJECTED: 'supervisor_rejected',
  ABSHER_REJECTED: 'absher_rejected',
};
```

> **تعديل عن الخطة الأصلية:** بدل حالة منفصلة `REJECTED_SUPERVISOR`، وحّدنا كل أنواع الرفض تحت `CANCELLED` + حقل `cancelReason` يوضح السبب. ده بيبسّط منطق العرض (كارت رفض واحد بنص متغيّر) بدل تكرار الـ UI لكل نوع رفض.

### التعديلات

| الملف | التعديل |
|---|---|
| `src/i18n/copy.js` | مفاتيح جديدة لكل حالة (نص + hint)، ومفاتيح رسائل الإلغاء لكل سبب |
| `src/pages/CourierStatus/index.jsx` | دالة `getStageIndex(status)` + عرض شرطي لكارت الإلغاء بناءً على `cancelReason` |

---

## 5. المرحلة 3: شاشة المشرف

### Routes جديدة (`constants/routes.js`)

```js
SUPERVISOR_REQUESTS: '/supervisor/requests',
SUPERVISOR_REQUEST_DETAIL: '/supervisor/requests/:id',
```

### ملفات جديدة

| الملف | الوصف |
|---|---|
| `src/pages/SupervisorRequests/index.jsx` | List view لكل الطلبات الجديدة (mock data مؤقتًا) |
| `src/pages/SupervisorRequestDetail/index.jsx` | تفاصيل المندوب + Dropdowns الشركة/المخزن + موافقة/رفض |
| `src/components/shared/CompanyWarehouseSelect.jsx` | Dropdown مزدوج، المخزن يتفلتر حسب الشركة المختارة |
| `src/constants/companies.js` | بيانات mock للشركات والمخازن (نفس أسلوب `nationality`/`city` الحالي — هتتحول لـ API لاحقًا) |

رفض المشرف يضبط `status = CANCELLED` و `cancelReason = CANCEL_REASON.SUPERVISOR_REJECTED`.

### i18n

مفاتيح جديدة: `supervisorRequests`, `selectCompany`, `selectWarehouse`, `approve`, `reject`, `rejectionReason`, إلخ.

---

## 6. المرحلة 4: شاشة HR

### Routes جديدة

```js
HR_REQUESTS: '/hr/requests',
HR_REQUEST_DETAIL: '/hr/requests/:id',
```

### ملفات جديدة

| الملف | الوصف |
|---|---|
| `src/pages/HrRequests/index.jsx` | List بالطلبات اللي حالتها `pending_hr` أو `pending_absher` (HR محتاج يشوف الاتنين) |
| `src/pages/HrRequestDetail/index.jsx` | مراجعة البيانات + فورم رابط/رقم السند + أزرار مرحلة أبشر (تفاصيل في المرحلة 5) |

### ملاحظة تقنية مهمة

بما إن مفيش backend حاليًا، كل حفظ (رابط السند، الإرسال لأبشر، قرار أبشر) هيتخزن مؤقتًا في mock state/context. لازم يتحدد بـ placeholder واضح في الكود (بنفس أسلوب `MOCK_APP_NUMBER` الموجود) عشان محدش ينساه وقت ربط الـ backend الفعلي.

---

## 7. المرحلة 5: مرحلة السند وموافقة أبشر (محدّثة)

هذه المرحلة اتغيّرت بالكامل عن الخطة الأصلية بعد توضيح التدفق الفعلي: **مفيش أي رابط يفتحه المندوب ولا checkbox بيوقعه** — العملية كلها بتحصل بره نظامنا (HR يدخل بيانات المندوب في سند يدويًا، والقرار بيتاخد في تطبيق أبشر بتاع المندوب مش عندنا).

### 7.1 جزء HR — `HrRequestDetail`

يتقسم لخطوتين ظاهرتين حسب الحالة الحالية:

**لما `status === PENDING_HR`:**
- فورم بحقلين: **رابط السند** + **رقم السند** (زي ما اتفقنا قبل كده)
- زرار **"تم الإرسال لأبشر"** — معطّل (`disabled`) لحد ما رقم السند يتملى، عشان نضمن عدم الإرسال بدون سند مسجّل
- الضغط عليه → `status → PENDING_ABSHER`

**لما `status === PENDING_ABSHER`:**
- عرض بيانات السند (للمراجعة فقط، read-only)
- رسالة توضيحية: "بانتظار قرار المندوب على تطبيق أبشر"
- زوج أزرار:
  - **"المندوب وافق"** (أخضر) → `status → PENDING_CONTRACT`
  - **"المندوب رفض"** (أحمر، ممكن يطلب تأكيد إضافي زي `confirm()` أو مودال بسيط) → `status → CANCELLED`, `cancelReason → ABSHER_REJECTED`

### 7.2 جزء المندوب — `CourierStatus`

المرحلة دي **معلوماتية فقط** للمندوب — مفيش أي فعل يقدر يعمله من عندنا، لأن القرار الحقيقي بيتاخد في أبشر مش في نظامنا. لازم نوضح ده بصريًا عشان محدش يفتكر إن الموافقة بتحصل هنا:

```jsx
// stage تظهر لما status === PENDING_ABSHER
{
  title: t.absherPending,        // "بانتظار موافقتك"
  hint: t.absherPendingHint,     // "تم إرسال طلبك عبر منصة سند إلى تطبيق أبشر، برجاء مراجعته والرد من هناك"
  icon: '◷',
  readOnly: true,                // مفيش أي زرار فعل هنا
}
```

### 7.3 قرار تصميمي مهم

الأزرار الفعلية (موافق/رفض) بتتحط في يد **HR فقط**، مش المندوب. المندوب في نظامنا دوره في المرحلة دي **مشاهدة الحالة بس**. ده بيمنع أي التباس إن حد يفتكر إن القرار بيتاخد جوه موقعنا، وبيطابق الواقع الفعلي إن القرار جوه أبشر ومش عندنا أي وسيلة تقنية نتأكد بيها غير تبليغ HR اليدوي.

### 7.4 i18n

مفاتيح جديدة: `sendToAbsher`, `absherApproved`, `absherRejected`, `absherPending`, `absherPendingHint`, `cancelled`, `cancelledByAbsher`, `cancelledBySupervisor`, `confirmAbsherRejection`.

---

## 8. المرحلة 6: العقد

### ملفات جديدة

| الملف | الوصف |
|---|---|
| `src/constants/contracts/withVehicle.js` | نص template بـ placeholders مثل `{{fullName}}`, `{{sanadNumber}}` |
| `src/constants/contracts/withoutVehicle.js` | نفس الفكرة، بدون بنود المركبة |
| `src/utils/fillTemplate.js` | دالة `fillTemplate(template, data)` — استبدال بسيط بـ regex على `{{key}}` |
| `src/components/shared/ContractViewer.jsx` | يختار التمبلت المناسب حسب `hasVehicle`، يعرضه، وزرار "أوافق وأمضي" |

### التكامل

يتحط جوه `CourierStatus` كحالة أخيرة (`PENDING_CONTRACT` ثم `ACTIVE`) — تظهر بس بعد ما HR يسجل موافقة أبشر.

---

## 9. ترتيب التنفيذ المقترح

| # | المهمة | الاعتمادية |
|---|---|---|
| 1 | `OnboardingContext` جديد + ربطه في `main.jsx` | - |
| 2 | سؤال "معاك سيارة؟" في `PersonalInfo` + تعديل `VehicleBank` | #1 |
| 3 | `constants/requestStatus.js` (بالحالات المحدّثة) + تحديث `CourierStatus` بمنطق ديناميكي | - |
| 4 | شاشات المشرف (list + detail + `CompanyWarehouseSelect`) | - |
| 5 | شاشات HR (list + detail + فورم رابط السند) | #3 |
| 6 | أزرار مرحلة أبشر داخل `HrRequestDetail` + section العرض داخل `CourierStatus` | #3, #5 |
| 7 | `ContractViewer` + templates العقدين + `fillTemplate` | #1, #2, #3 |
| 8 | ربط كل شيء بمسارات فعلية في `App.jsx` + مفاتيح `copy.js` لكل مرحلة | آخر خطوة |

---

## 10. ملفات جديدة - ملخص سريع

```
src/
├── context/
│   └── OnboardingContext.jsx
├── constants/
│   ├── requestStatus.js
│   ├── companies.js
│   └── contracts/
│       ├── withVehicle.js
│       └── withoutVehicle.js
├── components/shared/
│   ├── CompanyWarehouseSelect.jsx
│   └── ContractViewer.jsx
├── pages/
│   ├── SupervisorRequests/index.jsx
│   ├── SupervisorRequestDetail/index.jsx
│   ├── HrRequests/index.jsx
│   └── HrRequestDetail/index.jsx
└── utils/
    └── fillTemplate.js
```

ملفات موجودة هيتم تعديلها:

```
src/
├── main.jsx                      # لف بـ OnboardingProvider
├── App.jsx                       # routes جديدة للمشرف و HR
├── i18n/copy.js                  # مفاتيح ترجمة جديدة (ar + en)
├── constants/routes.js           # مسارات جديدة
└── pages/
    ├── PersonalInfo/index.jsx    # سؤال hasVehicle
    ├── VehicleBank/index.jsx     # إخفاء شرطي لقسم المركبة
    └── CourierStatus/index.jsx   # حالات ديناميكية + عرض حالة أبشر + عقد
```

> راجع أيضًا `BACKEND_SANAD_ABSHER.md` لتفاصيل الـ endpoints والـ state machine المطلوبة من الباك اند لدعم هذه المرحلة.
