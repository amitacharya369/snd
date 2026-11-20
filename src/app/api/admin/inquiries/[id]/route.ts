import { NextRequest, NextResponse } from 'next/server';
import { updateInquiry, deleteInquiry } from '../../../../../lib/storage';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = updateInquiry(id, {
      status: body.status,
      internalNotes: body.internalNotes,
      assignedTo: body.assignedTo,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (err) {
    console.error('Error updating inquiry:', err);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteInquiry(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
