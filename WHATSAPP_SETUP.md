# WhatsApp Business API Setup Guide for Berakhah Gardens

## Overview
The booking form now sends bookings automatically to your WhatsApp without requiring the user to open WhatsApp manually.

## Required Setup Steps

### 1. Get WhatsApp Business API Credentials

You need:
- **Phone Number ID** - Your WhatsApp Business phone number registered with Meta
- **Access Token** - Bearer token from Meta App

#### Steps to get credentials:

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create or select your app
3. Navigate to **WhatsApp > Getting started**
4. Register a phone number (or use existing)
5. Get your **Phone Number ID**
6. Go to **Settings > Accounts** to get your **Access Token**

### 2. Set Environment Variables

Create or update `.env.local` in your project root:

```
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_RECIPIENT_PHONE=254757692495
```

Example:
```
WHATSAPP_PHONE_NUMBER_ID=102345678901234
WHATSAPP_ACCESS_TOKEN=EAABa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5
WHATSAPP_RECIPIENT_PHONE=254757692495
```

### 3. Deploy to Production

When deploying to production (e.g., Vercel, Firebase, etc.), add these environment variables in your hosting platform's dashboard.

For Vercel:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add the three variables above

## How It Works

1. Customer fills booking form
2. Clicks "Complete Booking"
3. Backend API (`/api/send-booking`) processes the request
4. Message is sent directly to your WhatsApp via Meta's Cloud API
5. You receive the booking notification instantly
6. Customer sees confirmation message

## Testing Without API Setup

If you haven't set up the WhatsApp Business API yet, the system will:
- Still generate booking reference
- Show success message to customer
- Log that it's waiting for API credentials
- Save booking locally for manual follow-up

## Troubleshooting

### Message not received
- Verify Phone Number ID is correct
- Check Access Token is valid (tokens can expire)
- Ensure phone number has WhatsApp Business approved
- Check browser console for error messages

### Getting updated Access Token
- Go to Meta Developers Dashboard
- Select your app
- Navigate to Settings > Accounts
- Generate new token if needed

## Future Enhancements

- SMS fallback if WhatsApp unavailable
- Booking confirmation to customer email
- WhatsApp confirmation template messages
- Automated status updates via WhatsApp

## Support

For issues with Meta's WhatsApp API, visit:
- [WhatsApp Business Platform Docs](https://developers.facebook.com/docs/whatsapp)
- [Meta Business Help Center](https://www.facebook.com/business/help)
