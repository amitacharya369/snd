import fs from 'fs';
import path from 'path';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'Executive Administrator' | 'Senior Estimator' | 'Operations Director' | 'Finance & Compliance' | 'Design & Engineering' | 'Project Coordinator';
  passwordPlain: string; // Plaintext for easy review/switch by administrator
  createdAt: string;
  lastLogin?: string;
  active: boolean;
  avatarUrl?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Read-only filesystem in serverless environments (e.g. Vercel)
  }
}

export function getDefaultAdminUsers(): AdminUser[] {
  return [
    {
      id: 'USR-101',
      username: 'admin',
      name: 'Haas Khalfan',
      email: 'haas@signsanddecal.com',
      role: 'Executive Administrator',
      passwordPlain: 'snd2026!',
      createdAt: '2026-01-01T08:00:00.000Z',
      lastLogin: new Date().toISOString(),
      active: true,
      avatarUrl: '/images/team/haas-khalfan.png',
    },
    {
      id: 'USR-102',
      username: 'carlos',
      name: 'Carlos Colon',
      email: 'carlos@signsanddecal.com',
      role: 'Senior Estimator',
      passwordPlain: 'estimating2026',
      createdAt: '2026-01-15T09:00:00.000Z',
      lastLogin: new Date(Date.now() - 3600000 * 2).toISOString(),
      active: true,
      avatarUrl: '/images/team/carlos-colon.png',
    },
    {
      id: 'USR-103',
      username: 'abbas',
      name: 'Abbas Khalfan',
      email: 'abbas@signsanddecal.com',
      role: 'Operations Director',
      passwordPlain: 'plant410',
      createdAt: '2026-01-20T10:00:00.000Z',
      lastLogin: new Date(Date.now() - 3600000 * 24).toISOString(),
      active: true,
      avatarUrl: '/images/team/abbas-khalfan.png',
    },
    {
      id: 'USR-104',
      username: 'clara',
      name: 'Clara Liranzo',
      email: 'clara@signsanddecal.com',
      role: 'Finance & Compliance',
      passwordPlain: 'compliance2026',
      createdAt: '2026-02-01T11:00:00.000Z',
      lastLogin: new Date(Date.now() - 3600000 * 48).toISOString(),
      active: true,
      avatarUrl: '/images/team/clara-liranzo.png',
    },
    {
      id: 'USR-105',
      username: 'piotr',
      name: 'Piotr Bartyzel',
      email: 'piotr@signsanddecal.com',
      role: 'Design & Engineering',
      passwordPlain: 'bimdesign2026',
      createdAt: '2026-02-15T12:00:00.000Z',
      lastLogin: new Date(Date.now() - 3600000 * 72).toISOString(),
      active: true,
      avatarUrl: '/images/team/piotr-bartyzel.png',
    },
    {
      id: 'USR-106',
      username: 'sandra',
      name: 'Sandra',
      email: 'sandra@signsanddecal.com',
      role: 'Project Coordinator',
      passwordPlain: 'coordinator2026',
      createdAt: '2026-03-01T14:00:00.000Z',
      lastLogin: new Date().toISOString(),
      active: true,
      avatarUrl: '/images/team/sandra.png',
    },
  ];
}

export function getAdminUsers(): AdminUser[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    const defaults = getDefaultAdminUsers();
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaults, null, 2), 'utf-8');
    } catch {
      // Ignored in read-only environment
    }
    return defaults;
  }
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading users.json, returning defaults:', err);
    return getDefaultAdminUsers();
  }
}

export function saveAdminUsers(users: AdminUser[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist users to disk (read-only environment):', err);
  }
}

export function authenticateAdminUser(
  usernameOrEmail: string,
  passwordPlain: string
): AdminUser | null {
  const users = getAdminUsers();
  const target = users.find(
    (u) =>
      u.active &&
      (u.username.toLowerCase() === usernameOrEmail.trim().toLowerCase() ||
        u.email.toLowerCase() === usernameOrEmail.trim().toLowerCase()) &&
      u.passwordPlain === passwordPlain
  );

  if (target) {
    target.lastLogin = new Date().toISOString();
    saveAdminUsers(users);
    return target;
  }

  return null;
}

export function createAdminUser(userData: Omit<AdminUser, 'id' | 'createdAt'>): AdminUser {
  const users = getAdminUsers();
  const newId = `USR-${Math.floor(100 + Math.random() * 900)}`;
  const newUser: AdminUser = {
    ...userData,
    id: newId,
    createdAt: new Date().toISOString(),
    active: userData.active !== undefined ? userData.active : true,
  };
  users.push(newUser);
  saveAdminUsers(users);
  return newUser;
}

export function updateAdminUser(id: string, updates: Partial<AdminUser>): AdminUser | null {
  const users = getAdminUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
  };
  saveAdminUsers(users);
  return users[index];
}

export function deleteAdminUser(id: string): boolean {
  const users = getAdminUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  saveAdminUsers(filtered);
  return true;
}
