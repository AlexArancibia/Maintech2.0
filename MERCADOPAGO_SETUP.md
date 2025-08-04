# MercadoPago Integration Setup

## Environment Variables

Add these to your `.env.local`:

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Webhook Configuration

1. Go to MercadoPago Dashboard
2. Navigate to Webhooks section
3. Add webhook URL: `https://your-domain.com/api/mercadopago`
4. Select events: `payment.created`, `payment.updated`

## Files Structure

```
app/
├── api/
│   ├── mercadopago/route.ts              # Webhook handler
│   └── payment/
│       ├── create-preference/route.ts    # Create payment preference
│       └── redirect-mercadopago/route.ts # Redirect to MercadoPago
├── (general)/
│   ├── checkout/[courseId]/page.tsx      # Checkout page
│   └── payment-success/page.tsx          # Success page
lib/
└── mercadopago.ts                        # MercadoPago configuration
```

## How it Works

1. User selects MercadoPago payment in checkout
2. Frontend calls `/api/payment/redirect-mercadopago`
3. API creates payment preference and returns redirect URL
4. User is redirected to MercadoPago
5. After payment, user returns to `/payment-success`
6. Webhook `/api/mercadopago` processes payment and links course to user
7. User is redirected to dashboard

## Notes

- Test accounts may have limitations with webhook processing
- Use production accounts for full functionality
- Webhook retry mechanism handles timing issues 