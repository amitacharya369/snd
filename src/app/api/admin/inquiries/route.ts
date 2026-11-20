import { NextRequest, NextResponse } from 'next/server';
import { getInquiries, InquiryStatus, InquirySource } from '../../../../lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') as InquiryStatus | null;
    const sourceFilter = searchParams.get('source') as InquirySource | null;
    const search = searchParams.get('search')?.toLowerCase() || '';

    let items = getInquiries();

    if (statusFilter && statusFilter !== ('ALL' as unknown)) {
      items = items.filter((item) => item.status === statusFilter);
    }

    if (sourceFilter && sourceFilter !== ('ALL' as unknown)) {
      items = items.filter((item) => item.source === sourceFilter);
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.fullName.toLowerCase().includes(search) ||
          item.company.toLowerCase().includes(search) ||
          item.email.toLowerCase().includes(search) ||
          item.projectType.toLowerCase().includes(search) ||
          item.message.toLowerCase().includes(search) ||
          item.id.toLowerCase().includes(search)
      );
    }

    // Analytics summary
    const all = getInquiries();
    const stats = {
      total: all.length,
      new: all.filter((i) => i.status === 'NEW').length,
      inReview: all.filter((i) => i.status === 'IN_REVIEW').length,
      forwardedToSales: all.filter((i) => i.status === 'FORWARDED_TO_SALES').length,
      responded: all.filter((i) => i.status === 'RESPONDED').length,
      won: all.filter((i) => i.status === 'WON').length,
      rejected: all.filter((i) => i.status === 'REJECTED').length,
      bySource: {
        quoteRequests: all.filter((i) => i.source === 'Quote Request').length,
        contactForms: all.filter((i) => i.source === 'Contact Form').length,
        chatbotLeads: all.filter((i) => i.source === 'AI Chatbot').length,
      },
    };

    return NextResponse.json({
      inquiries: items,
      stats,
    });
  } catch (err) {
    console.error('Error fetching admin inquiries:', err);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}
