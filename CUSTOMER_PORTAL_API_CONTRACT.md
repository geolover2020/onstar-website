# OnStar Customer Portal — API Contract (Stage 1)

الموقع العام لا يملك صلاحيات إدارة مالية أو تشغيل VPN مباشرة. جميع القرارات الحساسة تبقى داخل السيرفر ولوحة الإدارة.

## المسار العام
الواجهة تستخدم `/api/customer/*` عبر Netlify reverse proxy إلى `https://vpn.onstareh.com/v2/customer-api/*`.

## Session
- Cookie آمن HttpOnly + Secure + SameSite=Lax.
- لا يتم تخزين Token داخل localStorage.
- السيرفر يتحقق من Origin/Host للطلبات التي تغيّر بيانات.

## Endpoints المطلوبة

### POST `/register`
Body:
```json
{
  "full_name":"...",
  "email":"...",
  "phone":"...",
  "network_name":"...",
  "password":"..."
}
```
ينشئ Customer/User فقط. لا ينشئ خدمة فعالة.

### POST `/login`
Body: `{ "email":"...", "password":"..." }`
ينشئ Session Cookie.

### POST `/logout`
ينهي الجلسة.

### GET `/me`
يرجع صورة مجمعة آمنة لحساب العميل فقط:
```json
{
  "customer":{"id":1,"full_name":"...","network_name":"...","email":"...","email_verified":true},
  "service":{"status":"inactive","suspend_at":null},
  "financial":{"status":"no_invoice","balance_due":0},
  "subscription":{"plan_name":null,"paid_period_start":null,"paid_period_end":null},
  "router":{"id":null,"connected":false,"serial":null},
  "trial":{"status":"not_requested","default_days":5,"used":false,"can_request":false,"ends_at":null},
  "payment_confirmations":[]
}
```

### POST `/trial/request`
لا يبدأ التجربة. ينشئ Trial Request بحالة `pending_admin` فقط.
شروط السيرفر قبل قبول الطلب:
- البريد Verified.
- يوجد MikroTik مرتبط وSerial verified من API/RouterOS وليس إدخال يدوي.
- Email لم يستخدم trial سابقًا.
- Serial لم يستخدم trial سابقًا.
- لا يوجد طلب pending أو trial active.

### POST `/payment-confirmations`
Multipart form-data:
- depositor_name
- transaction_number
- amount
- deposit_date
- message (optional)
- receipt (optional image/PDF)

ينشئ طلب مراجعة فقط. لا يغيّر invoice إلى paid ولا يفعّل الخدمة.

## مبادئ مالية إلزامية
- إنشاء حساب العميل قبل الدفع مسموح.
- VPN يمكن Provisioning له وهو disabled، لكن التفعيل الفعلي قرار Admin.
- Trial default = 5 days وتبدأ من approved_at وليس requested_at.
- Trial لا تخصم من paid subscription.
- إذا تم اعتماد الدفع أثناء Trial يبدأ paid_period بعد trial_end.
- التأخر: due_date -> grace -> suspend_at.
- الإدارة تستطيع تمديد grace أو تسجيل Credit/آجل دون اعتبار الفاتورة Paid.
- عند Suspension لا يحذف VPN username/IP/host/ports/router data.
- Payment Confirmation من العميل لا يساوي Payment محاسبي إلا بعد Admin approval.
