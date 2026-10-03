# OnStar Website — Customer Portal Stage 1

هذه المرحلة تضيف طبقة الواجهة العامة فقط لمنظومة الاشتراكات والدخول عن بُعد، مع إبقاء القرارات الحساسة داخل سيرفر OnStar.

## ما تمت إضافته
- صفحة `/remote-access` لشرح الخدمة وآلية التسجيل والتجربة والدفع.
- صفحة `/register` لإنشاء حساب مشترك قبل الدفع.
- صفحة `/customer-login` لتسجيل دخول المشترك.
- صفحة `/account` كبداية للوحة المشترك.
- نموذج طلب تجربة مجانية لا يبدأ التجربة تلقائيًا.
- نموذج إرسال تأكيد دفع الكريمي: اسم المودع، رقم العملية، المبلغ، التاريخ، الرسالة، والإيصال الاختياري.
- إظهار رقم حساب الكريمي السعودي `3027149935` كوسيلة الدفع الوحيدة.
- تصميم حالة الخدمة/المحاسبة/الاشتراك/MikroTik داخل حساب العميل.
- عدم قبول Serial من العميل في الواجهة؛ ينتظر Serial الذي يقرأه السيرفر من MikroTik.
- API client يستخدم Session Cookie وليس localStorage.
- Netlify reverse proxy لمسار `/api/customer/*` نحو السيرفر.
- عقد API في `CUSTOMER_PORTAL_API_CONTRACT.md` لتطوير Backend دون خلطه بواجهة الإدارة الحالية.

## مهم قبل النشر
لا تنشر هذه النسخة للإنتاج قبل إضافة Backend `customer-api` إلى السيرفر، لأن صفحات التسجيل والدخول تحتاج endpoints الجديدة.

## الخطوة التالية
بناء Stage السيرفر:
1. جداول customers/customer_users/subscriptions/invoices/payments/payment_confirmations/trials/ledger.
2. التحقق من البريد.
3. ربط العميل بـ MikroTik الحالي أو حساب جديد.
4. قراءة Serial Number من MikroTik API.
5. Admin approval للتجربة والدفع.
6. Scheduler للمهلة والإيقاف والآجل.
7. Endpoints التي يطلبها الموقع في `CUSTOMER_PORTAL_API_CONTRACT.md`.
