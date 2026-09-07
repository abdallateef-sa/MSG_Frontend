# خطة تنفيذ: تدفق تسجيل المندوب (Supervisor → HR → سند → أبشر → عقد)

> خطة تنفيذية قابلة للتتبع، مبنية على `FRONTEND_PLAN.md` و `BACKEND_SANAD_ABSHER.md`، ومعايرة على الحالة الفعلية للكود الموجود (راجع `ARCHITECTURE.md`).
>
> **نمط التنفيذ:** مرحلة مرحلة — وقفة مراجعة بعد كل مرحلة قبل الانتقال للي بعدها.

---

## جدول المحتويات

1. [القرارات المعتمدة](#1-القرارات-المعتمدة)
2. [فجوات مكتشفة مش في الخطة الأصلية](#2-فجوات-مكتشفة-مش-في-الخطة-الأصلية)
3. [التدفق المستهدف](#3-التدفق-المستهدف)
4. [المرحلة 0 — تأسيس](#4-المرحلة-0--تأسيس)
5. [المرحلة 1 — سؤال معاك سيارة](#5-المرحلة-1--سؤال-معاك-سيارة)
6. [المرحلة 2 — حالات ديناميكية في CourierStatus](#6-المرحلة-2--حالات-ديناميكية-في-courierstatus)
7. [المرحلة 3 — شاشات المشرف](#7-المرحلة-3--شاشات-المشرف)
8. [المرحلة 4 — شاشات HR والسند وأبشر](#8-المرحلة-4--شاشات-hr-والسند-وأبشر)
9. [المرحلة 5 — العقد](#9-المرحلة-5--العقد)
10. [المرحلة 6 — الربط والتنظيف](#10-المرحلة-6--الربط-والتنظيف)
11. [ملخص الملفات](#11-ملخص-الملفات)
12. [المخاطر](#12-المخاطر)
13. [قائمة تتبع سريعة](#13-قائمة-تتبع-سريعة)

---

## 1. القرارات المعتمدة

| #   | الموضوع                 | القرار                                            | السبب                                                                                  |
| --- | ----------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | مخزن الطلبات            | `RequestsContext` منفصل + حفظ في `localStorage`   | فصل المسؤوليات عن بيانات الفورم، والحفظ بيخلي تجربة الـ workflow كاملة بعد الـ refresh |
| 2   | مكان سؤال "معاك سيارة؟" | في `VehicleBank` (خطوة 2)، والعدّاد يفضل **من 3** | السؤال عن المركبة فمكانه جوه سياقه؛ وتثبيت العدّاد بيمنع تعقيد `OnboardingLayout`      |
| 3   | تسمية الرفض             | `CANCELLED` موحّدة + حقل `cancelReason`           | حالة نهاية واحدة + سبب = UI أبسط وتوسّع أسهل (ملف الباك اند قسم 3 كان سايبها مفتوحة)   |
| 4   | نمط التنفيذ             | مرحلة مرحلة بوقفة مراجعة                          | التغيير كبير (21 ملف جديد) — الوقفات بتقلل مخاطر التراكم                               |
| 5   | التغييرات المعلّقة      | commit قبل أي شغل جديد                            | نقطة رجوع نظيفة                                                                        |

---

## 2. فجوات مكتشفة مش في الخطة الأصلية

| #   | الفجوة                                                                                                                                                                          | الحل                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| A   | **مفيش CSS لشاشات list.** الكلاسات الحالية كلها موجهة للفورم والكروت. أقرب حاجة لـ badge هي `.status.info` — بلون **واحد** بس (أزرق)                                            | ملف جديد `src/styles/dashboard.css` + 7 ألوان badge + جدول + حالة فاضية |
| B   | **`README.md` قسم "Known TODOs" قديم.** بيقول إن 5 نصوص متحرقة لسه موجودة (`Step X of 3`, `copyright`, `PDF or image`, `MSG LOGISTICS`, `APP-2026-1043`) — وهي **اتحلّت فعلًا** | تحديثه في المرحلة 6                                                     |
| C   | **`fillTemplate` بـ regex = خطر XSS** لو اتعرض بـ `dangerouslySetInnerHTML` (الـ `fullName` جاي من إدخال المستخدم)                                                              | عرض نصي بحت — **بدون** `dangerouslySetInnerHTML` نهائيًا                |
| D   | **الـ routes الجديدة مفيهاش أي حماية** — أي حد يكتب `/hr/requests` يدخل                                                                                                         | `RoleGate` مؤقت + `TODO` واضح للربط بالـ auth                           |
| E   | **`BACKEND_SANAD_ABSHER.md` مش موجود في المشروع** — الخطة بتشاور عليه وهو في `~/Downloads` بس                                                                                   | يتنقل للمشروع في المرحلة 6 (أو يتشال الإشارة ليه)                       |
| F   | **دمج مرحلتي 4 و 5** من الخطة الأصلية                                                                                                                                           | نفس الملف (`HrRequestDetail`) — تقسيمهم معناه كتابته مرتين              |

---

## 3. التدفق المستهدف

```
المندوب يسجل (+ يحدد: معاه سيارة؟ في خطوة 2)
        │
        ▼
   مراجعة المشرف ── رفض ──► CANCELLED (السبب: supervisor_rejected)
        │
     موافقة (+ اختيار شركة/مخزن)
        │
        ▼
   مراجعة HR (يدخل البيانات في سند يدويًا)
        │
   HR يحفظ رقم/رابط السند  ──►  saveSanad()  (الحالة ما بتتغيّرش)
        │
   HR يضغط "تم الإرسال لأبشر"  (معطّل بدون رقم سند)
        │
        ▼
   PENDING_ABSHER — بانتظار قرار المندوب في تطبيق أبشر
   (بره النظام تمامًا — المندوب عندنا **بيشوف** بس)
        │
   HR يسجل النتيجة يدويًا
        │
        ├── وافق ──► PENDING_CONTRACT ──► (المندوب يمضي) ──► ACTIVE
        │
        └── رفض  ──► CANCELLED (السبب: absher_rejected)
```

**قاعدة أساسية:** الأزرار الفعلية (موافق/رفض على أبشر) في يد **HR فقط**. المندوب دوره **مشاهدة** — عشان محدش يفتكر إن القرار بيتاخد جوه نظامنا.

---

## 4. المرحلة 0 — تأسيس

**الهدف:** الأساس اللي كل المراحل بتعتمد عليه. مفيش أي feature ظاهرة للمستخدم في المرحلة دي.

### 4.1 ملفات جديدة

| الملف                               | المحتوى                                                       |
| ----------------------------------- | ------------------------------------------------------------- |
| `src/constants/requestStatus.js`    | `REQUEST_STATUS` (6 حالات) + `CANCEL_REASON` (سببين)          |
| `src/constants/mockRequests.js`     | 5 طلبات وهمية، كل واحد في حالة مختلفة للتجربة                 |
| `src/context/RequestsContext.jsx`   | مخزن الطلبات + الأفعال + الحفظ في `localStorage`              |
| `src/context/OnboardingContext.jsx` | بيانات فورم التسجيل (`personal`, `vehicleBank`, `hasVehicle`) |
| `src/styles/dashboard.css`          | جدول + badges + حالة فاضية + شبكة تفاصيل                      |

### 4.2 `constants/requestStatus.js`

```js
export const REQUEST_STATUS = {
  PENDING_SUPERVISOR: 'pending_supervisor',
  PENDING_HR: 'pending_hr',
  PENDING_ABSHER: 'pending_absher',
  PENDING_CONTRACT: 'pending_contract',
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
};

export const CANCEL_REASON = {
  SUPERVISOR_REJECTED: 'supervisor_rejected',
  ABSHER_REJECTED: 'absher_rejected',
};
```

> **قرار موثّق للباك اند:** مفيش حالة `rejected_supervisor` منفصلة. كل الرفض بيروح لـ `CANCELLED` والسبب في `cancelReason`. ده بيحل الغموض اللي كان في `BACKEND_SANAD_ABSHER.md` قسم 3 (سطر `rejected_supervisor (اختياري)`).

### 4.3 `context/RequestsContext.jsx` — الأفعال

كل فعل بيفرض **نفس شروط الـ state machine** المكتوبة في `BACKEND_SANAD_ABSHER.md` قسم 5:

| الفعل                                                          | الشرط                                               | الأثر                                                                                      |
| -------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `supervisorDecision(id, { decision, companyId, warehouseId })` | `status === PENDING_SUPERVISOR`                     | موافقة → `PENDING_HR` (+ الشركة والمخزن) · رفض → `CANCELLED` + `SUPERVISOR_REJECTED`       |
| `saveSanad(id, { sanadNumber, sanadLink })`                    | `status === PENDING_HR`                             | يحفظ الحقلين — **الحالة ما بتتغيّرش**                                                      |
| `sendToAbsher(id)`                                             | `status === PENDING_HR` **و** `sanadNumber` مش فاضي | → `PENDING_ABSHER` + `sentToAbsherAt`                                                      |
| `absherDecision(id, decision)`                                 | `status === PENDING_ABSHER`                         | موافقة → `PENDING_CONTRACT` · رفض → `CANCELLED` + `ABSHER_REJECTED` · + `absherDecisionAt` |
| `signContract(id)`                                             | `status === PENDING_CONTRACT`                       | → `ACTIVE`                                                                                 |

**ملحوظة إلزامية في الكود:** الشروط دي **للـ UX بس**. الباك اند لازم يفرضها بنفسه (`BACKEND_SANAD_ABSHER.md` قسم 5 بند 1). هيتحط تعليق `TODO` واضح فوق كل فعل.

**قاعدة الإلغاء:** `CANCELLED` حالة **ميتة** — مفيش أي فعل بيرجّعها لحالة تانية (نفس بند 5.3 في ملف الباك اند).

### 4.4 الحفظ في `localStorage`

- المفتاح: `msg-requests` (بنفس نمط `msg-lang` الموجود)
- القراءة عند البداية بـ lazy initializer (زي `LanguageContext`)
- الكتابة في `useEffect` على كل تغيير
- **حماية:** لو الـ JSON بايظ أو الشكل مش متوقع → رجوع للـ mock الأولي بدل ما التطبيق يقع

### 4.5 `styles/dashboard.css` — الكلاسات

```
.data-table              الجدول
.data-table__row         صف قابل للنقر (hover + cursor)
.data-table__empty       حالة "مفيش طلبات"
.badge                   الأساس (نفس شكل .status الموجود)
.badge--pending          رمادي   → pending_supervisor · pending_hr
.badge--info             أزرق    → pending_absher
.badge--warning          كهرماني → pending_contract
.badge--success          أخضر    → active
.badge--danger           أحمر    → cancelled
.detail-grid             شبكة عرض تفاصيل الطلب (label + value)
.detail-section          قسم في صفحة التفاصيل
.decision-actions        صف أزرار الموافقة/الرفض
.danger-button           زر أحمر (مش موجود في الـ CSS الحالي)
```

**تعديل `styles/index.css`:**

```css
@import './status.css';
@import './dashboard.css'; /* ← جديد، قبل responsive */
@import './responsive.css';
```

> الترتيب مهم — `responsive.css` لازم يفضل آخر واحد (نفس القاعدة الموثقة في `ARCHITECTURE.md` قسم 7).

### 4.6 تعديل `main.jsx`

```jsx
<React.StrictMode>
  <BrowserRouter>
    <LanguageProvider>
      <RequestsProvider>
        {' '}
        {/* ← جديد */}
        <OnboardingProvider>
          {' '}
          {/* ← جديد */}
          <App />
        </OnboardingProvider>
      </RequestsProvider>
    </LanguageProvider>
  </BrowserRouter>
</React.StrictMode>
```

### ✅ التحقق من المرحلة 0

- [ ] `npm run build` يعدّي
- [ ] `npm run lint` بـ 0 أخطاء
- [ ] الصفحات الحالية (login → 3 خطوات → status) لسه شغالة زي ما هي
- [ ] `localStorage` فيه `msg-requests` بعد أول تحميل

---

## 5. المرحلة 1 — سؤال "معاك سيارة؟"

**الهدف:** إضافة السؤال وربطه بإظهار/إخفاء قسم المركبة.

### 5.1 التعديلات

| الملف                              | التعديل                                                            |
| ---------------------------------- | ------------------------------------------------------------------ |
| `src/i18n/copy.js`                 | `hasVehicle`, `hasVehicleHint`, `yes`, `no` (في `ar` **و** `en`)   |
| `src/pages/VehicleBank/index.jsx`  | radio group **أول الفورم** → لو "لا" قسم المركبة يختفي والبنك يفضل |
| `src/pages/PersonalInfo/index.jsx` | حفظ بيانات الخطوة في `OnboardingContext` عند الإرسال               |

### 5.2 تفاصيل السلوك

- القيمة الافتراضية `null` — المستخدم **لازم** يختار (`required` على الـ radio)
- لو اختار "لا": حقول اللوحة والنوع **تتشال من الـ DOM** — مش `display:none`

  > **ليه؟** لأن `required` على حقل مخفي بـ CSS بيمنع إرسال الفورم والمتصفح مش هيقدر يعمل focus عليه ليوضح الخطأ. الشيل من الـ DOM هو الحل الصح.

- الاختيار محفوظ في `OnboardingContext` — العقد في المرحلة 5 بيقرأ منه
- العدّاد يفضل **"الخطوة 2 من 3"** — `OnboardingLayout` مش هيتعدّل خالص

### ✅ التحقق من المرحلة 1

- [ ] المسار بسيارة: الحقول ظاهرة ومطلوبة
- [ ] المسار بدون سيارة: قسم المركبة مختفي والفورم بيتقدّم عادي
- [ ] العدّاد لسه "من 3" في الحالتين
- [ ] `hasVehicle` موجود في الـ context بعد الإرسال
- [ ] الـ radio بيعرض صح في العربي والإنجليزي (RTL/LTR)

---

## 6. المرحلة 2 — حالات ديناميكية في `CourierStatus`

**الهدف:** استبدال المراحل المتحرقة بمنطق مبني على الحالة الفعلية.

### 6.1 اللي بيتشال

```js
const MOCK_APP_NUMBER = 'APP-2026-1043'; // ← يتشال (بييجي من الـ context)

const stages = [
  // ← 4 عناصر متحرقة، تتشال بالكامل
  [t.received, t.receivedHint, true],
  [t.review, t.reviewHint, true],
  [t.docsReview, t.docsReviewHint, true],
  [t.contract, t.contractHint, false],
];
```

### 6.2 اللي بييجي مكانه

| العنصر                          | الوصف                                                                 |
| ------------------------------- | --------------------------------------------------------------------- |
| `getStagesForStatus(status, t)` | بتبني مصفوفة المراحل بالحالة الصح (مكتملة / جارية / لسه)              |
| كارت الإلغاء                    | يظهر بس لو `CANCELLED`، والنص بيتغيّر حسب `cancelReason`              |
| مرحلة `PENDING_ABSHER`          | **معلوماتية بحتة** — مفيش أي زر فعل (قرار مقصود، `FRONTEND_PLAN` 7.3) |
| قسم العقد                       | يظهر بس لو `PENDING_CONTRACT` أو `ACTIVE` (يكتمل في المرحلة 5)        |

### 6.3 مفاتيح i18n جديدة

نص + hint لكل حالة من الـ 6، زائد:

```
cancelled · cancelledBySupervisor · cancelledByAbsher
absherPending · absherPendingHint
```

### ✅ التحقق من المرحلة 2

- [ ] بدّل حالة الطلب في `mockRequests.js` يدويًا واتأكد إن الـ 6 حالات كلها بتتعرض صح
- [ ] كارت الإلغاء بيعرض النص الصح لكل `cancelReason`
- [ ] مرحلة أبشر مفيهاش أي زر فعل
- [ ] رقم الطلب بييجي من الـ context مش من ثابت

---

## 7. المرحلة 3 — شاشات المشرف

### 7.1 Routes جديدة

```js
SUPERVISOR_REQUESTS:       '/supervisor/requests',
SUPERVISOR_REQUEST_DETAIL: '/supervisor/requests/:id',
```

### 7.2 ملفات جديدة

| الملف                                              | الوصف                                               |
| -------------------------------------------------- | --------------------------------------------------- |
| `src/pages/SupervisorRequests/index.jsx`           | جدول طلبات `PENDING_SUPERVISOR` + حالة فاضية        |
| `src/pages/SupervisorRequestDetail/index.jsx`      | التفاصيل + اختيار شركة/مخزن + موافقة/رفض            |
| `src/components/shared/RequestsTable.jsx`          | جدول قابل لإعادة الاستخدام (المشرف **و** HR)        |
| `src/components/shared/StatusBadge.jsx`            | badge بيربط الحالة باللون والنص المترجم             |
| `src/components/shared/CompanyWarehouseSelect.jsx` | dropdown مزدوج — المخزن بيتفلتر حسب الشركة المختارة |
| `src/constants/companies.js`                       | mock: 3 شركات، كل واحدة 2-3 مخازن                   |

### 7.3 تفاصيل

- زر "موافقة" **معطّل** لحد ما الشركة **و** المخزن يتحددوا
- تغيير الشركة → المخزن المختار يترست (عشان ميفضلش مخزن من شركة تانية)
- الرفض → `CANCELLED` + `SUPERVISOR_REJECTED`
- الـ `:id` مش موجود → رسالة "طلب غير موجود" + زر رجوع (مش شاشة بيضاء)
- بعد أي قرار → رجوع لقائمة الطلبات

### 7.4 مفاتيح i18n

```
supervisorRequests · requestsList · noRequests · courierName
requestDate · requestStatus · viewDetails
selectCompany · selectWarehouse · company · warehouse
approve · reject · approveRequest · rejectRequest
requestNotFound · backToList
```

### ✅ التحقق من المرحلة 3

- [ ] الجدول بيعرض طلبات `PENDING_SUPERVISOR` بس
- [ ] الحالة الفاضية بتظهر لما مفيش طلبات
- [ ] زر الموافقة معطّل بدون شركة + مخزن
- [ ] تغيير الشركة بيرست المخزن
- [ ] الموافقة بتنقل الطلب لـ `PENDING_HR`
- [ ] الرفض بيحوّل لـ `CANCELLED` + السبب الصح
- [ ] `/supervisor/requests/999` بيعرض رسالة مفيدة

---

## 8. المرحلة 4 — شاشات HR والسند وأبشر

> **دمج مرحلتي 4 و 5** من الخطة الأصلية — نفس الملف (`HrRequestDetail`).

### 8.1 Routes جديدة

```js
HR_REQUESTS:       '/hr/requests',
HR_REQUEST_DETAIL: '/hr/requests/:id',
```

### 8.2 ملفات جديدة

| الملف                                 | الوصف                                                    |
| ------------------------------------- | -------------------------------------------------------- |
| `src/pages/HrRequests/index.jsx`      | جدول طلبات `PENDING_HR` **و** `PENDING_ABSHER` (الاتنين) |
| `src/pages/HrRequestDetail/index.jsx` | عرض شرطي على حالتين (تحت)                                |
| `src/components/ui/ConfirmDialog.jsx` | مودال تأكيد بسيط                                         |

### 8.3 `HrRequestDetail` — العرض الشرطي

**لو `status === PENDING_HR`:**

- عرض بيانات المندوب (read-only)
- فورم: **رابط السند** + **رقم السند**
- زر "حفظ" → `saveSanad()` — بيحفظ بس، **الحالة ما بتتغيّرش**
- زر **"تم الإرسال لأبشر"** — **معطّل** لحد ما رقم السند يتملى → `PENDING_ABSHER`

  > الشرط ده مطابق لبند 5.2 في `BACKEND_SANAD_ABSHER.md`: "منع `send-to-absher` لو `sanad_number` فاضي"

**لو `status === PENDING_ABSHER`:**

- بيانات السند **read-only**
- رسالة: "بانتظار قرار المندوب على تطبيق أبشر"
- زرين:
  - **"المندوب وافق"** (أخضر) → `PENDING_CONTRACT`
  - **"المندوب رفض"** (أحمر) → **مودال تأكيد** → `CANCELLED` + `ABSHER_REJECTED`

### 8.4 مودال التأكيد — قرار

مكون `ConfirmDialog.jsx` مخصص، **مش** `window.confirm()`.

> **ليه؟** `window.confirm()` مش قابل للترجمة، مش قابل للتنسيق، وبيتجاهل اتجاه الصفحة (RTL). ومخالف لقاعدة "كل النصوص من `copy.js`" في `README.md`.

### 8.5 مفاتيح i18n

```
hrRequests · sanadNumber · sanadLink · saveSanad · sanadSaved
sendToAbsher · sendToAbsherHint
absherApproved · absherRejected · absherDecision
confirmAbsherRejection · confirmAbsherRejectionBody
confirm · cancel
```

### ✅ التحقق من المرحلة 4

- [ ] القائمة بتعرض `PENDING_HR` **و** `PENDING_ABSHER`
- [ ] "تم الإرسال لأبشر" **معطّل** بدون رقم سند
- [ ] `saveSanad` بيحفظ من غير ما يغيّر الحالة
- [ ] "المندوب رفض" بيفتح المودال، والإلغاء منه مش بيعمل حاجة
- [ ] التدفق كامل: سند → أبشر → موافقة → شاشة المندوب اتحدّثت
- [ ] بعد `refresh` الحالة الجديدة لسه موجودة (`localStorage` شغال)
- [ ] المودال بيعرض صح في RTL

---

## 9. المرحلة 5 — العقد

### 9.1 ملفات جديدة

| الملف                                       | الوصف                                             |
| ------------------------------------------- | ------------------------------------------------- |
| `src/constants/contracts/withVehicle.js`    | نص عقد بـ `{{placeholders}}`                      |
| `src/constants/contracts/withoutVehicle.js` | نفسه بدون بنود المركبة                            |
| `src/utils/fillTemplate.js`                 | `fillTemplate(template, data)`                    |
| `src/components/shared/ContractViewer.jsx`  | يختار التمبلت حسب `hasVehicle` + زر "أوافق وأمضي" |

### 9.2 ⚠️ قرار أمني إلزامي

`ContractViewer` بيعرض النص **كنص عادي** — عبر `<pre>` أو `<p>` متعددة.

**ممنوع تمامًا `dangerouslySetInnerHTML`.**

> **السبب:** `fullName` وباقي البيانات جاية من **إدخال المستخدم**. لو اتحقنت في HTML، أي حد يكتب اسمه `<img src=x onerror=alert(1)>` يبقى عنده XSS. العرض النصي بيمنع ده من الأساس.

### 9.3 `fillTemplate` — الحالات الحدّية

| الحالة                  | السلوك                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| مفتاح ناقص              | يفضل `{{key}}` ظاهر — **مش** `undefined` — عشان يبان في المراجعة |
| مسافات في الأقواس       | `{{ key }}` و `{{key}}` الاتنين يشتغلوا                          |
| قيمة `null`/`undefined` | نفس معاملة المفتاح الناقص                                        |

### 9.4 التكامل

`ContractViewer` بيتحط جوه `CourierStatus`:

- يظهر لو `status === PENDING_CONTRACT` → مع زر "أوافق وأمضي"
- لو `status === ACTIVE` → يظهر read-only بعلامة "تم التوقيع"

### ✅ التحقق من المرحلة 5

- [ ] العقد بسيارة بيعرض بنود المركبة
- [ ] العقد بدون سيارة **مش** بيعرضها
- [ ] كل الـ placeholders اتملت (مفيش `{{...}}` ظاهر)
- [ ] **مفيش `dangerouslySetInnerHTML` في أي مكان** (تأكيد بـ grep)
- [ ] "أوافق وأمضي" بيحوّل لـ `ACTIVE`
- [ ] بعد `ACTIVE` العقد read-only

---

## 10. المرحلة 6 — الربط والتنظيف

| المهمة                        | التفاصيل                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| كل الـ routes في `App.jsx`    | المشرف + HR، ملفوفين بـ `RoleGate`                                                         |
| `RoleGate` مؤقت               | `src/components/shared/RoleGate.jsx` — بيمرّر كل حاجة دلوقتي + `TODO` واضح للربط بالـ auth |
| مراجعة `copy.js`              | تأكد إن **كل** مفتاح موجود في `ar` **و** `en` (سكربت مقارنة سريع)                          |
| تحديث `README.md`             | قسم "Known TODOs" **قديم** — النصوص اللي فيه اتحلّت فعلًا                                  |
| تحديث `ARCHITECTURE.md`       | الملفات الجديدة + تحديث قسمي "اللي اتعمل" و "اللي متعملش"                                  |
| نقل `BACKEND_SANAD_ABSHER.md` | من `~/Downloads` للمشروع (الخطة بتشاور عليه)                                               |
| فحص نهائي                     | `build` + `lint` + `format` + تدفق كامل من الدخول للعقد                                    |

### ⚠️ `RoleGate` مش أمان حقيقي

المكون ده **بيمرّر كل حاجة** دلوقتي. الحماية الفعلية محتاجة:

1. auth حقيقي (مفيش دلوقتي — الدخول وهمي)
2. تحقق من الدور في **الباك اند** على كل endpoint

لازم يتوثّق كـ ثقب معروف في `ARCHITECTURE.md` قسم 9.

---

## 11. ملخص الملفات

### ملفات جديدة (21)

```
src/constants/
├── requestStatus.js                    # الحالات + أسباب الإلغاء
├── mockRequests.js                     # 5 طلبات وهمية
├── companies.js                        # شركات + مخازن
└── contracts/
    ├── withVehicle.js                  # تمبلت عقد بسيارة
    └── withoutVehicle.js               # تمبلت عقد بدون سيارة

src/context/
├── RequestsContext.jsx                 # مخزن الطلبات + الأفعال + localStorage
└── OnboardingContext.jsx               # بيانات فورم التسجيل

src/components/shared/
├── RequestsTable.jsx                   # جدول (مشترك: مشرف + HR)
├── StatusBadge.jsx                     # badge الحالة
├── CompanyWarehouseSelect.jsx          # dropdown مزدوج
├── ContractViewer.jsx                  # عارض العقد
└── RoleGate.jsx                        # حماية مؤقتة

src/components/ui/
└── ConfirmDialog.jsx                   # مودال تأكيد

src/pages/
├── SupervisorRequests/index.jsx
├── SupervisorRequestDetail/index.jsx
├── HrRequests/index.jsx
└── HrRequestDetail/index.jsx

src/utils/
└── fillTemplate.js                     # استبدال {{placeholders}}

src/styles/
└── dashboard.css                       # جدول + badges + حالة فاضية
```

### ملفات هتتعدّل (10)

```
src/main.jsx                     # لف بـ RequestsProvider + OnboardingProvider
src/App.jsx                      # routes المشرف و HR + RoleGate
src/constants/routes.js          # 4 مسارات جديدة
src/i18n/copy.js                 # ~60 مفتاح جديد × 2 لغة
src/styles/index.css             # @import dashboard.css
src/pages/PersonalInfo/index.jsx # حفظ في الـ context
src/pages/VehicleBank/index.jsx  # سؤال hasVehicle + إخفاء شرطي
src/pages/CourierStatus/index.jsx # حالات ديناميكية + عقد
README.md                        # تحديث Known TODOs القديم
ARCHITECTURE.md                  # الهيكل الجديد
```

---

## 12. المخاطر

| المخاطرة                                       | التعامل                                                                           |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| `copy.js` هيكبر ~60 مفتاح × 2 لغة              | لو بقى تقيل، يتقسم لـ `copy/courier.js` + `copy/admin.js` — **بس مش في الخطة دي** |
| الـ routes الجديدة **بدون حماية حقيقية**       | `RoleGate` + توثيق واضح. **مش أمان** — الحماية الفعلية في الباك اند               |
| منطق state machine مكرر (فرونت + باك)          | مقصود للـ UX. الباك اند هو المصدر الوحيد للحقيقة — `TODO` على كل فعل              |
| `localStorage` هيحتفظ بحالات قديمة وقت التطوير | زر "reset mock data" في شاشة HR (dev فقط) + حماية من JSON بايظ                    |
| `mockRequests` بيانات وهمية ممكن تتنسى         | ثوابت بأسماء صريحة (`MOCK_`) بنفس نمط `MOCK_APP_NUMBER` الموجود                   |
| الجداول على الموبايل                           | `dashboard.css` لازم يتعامل مع الشاشات الصغيرة (تمرير أفقي أو تحويل لكروت)        |

---

## 13. قائمة تتبع سريعة

```
[ ] 0️⃣  commit التغييرات المعلّقة (mcp.json + ARCHITECTURE.md + docs/)
[ ] 1️⃣  المرحلة 0 — تأسيس (5 ملفات + main.jsx)            ⏸️ وقفة
[ ] 2️⃣  المرحلة 1 — سؤال معاك سيارة                        ⏸️ وقفة
[ ] 3️⃣  المرحلة 2 — حالات ديناميكية في CourierStatus        ⏸️ وقفة
[ ] 4️⃣  المرحلة 3 — شاشات المشرف (6 ملفات)                  ⏸️ وقفة
[ ] 5️⃣  المرحلة 4 — HR + السند + أبشر (3 ملفات)             ⏸️ وقفة
[ ] 6️⃣  المرحلة 5 — العقد (4 ملفات)                         ⏸️ وقفة
[ ] 7️⃣  المرحلة 6 — ربط + تنظيف + توثيق
```

---

## تنبيه أمني لسه قائم 🔴

الـ commit الوحيد في الريبو (`f0c0005 init`) **لسه فيه Google API key** في تاريخ git (كان في `.vscode/mcp.json`).

الملف اتحذف من الحالة الحالية، بس **مش من التاريخ**. لسه محتاج:

1. **تبطّل المفتاح** من Google Cloud Console وتعمل واحد جديد
2. تنقل المفتاح الجديد لمتغير بيئة (مش ملف متعمّله commit)

ده مش حاجة تتحل بتعديل كود — لازم فعل منك في Google Console.

---

## مراجع

| الملف                     | الدور                                                  |
| ------------------------- | ------------------------------------------------------ |
| `ARCHITECTURE.md`         | الحالة الحالية للمشروع — اللي اتعمل واللي متعملش       |
| `README.md`               | قواعد إضافة features جديدة (routes, i18n, مكونات)      |
| `FRONTEND_PLAN.md`        | الخطة الأصلية (المصدر)                                 |
| `BACKEND_SANAD_ABSHER.md` | الـ endpoints والـ state machine المطلوبة من الباك اند |
