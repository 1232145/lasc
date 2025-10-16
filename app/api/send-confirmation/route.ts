import { NextRequest, NextResponse } from 'next/server';
import { sendRSVPConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, eventTitle, eventDate } = await request.json();

    const result = await sendRSVPConfirmation(name, email, eventTitle, eventDate);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in send-confirmation API:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
