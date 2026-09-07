# توثيق مشروع MSG Logistics Frontend

> ملف مرجعي شامل: بيشرح كل ملف في المشروع، وإيه اللي اتعمل، وإيه اللي **لسه متعملش**.
> آخر تحديث: بعد إعادة هيكلة المشروع (refactor) من ملف واحد لهيكل منظم.

---

## جدول المحتويات

1. [نظرة عامة](#1-نظرة-عامة)
2. [التقنيات المستخدمة](#2-التقنيات-المستخدمة)
3. [هيكل المشروع الكامل](#3-هيكل-المشروع-الكامل)
4. [شرح تفصيلي لكل ملف](#4-شرح-تفصيلي-لكل-ملف)
5. [نظام التنقل (Routing)](#5-نظام-التنقل-routing)
6. [نظام الترجمة (i18n)](#6-نظام-الترجمة-i18n)
7. [نظام التنسيقات (CSS)](#7-نظام-التنسيقات-css)
8. [اللي اتعمل ✅](#8-اللي-اتعمل-)
9. [اللي متعملش ❌](#9-اللي-متعملش-)
10. [تحذير أمني عاجل](#10-تحذير-أمني-عاجل-)
11. [الأوامر المتاحة](#11-الأوامر-المتاحة)
12. [الحالة الحالية للجودة](#12-الحالة-الحالية-للجودة)

---

## 1. نظرة عامة

تطبيق **React SPA** لبوابة تسجيل مناديب التوصيل (couriers) لشركة MSG Logistics.

**الرحلة الكاملة للمستخدم:**

```
تسجيل الدخول → المعلومات الشخصية → المركبة والبنك → رفع المستندات → حالة الطلب
   /login      /register/personal   /register/vehicle-bank  /register/documents   /status
```

**خصائص أساسية:**

- **ثنائي اللغة**: عربي (RTL) وإنجليزي (LTR)، والعربي هو الافتراضي
- **اللغة محفوظة** في `localStorage` فبتفضل بعد refresh
- **معالج متعدد الخطوات** (wizard) بمؤشر تقدم بصري
- **تصميم متوافق مع الموبايل** (breakpoint واحد عند 650px)

> **مهم:** ده حاليًا **نموذج واجهة (UI prototype)** — مفيش backend، مفيش API، ومفيش حفظ حقيقي للبيانات. التفاصيل في قسم [اللي متعملش](#9-اللي-متعملش-).

---

## 2. التقنيات المستخدمة

| التصنيف          | الأداة / المكتبة                                        | الإصدار  | الدور                                        |
| ---------------- | ------------------------------------------------------- | -------- | -------------------------------------------- |
| **UI**           | `react` + `react-dom`                                   | ^18.3.1  | مكتبة الواجهة                                |
| **Routing**      | `react-router-dom`                                      | ^7.18.3  | التنقل بين الصفحات بالـ paths                |
| **Build**        | `vite`                                                  | ^6.0.5   | dev server + bundler                         |
| **JSX / HMR**    | `@vitejs/plugin-react`                                  | ^4.3.4   | تحويل JSX + React Fast Refresh               |
| **Lint**         | `eslint` + `@eslint/js`                                 | ^9.39.5  | فحص جودة الكود (flat config)                 |
| **Lint plugins** | `eslint-plugin-react`, `-react-hooks`, `-react-refresh` | —        | قواعد خاصة بـ React                          |
| **Format**       | `prettier` + `eslint-config-prettier`                   | ^3.9.6   | تنسيق الكود + منع التعارض مع ESLint          |
| **Globals**      | `globals`                                               | ^17.12.0 | تعريف متغيرات البيئة (browser/node) للـ lint |

**لغة الكود:** ES Modules + JSX (مفيش TypeScript).
**الـ Alias:** `@` بيشاور على `src` — معرّف في مكانين (`vite.config.js` للبناء و `jsconfig.json` للـ editor).

---

## 3. هيكل المشروع الكامل

```
MSG_Frontend/
│
├── 📄 index.html                    # نقطة دخول HTML (RTL افتراضي)
├── 📄 package.json                  # الاعتماديات والأوامر
├── 📄 vite.config.js                # إعداد Vite (react plugin + alias)
├── 📄 jsconfig.json                 # إعداد الـ alias للـ IDE (intellisense)
├── 📄 eslint.config.js              # إعداد ESLint (flat config)
├── 📄 .prettierrc                   # قواعد التنسيق
├── 📄 .prettierignore               # ملفات مستثناة من التنسيق
├── 📄 .gitignore                    # ملفات مستثناة من git
├── 📄 ARCHITECTURE.md               # ← الملف ده
│
├── 📁 docs/
│   └── MSG Horizons Construction brand id.pdf   # هوية العلامة (33MB، متجاهل من git)
│
├── 📁 public/                       # ⚠️ فاضي (مفيش favicon)
│
├── 📁 .vscode/
│   └── mcp.json                     # 🔴 فيه API key مكشوف — شوف قسم التحذير الأمني
│
└── 📁 src/
    │
    ├── 📄 main.jsx                  # تجميع التطبيق (Router + Provider + App)
    ├── 📄 App.jsx                   # جدول الـ routes فقط
    │
    ├── 📁 constants/
    │   └── routes.js                # كل مسارات التطبيق في مكان واحد
    │
    ├── 📁 i18n/
    │   ├── copy.js                  # نصوص الترجمة (عربي + إنجليزي)
    │   └── LanguageContext.jsx      # Context + Provider + useLanguage hook
    │
    ├── 📁 utils/
    │   └── rtl.js                   # دوال مساعدة للاتجاه (getArrow)
    │
    ├── 📁 components/
    │   ├── 📁 ui/                   # مكونات عرض بسيطة (presentational)
    │   │   ├── BrandLogo.jsx
    │   │   └── LanguageButton.jsx
    │   └── 📁 shared/               # مكونات مركبة مشتركة
    │       ├── AppHeader.jsx
    │       └── FormActions.jsx
    │
    ├── 📁 layouts/
    │   └── OnboardingLayout.jsx     # الهيكل المشترك لخطوات التسجيل
    │
    ├── 📁 pages/                    # صفحة لكل route
    │   ├── Login/index.jsx
    │   ├── PersonalInfo/index.jsx
    │   ├── VehicleBank/index.jsx
    │   ├── Documents/index.jsx
    │   └── CourierStatus/index.jsx
    │
    ├── 📁 hooks/
    │   └── .gitkeep                 # ⚠️ فاضي — محضّر للـ custom hooks
    │
    ├── 📁 services/
    │   └── .gitkeep                 # ⚠️ فاضي — محضّر لطلبات الـ API
    │
    └── 📁 styles/
        ├── index.css                # نقطة الدخول (@import بالترتيب)
        ├── base.css                 # reset + tokens + أساسيات
        ├── auth.css                 # صفحة الدخول + حقول الفورم المشتركة
        ├── onboarding.css           # المعالج (wizard)
        ├── status.css               # صفحة حالة الطلب
        └── responsive.css           # تعديلات الموبايل (آخر واحد)
```

---

## 4. شرح تفصيلي لكل ملف

### 4.1 ملفات الإعداد (Configuration)

#### `index.html`

نقطة دخول الصفحة. سطر 2 بيحدد `lang="ar" dir="rtl"` كافتراضي — بس `LanguageContext` بيعدّلهم ديناميكيًا وقت التشغيل.
فيه `<div id="root">` اللي React بيتركب جواه، و `theme-color` بلون العلامة `#139A43`.

#### `vite.config.js`

```js
plugins: [react()]                                    // يشغّل JSX + Fast Refresh
resolve.alias: { '@': fileURLToPath(...'./src') }     // '@/pages/Login' → 'src/pages/Login'
```

**ملحوظة مهمة:** الملف ده **كان مش موجود** قبل الـ refactor. يعني `@vitejs/plugin-react` كان مثبّت في `package.json` بس **مش مستخدم** — وده معناه إن **React Fast Refresh كان معطّل تمامًا** (Vite كان بيحوّل الـ JSX بـ esbuild بدون HMR للمكونات). دلوقتي بقى شغال.

#### `jsconfig.json`

بيعرّف نفس الـ alias (`@/*` → `src/*`) بس للـ **editor** (VS Code) عشان الـ autocomplete و "go to definition" يشتغلوا. Vite مش بيقرأ الملف ده — فلازم الاتنين يفضلوا متزامنين.

#### `eslint.config.js`

Flat config (الشكل الجديد لـ ESLint 9). بيجمع:

- `js.configs.recommended` — قواعد JavaScript الأساسية
- `react.configs.recommended` + `jsx-runtime` — قواعد React (والتاني بيلغي الحاجة لـ `import React` في كل ملف)
- `reactHooks.configs.recommended` — قواعد الـ hooks (ترتيب الاستدعاء، الاعتماديات)
- `react-refresh/only-export-components` — تحذير لو ملف بيصدّر حاجة غير مكونات
- `react/prop-types: 'off'` — مقفولة لأن المشروع مش بيستخدم PropTypes
- `prettier` في الآخر — بيلغي أي قاعدة بتتعارك مع Prettier

#### `.prettierrc`

```json
{ "singleQuote": true, "printWidth": 100, "trailingComma": "all", "arrowParens": "always" }
```

#### `.gitignore`

بيتجاهل: `node_modules/`, `dist/`, `.env*`, الـ logs, ملفات النظام (`.DS_Store`), و `docs/*.pdf`.
السطر الأخير مهم لأن ملف الهوية حجمه **33 ميجا** — مش من المنطقي يتعمله commit.

---

### 4.2 نقطة الدخول والتجميع

#### `src/main.jsx` (16 سطر)

بيركّب التطبيق بالترتيب الصح — والترتيب ده **مقصود**:

```jsx
<React.StrictMode>        // 1. يكشف مشاكل التطوير
  <BrowserRouter>         // 2. الراوتر لازم يكون بره عشان الـ hooks تشوفه
    <LanguageProvider>    // 3. اللغة جوه الراوتر (لو احتاجت تقرأ الـ location مستقبلًا)
      <App />             // 4. جدول الـ routes
```

كمان بيستورد `./styles/index.css` — ودي نقطة دخول كل التنسيقات.

#### `src/App.jsx` (25 سطر)

**مسؤوليته الوحيدة**: تعريف الـ routes. مفيش أي منطق أو UI.

```jsx
/                        → إعادة توجيه لـ /login
/login                   → <Login />
/register                → <OnboardingLayout />   (أب)
   ├── index             → إعادة توجيه لـ /register/personal
   ├── personal          → <PersonalInfo />
   ├── vehicle-bank      → <VehicleBank />
   └── documents         → <Documents />
/status                  → <CourierStatus />
*                        → إعادة توجيه لـ /login   (أي مسار غلط)
```

المسارات كلها جاية من `ROUTES` — مفيش string مكتوب بالإيد.

---

### 4.3 الثوابت (Constants)

#### `src/constants/routes.js` (19 سطر)

كل مسارات التطبيق في object واحد:

```js
export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_PERSONAL: '/register/personal',
  REGISTER_VEHICLE_BANK: '/register/vehicle-bank',
  REGISTER_DOCUMENTS: '/register/documents',
  STATUS: '/status',
};
```

**ليه ده مهم؟** لو غيّرت مسار، بتغيّره في مكان واحد بس. وأي `navigate()` في التطبيق بيستخدم `ROUTES.X` — فمفيش خطر تكتب مسار غلط ومتلاقيهوش غير وقت التشغيل.

---

### 4.4 نظام الترجمة

#### `src/i18n/copy.js` (170 سطر)

Object فيه مفتاحين: `ar` و `en`، وكل واحد فيه **83 مفتاح ترجمة**.
أول مفتاح في كل لغة هو `dir` (`'rtl'` للعربي، `'ltr'` للإنجليزي) — فاتجاه الصفحة جزء من بيانات الترجمة نفسها.

**تصنيف المفاتيح:**

| المجموعة    | أمثلة                                                                  |
| ----------- | ---------------------------------------------------------------------- |
| الدخول      | `login`, `welcome`, `portal`, `user`, `password`, `remember`, `forgot` |
| المعالج     | `registration`, `personal`, `vehicleBank`, `documents` + الـ hints     |
| شخصي        | `fullName`, `id`, `dob`, `nationality`, `phone`, `city`                |
| مركبة/بنك   | `plate`, `type`, `bank`, `iban`, `bankHint`                            |
| مستندات     | `identityDoc`, `license`, `vehicleDoc`, `personalPhoto`, `uploaded`    |
| الحالة      | `received`, `review`, `docsReview`, `contract` + الـ hints             |
| عناصر واجهة | `next`, `previous`, `save`, `saved`, `submit`, `waiting`               |
| نصوص عامة   | `copyright`, `msgLogistics`, `pdfOrImage`, `stepPrefix/Suffix`         |

**المفاتيح الأربعة الأخيرة دي مهمة** — دي اتضافت عشان تشيل نصوص كانت متحرقة (hard-coded) جوه المكونات:

- `stepPrefix` / `stepSuffix` → كان `` `الخطوة ${n} من 3` `` متحرق جوه الـ layout
- `copyright` → كان نص إنجليزي ثابت في صفحة الدخول
- `pdfOrImage` → كان `'PDF or image'` ثابت في صفحة المستندات
- `msgLogistics` → كان `'MSG LOGISTICS'` ثابت في صفحة الحالة

#### `src/i18n/LanguageContext.jsx` (39 سطر)

قلب نظام اللغة. بيعمل 3 حاجات:

**1. يقرأ اللغة المحفوظة عند البداية:**

```js
useState(() => localStorage.getItem('msg-lang') || 'ar');
```

الـ lazy initializer (الدالة جوه `useState`) معناها إن القراءة من `localStorage` بتحصل **مرة واحدة** بس، مش كل render.

**2. يزامن اللغة مع الـ DOM والتخزين:**

```js
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang; // <html lang="ar">
  document.documentElement.dir = copy[lang].dir; // <html dir="rtl">
}, [lang]);
```

كل ما اللغة تتغير، الـ 3 حاجات دي بتتحدّث تلقائيًا.

**3. يوفّر القيم للتطبيق عن طريق `useMemo`:**

```js
{
  (lang, setLang, toggleLang, t, dir);
}
```

- `t` = object الترجمة للغة الحالية (اختصار لـ `copy[lang]`)
- `dir` = `'rtl'` أو `'ltr'`
- `toggleLang` = بيبدّل بين العربي والإنجليزي

الـ `useMemo` بيمنع إنشاء object جديد كل render — وده بيقلل إعادة رسم المكونات اللي بتستهلك الـ context.

**الـ hook:**

```js
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
```

الـ guard ده مهم — لو استخدمت الـ hook بره الـ Provider، هتاخد رسالة خطأ واضحة بدل `undefined` غامض.

> **ملحوظة عن الـ lint warning:** الملف ده بيطلّع تحذير `react-refresh/only-export-components` لأنه بيصدّر مكون (`LanguageProvider`) + دالة (`useLanguage`) + قيمة افتراضية. ده **نمط قياسي ومقبول** لملفات الـ context — التحذير مش خطأ والـ lint بيعدّي بنجاح.

---

### 4.5 الدوال المساعدة

#### `src/utils/rtl.js` (18 سطر)

دالة واحدة:

```js
export function getArrow(lang) {
  return lang === 'ar' ? '←' : '→';
}
```

**ليه ملف كامل لدالة سطر واحد؟** لأن المنطق ده كان **مكرر 3 مرات** في الكود القديم (في `Login`, `FormActions`, `Documents`) كـ `{lang === 'ar' ? '←' : '→'}`. لو احتجت تغيّر شكل السهم، بتغيّره في مكان واحد.

---

### 4.6 المكونات (Components)

المكونات مقسومة لمجلدين حسب مستوى التعقيد:

#### `src/components/ui/` — مكونات عرض بسيطة

##### `BrandLogo.jsx` (8 سطور)

لوجو نصي (`MSG` + `HORIZONS`). بياخد prop واحد `compact` بيصغّر الحجم للاستخدام في الـ header.
فيه `aria-label="MSG Horizons"` لإمكانية الوصول (accessibility) لأنه نص مقسوم على عنصرين.

##### `LanguageButton.jsx` (10 سطور)

زر تبديل اللغة. بيقرأ من الـ context مباشرة عن طريق `useLanguage()` — **مش بياخد props**.
ده تحسين مهم: في الكود القديم كان بياخد `lang` و `setLang` كـ props وبيتم تمريرهم من مكون لمكون (prop drilling). دلوقتي بيوصل للـ context مباشرة.
النص بيعرض اللغة **التانية** (لو انت في العربي، الزر بيقول "English").

#### `src/components/shared/` — مكونات مركبة

##### `AppHeader.jsx` (31 سطر)

شريط التنقل العلوي. بياخد prop واحد `title`.
بيحتوي على: اللوجو (زر بيرجّع لصفحة الدخول) + العنوان + زر اللغة + زر الخروج.

**السبب في وجوده:** الـ header ده كان **مكرر بالكامل** في مكانين (`OnboardingLayout` و `CourierStatus`) بنفس الـ markup بالحرف. دلوقتي مكون واحد، والفرق الوحيد هو الـ `title`.

##### `FormActions.jsx` (22 سطر)

صف الأزرار أسفل كل فورم: "حفظ التقدم" + "السابق" + "التالي".
Props: `saved` (boolean يغيّر نص زر الحفظ)، `onSave`، `onBack`.
زر "التالي" نوعه `type="submit"` — فبيشغّل الـ `onSubmit` بتاع الفورم الأب، وده اللي بيخلي الـ HTML validation تشتغل قبل الانتقال.

---

### 4.7 الـ Layout

#### `src/layouts/OnboardingLayout.jsx` (49 سطر)

الهيكل المشترك للـ 3 خطوات. **أهم جزء فيه** هو استنتاج الخطوة الحالية من المسار:

```js
const STEP_PATHS = [
  ROUTES.REGISTER_PERSONAL,
  ROUTES.REGISTER_VEHICLE_BANK,
  ROUTES.REGISTER_DOCUMENTS,
];

const current = Math.max(0, STEP_PATHS.indexOf(location.pathname));
```

`indexOf` بيرجّع `-1` لو المسار مش موجود، و `Math.max(0, ...)` بيحوّلها لـ `0` كحماية.
يعني **مؤشر التقدم مصدره الوحيد هو الـ URL** — مفيش state منفصل يمكن يختلف عن المسار الفعلي.

**بيرسم:**

1. `<AppHeader title={t.registration} />`
2. مؤشر التقدم الأفقي — الخطوات المكتملة بتاخد class `done` وعلامة `✓`، والحالية والجاية بتاخد رقم
3. مقدمة الخطوة (العنوان + الشرح + عدّاد "الخطوة X من 3")
4. `<Outlet />` — المكان اللي فيه فورم الخطوة الحالية

---

### 4.8 الصفحات (Pages)

كل صفحة في مجلد لوحدها بملف `index.jsx` — فالاستيراد بيبقى `@/pages/Login` بدون تكرار الاسم.
ده كمان بيسهّل إضافة ملفات خاصة بالصفحة بعدين (زي `Login.test.jsx` أو `useLoginForm.js`) جوه نفس المجلد.

#### `pages/Login/index.jsx` (67 سطر)

صفحة الدخول. فيها كارت فيه: زر اللغة، اللوجو، عنوان ترحيبي، فورم (اسم المستخدم + كلمة المرور + تذكرني + نسيت كلمة المرور)، فاصل "أو"، وزر التسجيل كمندوب جديد.

**⚠️ نقطة مهمة — الدخول مش حقيقي:**

```js
const submit = (event) => {
  event.preventDefault();
  setLoading(true);
  window.setTimeout(() => navigate(ROUTES.REGISTER_PERSONAL), 350);
};
```

مفيش أي تحقق من البيانات. أي اسم مستخدم وكلمة مرور بيعدّوا. الـ 350 مللي ثانية مجرد محاكاة بصرية لحالة التحميل. **لازم يتغير عند ربط الـ backend.**

#### `pages/PersonalInfo/index.jsx` (67 سطر) — الخطوة 1

6 حقول في grid عمودين:

| الحقل         | النوع    | ملاحظات                                          |
| ------------- | -------- | ------------------------------------------------ |
| الاسم الكامل  | `text`   | مطلوب                                            |
| رقم الهوية    | `text`   | `inputMode="numeric"` (كيبورد أرقام في الموبايل) |
| تاريخ الميلاد | `date`   | منتقي تاريخ أصلي من المتصفح                      |
| الجنسية       | `select` | خيارين بس (سعودي / مصري) — **قائمة ناقصة**       |
| رقم الجوال    | `tel`    | مركب: `+966` ثابت + الحقل، والحاوية `dir="ltr"`  |
| المدينة       | `select` | 3 مدن (الرياض/جدة/الدمام) — **قائمة ناقصة**      |

عند الإرسال: `navigate(ROUTES.REGISTER_VEHICLE_BANK)`. **البيانات مش بتتحفظ في أي حاجة.**

#### `pages/VehicleBank/index.jsx` (70 سطر) — الخطوة 2

مقسومة لقسمين بعنوان لكل واحد (`.section-title`):

- **المركبة**: رقم اللوحة + النوع (سيدان / فان بضائع)
- **البنك**: اسم البنك (الراجحي / الرياض) + الآيبان (`dir="ltr"` لأن الآيبان دايمًا لاتيني)

تحت القسم البنكي فيه `helper-text` بينبّه إن الحساب لازم يكون باسم المندوب.

#### `pages/Documents/index.jsx` (60 سطر) — الخطوة 3

4 كروت رفع في grid. معرّفة كـ array عشان متكررش الـ markup:

```js
const docs = [
  ['identity', t.identityDoc, t.required],
  ['license', t.license, t.required],
  ['vehicle', t.vehicleDoc, t.required],
  ['photo', t.personalPhoto, t.optional], // الوحيد الاختياري
];
```

كل كارت `<label>` جواه `<input type="file">` مخفي بالـ CSS — فالضغط على أي مكان في الكارت بيفتح منتقي الملفات.
`accept=".pdf,.jpg,.jpeg,.png"` بيفلتر الأنواع، و `required` بيتحدد من قيمة العمود التالت.

**تتبع الحالة:**

```js
const [uploaded, setUploaded] = useState({});
const upload = (name) => setUploaded((current) => ({ ...current, [name]: true }));
```

**⚠️ مهم:** ده بيسجّل إن الملف "اترفع" (علامة `✓` + خلفية خضراء) بس **مش بيحفظ الملف نفسه**. مفيش رفع فعلي لأي سيرفر.

الفورم ده استخدم `.form-actions` مباشرة بدل `FormActions` لأن آخر خطوة مفيهاش زر "حفظ التقدم" — بس زر "السابق" و "إرسال الطلب".

#### `pages/CourierStatus/index.jsx` (72 سطر)

صفحة حالة الطلب. مفيهاش `OnboardingLayout` (مفيش مؤشر تقدم) — بتستخدم `AppHeader` مباشرة.

**⚠️ كل البيانات فيها ثابتة (mock):**

```js
const MOCK_APP_NUMBER = 'APP-2026-1043'; // رقم طلب ثابت
```

والمراحل الأربعة حالتها متحرقة في الكود:

```js
const stages = [
  [t.received, t.receivedHint, true], // ✓ مكتملة
  [t.review, t.reviewHint, true], // ✓ مكتملة
  [t.docsReview, t.docsReviewHint, true], // ◷ جارية
  [t.contract, t.contractHint, false], // 4 لسه
];
```

الأيقونات بتتحدد بالفهرس: `index < 2 ? '✓' : index === 2 ? '◷' : '4'` — يعني **دايمًا** نفس المنظر مهما حصل. لازم تتغير لبيانات حقيقية من API.

الصفحة فيها كمان: تنبيه أصفر (`notice-card`) وقسم معاينة العقد بزر معطّل (`disabled`).

---

## 5. نظام التنقل (Routing)

### قبل وبعد

الكود القديم كان بيستخدم **query params + history API يدوي**:

```js
// الطريقة القديمة (اتشالت)
function getScreen() {
  return new URLSearchParams(window.location.search).get('screen') || '01-login';
}
function navigate(screen) {
  window.history.pushState({}, '', `?screen=${screen}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
```

دلوقتي بقى `react-router-dom` بمسارات حقيقية.

### جدول المسارات

| المسار القديم                     | المسار الجديد            | المكون          |
| --------------------------------- | ------------------------ | --------------- |
| `?screen=01-login`                | `/login`                 | `Login`         |
| `?screen=02-personal-info`        | `/register/personal`     | `PersonalInfo`  |
| `?screen=03-vehicle-bank`         | `/register/vehicle-bank` | `VehicleBank`   |
| `?screen=07-document-upload`      | `/register/documents`    | `Documents`     |
| `?screen=08-application-contract` | `/status`                | `CourierStatus` |

> **⚠️ تنبيه للنشر (deployment):** لأن المسارات بقت حقيقية، السيرفر لازم يعمل **SPA fallback** — أي طلب لمسار مش موجود يرجّع `index.html`. غير كده، لو المستخدم عمل refresh على `/register/personal` هياخد 404.
>
> - **Nginx**: `try_files $uri $uri/ /index.html;`
> - **Netlify**: ملف `_redirects` فيه `/* /index.html 200`
> - **Vercel**: بيعملها تلقائيًا

---

## 6. نظام الترجمة (i18n)

### إزاي تضيف نص جديد

1. ضيف المفتاح في **الاتنين** `ar` و `en` في `src/i18n/copy.js`
2. استخدمه في المكون: `const { t } = useLanguage();` وبعدين `{t.myNewKey}`

### إزاي تضيف لغة تالتة

1. ضيف object جديد في `copy.js` (مثلًا `ur` للأردو) وحدد `dir` بتاعه
2. عدّل `toggleLang` في `LanguageContext.jsx` — دلوقتي هي **بتبدّل بين اتنين بس**:
   ```js
   toggleLang: () => setLang((current) => (current === 'ar' ? 'en' : 'ar'));
   ```
   لأكتر من لغتين، لازم تتحول لقائمة منسدلة بدل زر تبديل.

### قواعد مهمة

- **متكتبش أي نص ظاهر للمستخدم جوه المكونات** — كله من `copy.js`
- الاستثناءات الموجودة حاليًا وبقصد: أسماء البنوك (`Al Rajhi Bank`)، أسماء المدن (`Riyadh`)، ورقم الطلب الوهمي — دي أسماء علم أو بيانات مؤقتة هتيجي من API بعدين

---

## 7. نظام التنسيقات (CSS)

### الحالة قبل

ملف واحد `styles.css` فيه **6 سطور** بس، منهم 3 سطور مضغوطة (minified) طول الواحد آلاف الحروف. وكان فيه سطرين في الآخر بيعملوا **override** لقيم معرّفة فوق — يعني كود ميت ومكرر.

### الحالة بعد

مقسوم على 6 ملفات، وكل قاعدة (selector) موجودة **مرة واحدة** بقيمتها النهائية.

| الملف            | المحتوى                                                      |
| ---------------- | ------------------------------------------------------------ |
| `index.css`      | `@import` بس — بيحدد **ترتيب الـ cascade**                   |
| `base.css`       | `:root` tokens, reset, اللوجو, الأزرار, `.eyebrow`, `.muted` |
| `auth.css`       | صفحة الدخول + `.form-stack` (المشتركة)                       |
| `onboarding.css` | الشريط العلوي, مؤشر التقدم, `.courier-card`, الفورم, الرفع   |
| `status.css`     | `.status-card`, المؤشر العمودي, التنبيه, معاينة العقد        |
| `responsive.css` | `@media (max-width: 650px)` — **آخر واحد بالضرورة**          |

### ⚠️ الترتيب في `index.css` حساس

```css
@import url('...fonts.googleapis.com...'); /* لازم يكون الأول */
@import './base.css';
@import './auth.css';
@import './onboarding.css';
@import './status.css';
@import './responsive.css'; /* لازم يكون الأخير */
```

**متغيّرش الترتيب ده.** الـ `responsive.css` لازم يكون آخر واحد عشان الـ media queries تعمل override للقواعد الأساسية. وقواعد CSS بتفرض إن كل `@import` يكون قبل أي قاعدة تانية في الملف.

### قرار مقصود: `.form-stack` في `auth.css`

الكلاس `.form-stack` (شكل الحقول والـ labels) موجود في `auth.css` بس **مستخدم كمان في فورم خطوات التسجيل**. ده مقصود ومكتوب في تعليق أول الملف — لأن نقله لملف تاني كان هيغيّر ترتيب الـ cascade.

### التوكنز اللونية

| اللون     | الاستخدام                |
| --------- | ------------------------ |
| `#139a43` | الأخضر الأساسي (العلامة) |
| `#0f7f36` | الأخضر عند الـ hover     |
| `#1f2937` | لون النص الأساسي         |
| `#f3f4f6` | خلفية الصفحة             |
| `#e5e7eb` | حدود الكروت              |

### ملحوظة على الـ de-minification

عند فك الضغط، اتكشف إن قاعدة `.notice-card` كان لونها الكهرماني `#f0dcae` **متلغي** بـ override لاحق بـ `#e5e7eb` (رمادي). المظهر الفعلي كان رمادي — والملف الجديد بيحافظ على المظهر الفعلي (رمادي) مش النية الأصلية.
**لو كنت عايز الحد الكهرماني يرجع**، عدّل `status.css` وضيف `border-color: #f0dcae;` في `.notice-card`.

---

## 8. اللي اتعمل ✅

### إعادة الهيكلة

- [x] تفكيك `App.jsx` (كان 97 سطر مضغوط فيه **7 مكونات** + الترجمة + منطق التنقل) لـ **14 ملف** منظم
- [x] فك ضغط كل الكود لصيغة مقروءة بسطور عادية
- [x] فصل الصفحات في `pages/` (مجلد لكل صفحة)
- [x] فصل المكونات لمستويين: `ui/` (بسيط) و `shared/` (مركب)
- [x] إنشاء `layouts/` للهيكل المشترك
- [x] إنشاء مجلدات محضّرة: `hooks/` و `services/` (فاضية بـ `.gitkeep`)

### إصلاحات الإعداد

- [x] إنشاء `vite.config.js` — **شغّل `@vitejs/plugin-react` اللي كان مثبّت ومش مستخدم**، فبقى فيه React Fast Refresh حقيقي
- [x] إضافة alias `@` → `src` في Vite و `jsconfig.json`
- [x] إنشاء `.gitignore` — قبل كده **مكان مفيش**، وكان `node_modules/` و `dist/` و PDF بـ 33 ميجا كلهم رايحين للـ commit
- [x] نقل ملف الهوية (33MB) لـ `docs/` وتجاهله من git

### جودة الكود

- [x] إعداد ESLint 9 بـ flat config (react + hooks + refresh)
- [x] إعداد Prettier + `eslint-config-prettier` لمنع التعارض
- [x] إضافة أوامر `lint` و `format` في `package.json`
- [x] حل تعارض إصدارات: تثبيت `@eslint/js` على v9 (النسخة الأحدث v10 كانت بتطلب ESLint 10 والـ React plugins سقفها 9)

### التنقل

- [x] استبدال التنقل اليدوي (`?screen=` + `history.pushState`) بـ `react-router-dom`
- [x] تجميع كل المسارات في `constants/routes.js`
- [x] إضافة redirects: من `/` لـ `/login`، ومن أي مسار غلط لـ `/login`
- [x] Nested routes: `/register/*` جوه `OnboardingLayout`

### إزالة التكرار

- [x] `AppHeader` — الشريط العلوي كان **مكرر حرفيًا** في مكانين
- [x] `getArrow()` في `utils/rtl.js` — منطق السهم كان **مكرر 3 مرات**
- [x] `LanguageButton` بقى بياخد من الـ context بدل prop drilling
- [x] إخراج 4 نصوص متحرقة للترجمة (`stepPrefix/Suffix`, `copyright`, `pdfOrImage`, `msgLogistics`)
- [x] `MOCK_APP_NUMBER` بقى ثابت مسمّى بدل string وسط الـ JSX

### التنسيقات

- [x] فك ضغط `styles.css` (3 سطور مضغوطة) وتقسيمه لـ 6 ملفات
- [x] إزالة الـ overrides المكررة ودمج القيم النهائية في القواعد الأساسية
- [x] الحفاظ على ترتيب الـ cascade فالمظهر مطابق للأصل

### إدارة اللغة

- [x] إنشاء `LanguageContext` بديل عن تمرير `lang`/`setLang` من مكون لمكون
- [x] نقل side-effects (`localStorage`, `document.dir`, `document.lang`) للـ Provider
- [x] إضافة guard في `useLanguage()` برسالة خطأ واضحة

---

## 9. اللي متعملش ❌

### 1. مفيش backend أو API — الأهم

- ❌ **مفيش طبقة خدمات**: `src/services/` فاضي (فيه `.gitkeep` بس)
- ❌ **الدخول وهمي**: أي بيانات بتعدّي. مفيش تحقق، مفيش token، مفيش session
- ❌ **الفورم مش بتتقدّم لأي حاجة**: كل `onSubmit` بيعمل `navigate()` وبس
- ❌ **الملفات مش بتترفع**: بيتسجّل إن الملف "اتختار" في state محلي، والملف نفسه بيتجاهل تمامًا
- ❌ **بيانات صفحة الحالة كلها ثابتة**: رقم الطلب `APP-2026-1043` والمراحل الأربعة متحرقين في الكود

### 2. مفيش إدارة حالة (state management)

- ❌ **البيانات بتتفقد بين الخطوات**: كل صفحة عندها `useState` خاص بيها. لما تروح للخطوة اللي بعدها وترجع، **كل اللي كتبته يضيع**
- ❌ **`saved` بقى محلي لكل صفحة**: في الكود القديم كان مشترك بين الخطوات الـ 3. بعد فصل الصفحات لـ routes، كل صفحة بقى عندها `saved` خاص
- ❌ **زر "حفظ التقدم" مش بيحفظ حاجة**: بيغيّر نص الزر بس

**الحل المقترح لما تبدأ الربط:** Context مشترك للـ wizard (زي `OnboardingContext`) يمسك بيانات الخطوات الـ 3، أو مكتبة زي `react-hook-form` مع حفظ في `sessionStorage`.

### 3. مفيش تحقق حقيقي من البيانات (validation)

الموجود حاليًا **HTML5 بس**:

- `required` — بيمنع الإرسال لو فاضي
- `inputMode="numeric"` / `"tel"` — بيأثر على كيبورد الموبايل بس، **مش تحقق**
- `type="date"` — منتقي تاريخ من المتصفح
- `accept=".pdf,.jpg,.jpeg,.png"` — فلتر في نافذة اختيار الملف، **بيتخطى بسهولة**

**اللي ناقص:**

- ❌ تحقق من صيغة **رقم الهوية السعودية** (10 أرقام، تبدأ بـ 1 أو 2)
- ❌ تحقق من **الآيبان** (مفيش تأكيد إنه يبدأ بـ `SA` أو طوله 24 خانة أو checksum)
- ❌ تحقق من **رقم الجوال** (المفروض 9 أرقام تبدأ بـ 5)
- ❌ تحقق من **حجم الملف** — المستخدم يقدر يرفع ملف 500 ميجا
- ❌ تحقق من **نوع الملف الفعلي** (الـ `accept` مجرد تلميح للمتصفح)
- ❌ **مفيش رسائل خطأ** للمستخدم — لا تحت الحقول ولا في أي مكان

### 4. مفيش اختبارات

- ❌ مفيش test runner (لا Vitest ولا Jest)
- ❌ مفيش unit tests للمكونات
- ❌ مفيش integration tests لرحلة المستخدم
- ❌ مفيش E2E (لا Playwright ولا Cypress)

### 5. نواقص في تجربة المستخدم

- ❌ **مفيش favicon**: مجلد `public/` فاضي، فالمتصفح بياخد 404 على `/favicon.ico`
- ❌ **مفيش صفحة 404**: أي مسار غلط بيعمل redirect صامت لـ `/login` بدل ما يقول للمستخدم إن الصفحة مش موجودة
- ❌ **مفيش loading states** غير محاكاة الـ 350ms في الدخول
- ❌ **مفيش معالجة أخطاء**: لا Error Boundary ولا أي UI للأخطاء
- ❌ **"نسيت كلمة المرور؟" زر ميت**: `type="button"` بدون `onClick` خالص
- ❌ **"تذكرني" checkbox ميت**: مربوط بولا حاجة
- ❌ **مفيش تأكيد قبل الخروج**: زر الخروج بيروح لـ `/login` فورًا بدون سؤال، والبيانات تضيع

### 6. قوائم ناقصة

- ❌ **الجنسيات**: خيارين بس (سعودي، مصري)
- ❌ **المدن**: 3 بس (الرياض، جدة، الدمام)
- ❌ **البنوك**: اتنين بس (الراجحي، الرياض)
- ❌ **أنواع المركبات**: اتنين بس (سيدان، فان بضائع)
- ❌ القوائم دي **متحرقة في المكونات** — المفروض تيجي من API أو على الأقل من `constants/`

### 7. إمكانية الوصول (Accessibility)

- ❌ مفيش `aria-live` للإعلان عن تغيّر الخطوة لقارئات الشاشة
- ❌ مفيش ربط `aria-describedby` بين الحقول ونصوص المساعدة
- ❌ مؤشر التقدم مفيهوش `role="progressbar"` أو ما يكافئه
- ❌ الأيقونات النصية (`▣`, `▤`, `◷`, `↑`) مفيهاش بديل نصي لقارئات الشاشة
- ❌ مفيش تحكم في focus عند الانتقال بين الخطوات

### 8. أداء

- ❌ **مفيش code splitting**: كل التطبيق في bundle واحد (199 KB / 65 KB مضغوط). مفيش `React.lazy` ولا dynamic imports
- ❌ **الخطوط من CDN خارجي**: `@import` من Google Fonts بيعمل request إضافي ويحجب الرسم. الأفضل تنزيلهم محليًا أو `<link rel="preconnect">`

### 9. مجلدات محضّرة وفاضية

- ⚠️ `src/hooks/` — فيه `.gitkeep` مكتوب فيه `// Custom hooks go here`
- ⚠️ `src/services/` — فيه `.gitkeep` مكتوب فيه `// API and service calls go here`

دي **مقصودة** كمكان محدد مسبقًا للشغل الجاي، بس لازم تعرف إنها فاضية.

---

## 10. تحذير أمني عاجل 🔴

### مفتاح API مكشوف في `.vscode/mcp.json`

الملف ده فيه **Google API key بالنص الصريح**:

```json
{
  "servers": {
    "stitch": {
      "url": "https://stitch.googleapis.com/mcp",
      "headers": { "X-Goog-Api-Key": "AQ.Ab8RN6JlvbVfz..." }
    }
  }
}
```

**والمشكلة الأكبر:** المجلد `.vscode/` **مش موجود في `.gitignore`** — يعني أول commit المفتاح ده هيروح للـ repository. ولو الريبو عام أو حتى خاص وبعدين اتشيّر، المفتاح مكشوف. وحتى لو شيلته بعدين، هيفضل في تاريخ git.

### اللي مفروض تعمله فورًا

1. **بطّل المفتاح ده** (revoke) من Google Cloud Console واعمل واحد جديد
2. **ضيف `.vscode/` للـ `.gitignore`**:
   ```
   .vscode/
   ```
   أو لو عايز تشارك إعدادات معينة، استثنِ الملف الحساس بس:
   ```
   .vscode/*
   !.vscode/settings.json
   !.vscode/extensions.json
   ```
3. **انقل المفتاح لمتغير بيئة** بدل ما يكون في ملف

> **ملحوظة:** أنا **مغيّرتش** الـ `.gitignore` ولا لمست الملف ده — بلّغتك بس لأن ده قرارك. لو عايزني أعمله، قولي.

---

## 11. الأوامر المتاحة

```bash
npm install        # تثبيت الاعتماديات (لازم مرة واحدة في الأول)

npm run dev        # سيرفر التطوير (بيبدأ من 5173، ولو مشغول بياخد اللي بعده)
                   # فيه HMR + React Fast Refresh

npm run build      # بناء للإنتاج → مجلد dist/
npm run preview    # معاينة نسخة الإنتاج محليًا

npm run lint       # فحص ESLint
npm run format     # تنسيق كل الملفات بـ Prettier
```

---

## 12. الحالة الحالية للجودة

آخر تحقق (كل الأوامر عدّت بنجاح):

| الفحص           | النتيجة | التفاصيل                                                               |
| --------------- | ------- | ---------------------------------------------------------------------- |
| `npm run build` | ✅      | 53 module · CSS 8.54 KB (2.42 gz) · JS 199.67 KB (65.32 gz) · ~1 ثانية |
| `npm run lint`  | ✅      | **0 أخطاء** · تحذير واحد (نمط الـ context الطبيعي)                     |
| Prettier        | ✅      | كل الملفات متوافقة مع قواعد التنسيق                                    |
| `npm run dev`   | ✅      | السيرفر شغال · Fast Refresh مفعّل · المسارات العميقة 200               |

**التحذير الوحيد:**

```
src/i18n/LanguageContext.jsx:31 — react-refresh/only-export-components
"Fast refresh only works when a file only exports components"
```

ده **مقبول ومقصود** — ملف الـ context لازم يصدّر الـ Provider والـ hook مع بعض. تقسيمهم لملفين مكان هيعقّد الكود بدون فايدة حقيقية.

---

## خلاصة للمطور الجديد

**عايز تفهم المشروع؟** اقرأ بالترتيب ده:

1. `src/constants/routes.js` — إيه الصفحات الموجودة
2. `src/App.jsx` — إزاي بتترابط
3. `src/i18n/LanguageContext.jsx` — إزاي اللغة بتشتغل
4. `src/layouts/OnboardingLayout.jsx` — إزاي المعالج بيعرف خطوته
5. أي صفحة من `src/pages/`

**عايز تضيف صفحة؟**

1. ضيف مسارها في `constants/routes.js`
2. اعمل مجلد جديد في `pages/` بملف `index.jsx`
3. ضيف `<Route>` في `App.jsx`
4. ضيف نصوصها في `i18n/copy.js` (في **اللغتين**)

**عايز تربط الـ backend؟** ابدأ من:

1. `src/services/` — اعمل ملفات الطلبات هنا
2. Context مشترك للـ wizard عشان البيانات متضيعش بين الخطوات
3. `pages/Login/index.jsx` — شيل الـ `setTimeout` الوهمي وحط استدعاء حقيقي
4. `pages/CourierStatus/index.jsx` — شيل `MOCK_APP_NUMBER` ومصفوفة `stages` الثابتة
