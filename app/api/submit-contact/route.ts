import { NextRequest, NextResponse } from 'next/server';
import { sendContactConfirmation, notifyAdminOfContact } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Send confirmation to the user
    const userResult = await sendContactConfirmation(name, email);

    // Notify admin
    const adminResult = await notifyAdminOfContact(name, email, message);

    const success = userResult.success && adminResult.success;

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}