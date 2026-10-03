# Website Stage 2A

- صفحة `/register` تنشئ العميل عبر `/api/customer/register`.
- Netlify proxy يرسل الطلب إلى `https://vpn.onstareh.com/v2/customer-api/register`.
- إذا SMTP غير مفعّل، تظهر رسالة صحيحة بدل الادعاء بأن البريد أُرسل.
- لا تنشر قبل أن يعطي مثبت السيرفر: `PUBLIC_CUSTOMER_API=READY`.
