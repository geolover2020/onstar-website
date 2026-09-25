# نشر موقع OnStar على Netlify

## إعدادات Netlify

- Branch to deploy: `main`
- Base directory: اتركه فارغًا
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions` (يمكن تركها كما هي، لا توجد Functions حاليًا)

## الرفع إلى GitHub

1. افتح مستودع `onstar-website`.
2. ارفع **محتويات هذا المجلد** إلى جذر المستودع، وليس المجلد الخارجي نفسه.
3. بعد اكتمال الرفع، Netlify سيقرأ `package.json` و `netlify.toml`.
4. شغّل Deploy.

## التطوير محليًا

```bash
npm install
npm run dev
```

## صور التطبيق الحقيقية

ضع Screenshots داخل:

`public/screenshots/`

ثم يمكن استبدال الـ Mockup التجريبي بصور التطبيق لاحقًا.

## بيانات الشروحات

جميع فيديوهات الشرح موجودة في:

`src/data/tutorials.js`

ويمكن إضافة فيديو جديد بإضافة عنصر جديد إلى القائمة.

## روابط التواصل

موجودة في:

`src/data/content.js`

## ملاحظة

المشروع لا يحتوي على السعر أو الحساب البنكي أو بيانات الإيداع.
