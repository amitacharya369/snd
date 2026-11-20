import { NextRequest, NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig } from '../../../../lib/storage';

export async function GET() {
  try {
    const config = getSiteConfig();
    return NextResponse.json(config);
  } catch (err) {
    console.error('Error fetching admin config:', err);
    return NextResponse.json({ error: 'Failed to read site configuration' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = saveSiteConfig(body);
    return NextResponse.json({ success: true, config: updated });
  } catch (err) {
    console.error('Error saving admin config:', err);
    return NextResponse.json({ error: 'Failed to save site configuration' }, { status: 500 });
  }
}
