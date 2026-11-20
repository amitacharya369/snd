import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../../../../lib/auth';

export async function GET() {
  try {
    const users = getAdminUsers();
    return NextResponse.json({ users });
  } catch (err) {
    console.error('Failed to get users:', err);
    return NextResponse.json({ error: 'Failed to retrieve admin users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, name, email, role, passwordPlain } = body;

    if (!username || !name || !email || !passwordPlain) {
      return NextResponse.json(
        { error: 'Username, name, email, and password are required' },
        { status: 400 }
      );
    }

    const newUser = createAdminUser({
      username: username.trim().toLowerCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || 'Senior Estimator',
      passwordPlain: passwordPlain.trim(),
      active: true,
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (err) {
    console.error('Failed to create user:', err);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updated = updateAdminUser(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error('Failed to update user:', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const success = deleteAdminUser(id);
    if (!success) {
      return NextResponse.json({ error: 'User not found or cannot delete' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to delete user:', err);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
