import { NextRequest, NextResponse } from 'next/server';
import { sendBulkEventEmail } from '@/lib/email';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { eventId, subject, body } = await request.json();

    if (!eventId || !subject || !body) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: eventId, subject, and body are required' },
        { status: 400 }
      );
    }

    // Fetch all RSVPs for this event
    const { data: rsvps, error: rsvpError } = await supabase
      .from('rsvps')
      .select('name, email')
      .eq('event_id', eventId);

    if (rsvpError) {
      console.error('Error fetching RSVPs:', rsvpError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch RSVPs' },
        { status: 500 }
      );
    }

    if (!rsvps || rsvps.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No RSVPs found for this event' },
        { status: 404 }
      );
    }

    // Deduplicate RSVPs by email (case-insensitive) to prevent sending duplicate emails
    const uniqueRSVPs = Array.from(
      new Map(
        rsvps.map(rsvp => [
          rsvp.email.toLowerCase().trim(),
          { name: rsvp.name, email: rsvp.email.toLowerCase().trim() }
        ])
      ).values()
    );

    // Send emails to unique RSVPs only
    const result = await sendBulkEventEmail(uniqueRSVPs, subject, body);

    // Destructure to exclude 'success' to avoid overwriting
    const { success: _, ...resultData } = result;

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully sent ${result.successCount} email(s)`,
        ...resultData
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Sent ${result.successCount} email(s), ${result.failureCount} failed`,
        ...resultData
      }, { status: 207 }); // 207 Multi-Status
    }
  } catch (error) {
    console.error('Error in send-event-email API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}

