# خطة تنفيذ: Courier Dashboard (الشاشة الرئيسية للمندوب بعد التفعيل)

> خطة تنفيذية مكمّلة لـ `FRONTEND_PLAN.md` و `COURIER_DASHBOARD_PLAN.md`
> مبنية على تحليل الكود الحالي في `ARCHITECTURE.md`

---

## ملخص الحالة الحالية

| المكون           | الحالة                         | الإجراء المطلوب                                   |
| ---------------- | ------------------------------ | ------------------------------------------------- |
| `AppHeader`      | بسيط (logo + title + logout)   | توسعة لدعم variant dashboard (جرس + صورة بروفايل) |
| `routes.js`      | لا يحتوي COURIER_DASHBOARD     | إضافة 8 routes جديدة                              |
| `CourierStatus`  | يعرض ContractViewer عند ACTIVE | إضافة navigate للـ dashboard بعد التوقيع          |
| `ContractViewer` | badge عند التوقيع              | تمرير navigate callback                           |
| `styles`         | لا يوجد dashboard.css          | ملف جديد + import في index.css                    |
| `i18n/copy.js`   | لا توجد مفاتيح dashboard       | إضافة ~20 مفتاح × لغتين                           |

---

## خطة التنفيذ (6 مراحل)

### ✅ المرحلة 1: البنية الأساسية + Placeholder Page

**الهدف:** إنشاء الـ routing والصفحة الرئيسية + تعديل AppHeader

| #   | الملف                                  | الإجراء                                                         |
| --- | -------------------------------------- | --------------------------------------------------------------- |
| 1.1 | `src/constants/routes.js`              | إضافة: `COURIER_DASHBOARD: '/dashboard'` + 7 مسارات placeholder |
| 1.2 | `src/pages/PlaceholderPage/index.jsx`  | صفحة عامة تعرض "قريبًا" + زر رجوع (تاخد `title` من route)       |
| 1.3 | `src/pages/CourierDashboard/index.jsx` | هيكل الصفحة الرئيسية (layout + placeholder للمكونات)            |
| 1.4 | `src/App.jsx`                          | إضافة routes الجديدة                                            |
| 1.5 | `src/components/shared/AppHeader.jsx`  | **تعديل**: إضافة `variant` prop (`'onboarding'                  | 'dashboard'`) |

**ملفات جديدة:** 3 | **معدلة:** 3

---

### ✅ المرحلة 2: المكونات المشتركة (UI Cards)

**الهدف:** بناء كروت الشاشة الرئيسية

| #   | الملف                                        | الوصف                                                             |
| --- | -------------------------------------------- | ----------------------------------------------------------------- |
| 2.1 | `src/components/shared/GreetingCard.jsx`     | اسم المندوب + badge "نشط - على رأس العمل" (أخضر)                  |
| 2.2 | `src/components/shared/SupervisorCard.jsx`   | صورة + اسم المشرف + زرار رسالة (`mailto:`) + اتصال (`tel:`)       |
| 2.3 | `src/components/shared/VehicleCard.jsx`      | **شرطي** (`hasVehicle`) — رقم اللوحة + الموديل + badge (PetroApp) |
| 2.4 | `src/components/shared/RequestListItem.jsx`  | عنوان + رقم طلب + status badge (معتمد=أخضر، قيد المراجعة=كهرماني) |
| 2.5 | `src/components/ui/QuickActionButton.jsx`    | زر مربع بأيقونة + نص (props: icon, label, onClick) — emoji icons  |
| 2.6 | `src/components/shared/QuickActionsGrid.jsx` | شبكة 2×2 من `QuickActionButton` — navigate للـ placeholder routes |
| 2.7 | `src/components/shared/BottomNav.jsx`        | 4 تابات: Payslips, Attendance, Operations, Dashboard (active)     |

**ملفات جديدة:** 7

---

### ✅ المرحلة 3: بيانات Mock + i18n

**الهدف:** البيانات والترجمات

| #   | الملف                            | الوصف                                                                                                                                                                                                                                                                                                                                              |
| --- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | `src/constants/mockDashboard.js` | بيانات وهمية: `courierName`, `supervisor`, `vehicle` (شرطي), `recentRequests`                                                                                                                                                                                                                                                                      |
| 3.2 | `src/i18n/copy.js`               | إضافة ~20 مفتاح (ar+en): `greeting`, `activeOnDuty`, `supervisor`, `vehicle`, `vehicleCompensation`, `financialAdvance`, `accidentReport`, `cancelCompensation`, `recentRequests`, `viewAll`, `approved`, `pendingReview`, `payslips`, `attendance`, `operations`, `dashboard`, `comingSoon`, `notifications`, `profile`, `logout`, `logisticsHub` |

**ملفات جديدة:** 1 | **معدلة:** 1

---

### ✅ المرحلة 4: تجميع CourierDashboard + Styles

**الهدف:** تجميع الصفحة + تنسيقات

| #   | الملف                                  | الوصف                                                                                                                                                                                                                            |
| --- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | `src/pages/CourierDashboard/index.jsx` | تجميع كل المكونات في layout واحد                                                                                                                                                                                                 |
| 4.2 | `src/styles/dashboard.css`             | تنسيقات: `.dashboard-page`, `.dashboard-header`, `.greeting-card`, `.supervisor-card`, `.vehicle-card`, `.quick-actions-grid`, `.quick-action-btn`, `.request-list`, `.request-item`, `.status-badge`, `.bottom-nav`, responsive |
| 4.3 | `src/styles/index.css`                 | إضافة `@import './dashboard.css';` قبل `responsive.css`                                                                                                                                                                          |

**ملفات جديدة:** 1 | **معدلة:** 2

---

### ✅ المرحلة 5: ربط تدفق التوقيع

**الهدف:** الانتقال التلقائي للـ dashboard بعد توقيع العقد

| #   | الملف                                      | التعديل                                                                                                 |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 5.1 | `src/components/shared/ContractViewer.jsx` | إضافة `onNavigate` prop — بعد `setAgreed(true)` و `onSign()`، يعمل `navigate(ROUTES.COURIER_DASHBOARD)` |
| 5.2 | `src/pages/CourierStatus/index.jsx`        | تمرير دالة navigate للـ `ContractViewer`                                                                |

**ملفات معدلة:** 2

---

### ✅ المرحلة 6: التحقق النهائي + تحديث التوثيق

**الهدف:** ضمان الجودة

| المهمة            | التفاصيل                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| `npm run build`   | يمر بدون أخطاء                                                               |
| `npm run lint`    | 0 أخطاء                                                                      |
| `npm run format`  | نظيف                                                                         |
| تدفق كامل         | Login → Register (3 خطوات) → Status (ACTIVE) → Sign Contract → **Dashboard** |
| `README.md`       | إضافة dashboard في Folder Structure + Known TODOs                            |
| `ARCHITECTURE.md` | تحديث قسم "اللي اتعمل" + الملفات الجديدة                                     |

---

## قرارات معمارية ثابتة

| القرار                     | التبرير                                                                     |
| -------------------------- | --------------------------------------------------------------------------- |
| **AppHeader معدل**         | reuse الكود — إضافة `variant` prop مع default `'onboarding'`                |
| **PlaceholderPage واحدة**  | DRY — 7 routes تتعامل معها عبر `title` من route params                      |
| **VehicleCard شرطي**       | `hasVehicle` من `OnboardingContext` — أول استخدام فعلي للبيانات بعد التسجيل |
| **BottomNav ثابت**         | 4 تابات دايماً — لاحقاً تتحول لصفحات حقيقية                                 |
| **Mock data في constants** | متسق مع `mockRequests.js` — سهل الاستبدال بالـ API                          |
| **أيقونات Quick Actions**  | emoji inline — سريع ولا يحتاج asset خارجي                                   |

---

## مخاطر وتخفيفها

| المخاطرة                         | التخفيف                                                          |
| -------------------------------- | ---------------------------------------------------------------- |
| AppHeader يكسر الصفحات الحالية   | `variant` prop مع default `'onboarding'` — zero breaking changes |
| CSS conflicts                    | dashboard.css قبل responsive.css + classes بأسماء `.dashboard-`  |
| OnboardingContext data temporary | عند ربط الباك اند: يستبدل بـ `GET /courier/profile`              |
| RTL/LTR للـ BottomNav            | logical properties (`margin-inline`) + اختبار في اللغتين         |

---

## قائمة تتبع سريعة

```
[ ] 1️⃣ المرحلة 1: Routing + PlaceholderPage + AppHeader variant
[ ] 2️⃣ المرحلة 2: 7 مكونات UI Cards
[ ] 3️⃣ المرحلة 3: mockDashboard.js + i18n keys (~20 × 2)
[ ] 4️⃣ المرحلة 4: CourierDashboard assembly + dashboard.css
[ ] 5️⃣ المرحلة 5: ContractViewer navigate to dashboard
[ ] 6️⃣ المرحلة 6: Build + Lint + Format + توثيق
```

---

## إجمالي الملفات

| النوع        | العدد |
| ------------ | ----- |
| **جديدة**    | 12    |
| **معدلة**    | 7     |
| **الإجمالي** | 19    |

---

> **ملاحظة:** الخطة دي بتفترض إنك موافق على القرارات المعمارية. لو فيه أي تعديل، قولي قبل ما أبدأ.

---

## بدء التنفيذ

الآن أبدأ بالمرحلة 1...
