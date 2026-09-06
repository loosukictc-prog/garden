import { NextRequest, NextResponse } from 'next/server';

interface BookingData {
  fullName: string;
  phone: string;
  email: string;
  eventType: string;
  package: string;
  guests: number;
  date: string;
  time: string;
  specialRequests?: string;
  decorations?: boolean;
  catering?: boolean;
  photography?: boolean;
  bookingReference: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: BookingData = await request.json();

    // Format the message
    const message = `*New Booking Request* 📋\n\n*Reference:* ${data.bookingReference}\n*Name:* ${data.fullName}\n*Email:* ${data.email}\n*Phone:* ${data.phone}\n*Event Type:* ${data.eventType}\n*Package:* ${data.package}\n*Number of Guests:* ${data.guests}\n*Preferred Date:* ${data.date}\n*Preferred Time:* ${data.time}\n${data.specialRequests ? `*Special Requests:* ${data.specialRequests}\n` : ""}\n*Add-ons:*\n- Decorations: ${data.decorations ? "Yes ✓" : "No"}\n- Catering: ${data.catering ? "Yes ✓" : "No"}\n- Photography: ${data.photography ? "Yes ✓" : "No"}`;

    // Get credentials from environment variables
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const recipientPhone = process.env.WHATSAPP_RECIPIENT_PHONE || "254757692495";

    if (!phoneNumberId || !accessToken) {
      console.error('Missing WhatsApp credentials');
      return NextResponse.json(
        { 
          success: false, 
          message: 'WhatsApp API credentials not configured. Booking saved locally.',
          reference: data.bookingReference
        },
        { status: 200 }
      );
    }

    // Send message via WhatsApp Cloud API
    const response = await fetch(
      `https://graph.instagram.com/v20.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipientPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        }),
      }
    );

    const result = await response.json();

    if (response.ok && result.messages && result.messages[0]?.id) {
      return NextResponse.json(
        {
          success: true,
          message: 'Booking sent to WhatsApp successfully',
          reference: data.bookingReference,
          messageId: result.messages[0].id,
        },
        { status: 200 }
      );
    } else {
      console.error('WhatsApp API Error:', result);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send via WhatsApp API. Booking saved.',
          reference: data.bookingReference,
          error: result.error?.message || 'Unknown error',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Server error processing booking',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
