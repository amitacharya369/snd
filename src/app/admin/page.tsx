'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Inbox,
  Settings,
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
  Trophy,
  ArrowRight,
  ExternalLink,
  Save,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  MessageSquare,
  FileText,
  User,
  ShieldCheck,
  AlertCircle,
  HardHat,
  ChevronRight,
  Trash2,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  UserPlus,
  LogOut,
  Users,
  ShieldAlert,
  Copy,
  Check,
  CornerDownRight,
  Laptop,
  Globe,
} from 'lucide-react';
import { Inquiry, InquiryStatus, InquirySource, SiteConfig } from '../../lib/storage';
import { AdminUser } from '../../lib/auth';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'settings' | 'users' | 'analytics'>('inquiries');

  // Authentication & Gateway State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Users Management State
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    username: '',
    email: '',
    role: 'Senior Estimator' as AdminUser['role'],
    passwordPlain: '',
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editPasswordValue, setEditPasswordValue] = useState('');
  const [userSuccessMessage, setUserSuccessMessage] = useState('');

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    new: number;
    inReview: number;
    forwardedToSales: number;
    responded: number;
    won: number;
    rejected: number;
    bySource: { quoteRequests: number; contactForms: number; chatbotLeads: number };
  }>({
    total: 0,
    new: 0,
    inReview: 0,
    forwardedToSales: 0,
    responded: 0,
    won: 0,
    rejected: 0,
    bySource: { quoteRequests: 0, contactForms: 0, chatbotLeads: 0 },
  });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);

  // Settings State
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSuccessMessage, setConfigSuccessMessage] = useState('');

  // Outlook Official Email Reply Composer State
  const [replyModalInquiry, setReplyModalInquiry] = useState<Inquiry | null>(null);
  const [replyRecipient, setReplyRecipient] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [replyCopied, setReplyCopied] = useState(false);
  const [autoMarkResponded, setAutoMarkResponded] = useState(true);

  // Check saved session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSession = localStorage.getItem('snd_admin_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (parsed?.user) {
            setCurrentUser(parsed.user);
          }
        } catch (err) {
          console.error('Invalid session:', err);
        }
      }
    }
  }, []);

  // Fetch Inquiries
  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (sourceFilter !== 'ALL') params.set('source', sourceFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
      const data = await res.json();
      if (data.inquiries) {
        setInquiries(data.inquiries);
        setStats(data.stats);
        if (selectedInquiry) {
          const updatedSelected = data.inquiries.find((i: Inquiry) => i.id === selectedInquiry.id);
          if (updatedSelected) setSelectedInquiry(updatedSelected);
        }
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  // Fetch Site Settings Config
  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/config');
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error('Failed to load config:', err);
    }
  };

  // Fetch Admin Users List
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsersList(data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchInquiries();
      fetchConfig();
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchInquiries();
    }
  }, [statusFilter, sourceFilter]);

  // Handle Login via Gateway
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) return;
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'snd_admin_session',
            JSON.stringify({ user: data.user, loginAt: new Date().toISOString() })
          );
        }
      } else {
        setLoginError(data.error || 'Invalid credentials. Please verify username and password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Authentication service connection interrupted');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Instant one-click login for quick staff switcher
  const handleQuickStaffLogin = async (username: string, passwordPlain: string) => {
    setLoginUsername(username);
    setLoginPassword(passwordPlain);
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: passwordPlain }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'snd_admin_session',
            JSON.stringify({ user: data.user, loginAt: new Date().toISOString() })
          );
        }
      } else {
        setLoginError(data.error || 'Failed to authenticate selected persona.');
      }
    } catch (err) {
      console.error('Quick staff login error:', err);
      setLoginError('Authentication service connection interrupted');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Switch or Login as another user
  const handleSwitchUser = (user: AdminUser) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'snd_admin_session',
        JSON.stringify({ user, loginAt: new Date().toISOString() })
      );
    }
    setUserSuccessMessage(`Switched session to ${user.name} (${user.role})`);
    setTimeout(() => setUserSuccessMessage(''), 4000);
  };

  // Logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('snd_admin_session');
    }
    setCurrentUser(null);
    setLoginPassword('');
    setActiveTab('inquiries');
  };

  // Toggle Password Reveal in Table
  const toggleRevealPassword = (userId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Save New Password for a User
  const handleSavePasswordChange = async (userId: string) => {
    if (!editPasswordValue.trim()) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, passwordPlain: editPasswordValue.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setUserSuccessMessage('Password successfully updated!');
        setEditingUserId(null);
        setEditPasswordValue('');
        fetchUsers();
        setTimeout(() => setUserSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error('Failed to change password:', err);
    }
  };

  // Create New User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.username || !newUserData.passwordPlain) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      });
      const data = await res.json();
      if (data.success) {
        setUserSuccessMessage(`Account created for ${newUserData.name}!`);
        setShowAddUserModal(false);
        setNewUserData({
          name: '',
          username: '',
          email: '',
          role: 'Senior Estimator',
          passwordPlain: '',
        });
        fetchUsers();
        setTimeout(() => setUserSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === 'USR-101') {
      alert('The primary Executive Administrator account (USR-101) cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to permanently revoke access for ${userName}?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUserSuccessMessage(`Revoked access for ${userName}`);
        fetchUsers();
        setTimeout(() => setUserSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  // Update Status or Notes of an Inquiry
  const handleUpdateInquiryStatus = async (id: string, newStatus: InquiryStatus) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchInquiries();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        fetchInquiries();
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry record?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSelectedInquiry(null);
        fetchInquiries();
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  // Open Official Outlook Reply Composer Modal
  const handleOpenReplyModal = (inq: Inquiry) => {
    setReplyModalInquiry(inq);
    setReplyRecipient(inq.email);
    setReplySubject(`Signs & Decal Corp. [Ref: ${inq.id}] — Response to Your Project Inquiry`);

    // Clean user query quote text
    const clientQueryText =
      inq.message?.trim() ||
      (inq.chatSummary ? 'Architectural project consultation' : inq.projectType) ||
      'your project inquiry';

    const senderFirstName = inq.fullName?.split(' ')[0] || inq.fullName || 'there';

    // Tailored official pre-filled response body
    const initialBody = `Hi ${senderFirstName},

This is in response to your query "${clientQueryText}" submitted on our official website (Signs & Decal Corp.).

Thank you for reaching out to Signs & Decal Corp. We have reviewed your project requirements at our Brooklyn manufacturing plant estimating department.

Project Reference: ${inq.id}
Contractor / Client: ${inq.company || inq.fullName}
Trade / Scope: ${inq.projectType || 'Custom Architectural Signage & Metal Fabrication'}
Location: ${inq.projectLocation || 'New York Metropolitan Area'}

Our estimating and engineering teams are ready to assist you. Based on the initial information you shared, we would be pleased to evaluate your project specifications and provide a formal subcontractor proposal.

Next Steps to Expedite Your Proposal:
1. Drawings & CSI Specifications: If you have architectural drawings (PDF / DWG / BIM), Division 10 14 00 specifications, or finish schedules, please reply directly with files attached or share your Procore / BuildingConnected bid room link.
2. Schedule & Deadlines: Please confirm your target bid submission deadline or project completion date.
3. MBE Participation: Signs & Decal Corp. is a certified New York State and NYC Minority Business Enterprise (MBE) with over 50 years of continuous fabrication excellence.

Feel free to reply directly to this email or reach our Brooklyn plant office at (718) 499-1999 if you would like to arrange an engineering walk-through or inspect material mockups.

Best regards,

${currentUser?.name || 'Carlos Colon'}
${currentUser?.role || 'Senior Estimator'}
Signs & Decal Corp.
410 Morgan Avenue, Brooklyn, NY 11211
Phone: (718) 499-1999
Email: ${currentUser?.email || 'sales@signsanddecal.com'}
Website: https://www.signsanddecal.com`;

    setReplyBody(initialBody);
    setReplyCopied(false);
  };

  // Mark inquiry as responded in CRM
  const recordReplyDispatched = async (inquiryId: string) => {
    if (!autoMarkResponded) return;
    try {
      await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'RESPONDED',
          internalNotes: `[${new Date().toLocaleString()}] Official reply dispatched via Outlook by ${
            currentUser?.name || 'Estimator'
          } (${currentUser?.role || 'Admin'}).`,
        }),
      });
      fetchInquiries();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Launch Outlook Web (Office 365 or Personal Live)
  const handleLaunchOutlookWeb = async (mode: 'office' | 'live' = 'office') => {
    if (!replyModalInquiry) return;
    const baseUrl =
      mode === 'office'
        ? 'https://outlook.office.com/mail/deeplink/compose'
        : 'https://outlook.live.com/mail/0/deeplink/compose';

    const url = `${baseUrl}?to=${encodeURIComponent(replyRecipient)}&subject=${encodeURIComponent(
      replySubject
    )}&body=${encodeURIComponent(replyBody)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
    await recordReplyDispatched(replyModalInquiry.id);
    setUserSuccessMessage(`Outlook Web launched for inquiry ${replyModalInquiry.id}. Status updated to Bid Sent!`);
    setTimeout(() => setUserSuccessMessage(''), 5000);
    setReplyModalInquiry(null);
  };

  // Launch Desktop Mail / Native Outlook
  const handleLaunchDesktopMail = async () => {
    if (!replyModalInquiry) return;
    const mailtoUrl = `mailto:${encodeURIComponent(replyRecipient)}?subject=${encodeURIComponent(
      replySubject
    )}&body=${encodeURIComponent(replyBody)}`;

    window.location.href = mailtoUrl;
    await recordReplyDispatched(replyModalInquiry.id);
    setUserSuccessMessage(`Desktop Mail launched for inquiry ${replyModalInquiry.id}. Status updated to Bid Sent!`);
    setTimeout(() => setUserSuccessMessage(''), 5000);
    setReplyModalInquiry(null);
  };

  // Copy Drafted Response to Clipboard
  const handleCopyDraft = async () => {
    try {
      const fullText = `To: ${replyRecipient}\nSubject: ${replySubject}\n\n${replyBody}`;
      await navigator.clipboard.writeText(fullText);
      setReplyCopied(true);
      setTimeout(() => setReplyCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Save Settings Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setIsSavingConfig(true);
    setConfigSuccessMessage('');

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setConfigSuccessMessage('Site settings successfully saved and published live!');
        setTimeout(() => setConfigSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save site settings. Please check server logs.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Status Badge Colors Helper
  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'NEW':
        return {
          label: 'New Inquiry',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
          dot: 'bg-emerald-500 animate-pulse',
        };
      case 'IN_REVIEW':
        return {
          label: 'In Estimating',
          bg: 'bg-blue-50 text-blue-800 border-blue-300 font-bold',
          dot: 'bg-blue-500',
        };
      case 'FORWARDED_TO_SALES':
        return {
          label: 'Forwarded to Sales',
          bg: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
          dot: 'bg-amber-500',
        };
      case 'RESPONDED':
        return {
          label: 'Proposal / Bid Sent',
          bg: 'bg-purple-50 text-purple-800 border-purple-300 font-bold',
          dot: 'bg-purple-500',
        };
      case 'WON':
        return {
          label: 'Contract Awarded',
          bg: 'bg-green-100 text-green-950 border-green-400 font-extrabold',
          dot: 'bg-green-600',
        };
      case 'REJECTED':
        return {
          label: 'Declined / Out of Scope',
          bg: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
          dot: 'bg-rose-500',
        };
    }
  };

  const getSourceBadge = (source: InquirySource) => {
    switch (source) {
      case 'AI Chatbot':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Quote Request':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Contact Form':
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // -------------------------------------------------------------
  // SECURE GATEWAY SCREEN (RENDERED WHEN NOT AUTHENTICATED)
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-[#f8fafc] to-amber-50/30 text-slate-900 flex flex-col justify-between relative overflow-hidden select-none font-sans">
        {/* Subtle Architectural Grid Lines */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)`,
            backgroundSize: '56px 56px',
          }}
        />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-100/40 via-amber-100/20 to-transparent pointer-events-none" />

        <div className="max-w-2xl w-full mx-auto my-auto p-4 sm:p-6 relative z-10">
          {/* Executive Pure White Card Container */}
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-[0_20px_60px_-15px_rgba(15,43,72,0.12),0_0_1px_rgba(0,0,0,0.05)] p-8 sm:p-12 backdrop-blur-xs">
            {/* Header & Brand Identity */}
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center justify-center w-18 h-18 rounded-2xl bg-[#0f2b48] text-amber-400 font-bold font-heading text-3xl shadow-lg shadow-[#0f2b48]/25 border border-slate-700/40">
                S+D
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900">
                  Signs &amp; Decal Corp.
                </h1>
                <div className="mt-1.5 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80 uppercase tracking-wider">
                    Executive Admin &amp; Estimating Portal
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                Management console for estimating pipelines, client CRM inquiries, Outlook correspondence, and live site content.
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Gateway Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block font-semibold text-slate-800 text-sm mb-1.5">
                  Username or Work Email
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. admin or carlos@signsanddecal.com"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#0f2b48] focus:ring-4 focus:ring-[#0f2b48]/10 text-slate-900 text-base font-normal outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 text-sm mb-1.5">
                  Gateway Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#0f2b48] focus:ring-4 focus:ring-[#0f2b48]/10 text-slate-900 text-base font-normal outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0f2b48] hover:bg-[#153e68] text-white font-bold text-base shadow-lg shadow-[#0f2b48]/20 hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2.5 mt-4 cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5 text-amber-400" />
                    <span>Access Executive Console</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick-Access Staff Logins with Real Avatars */}
            <div className="mt-9 pt-7 border-t border-slate-200 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>Authorized Staff Directory (Click to Instant Login):</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Single-Click Switcher
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {[
                  {
                    name: 'Haas Khalfan',
                    title: 'President & CEO',
                    username: 'admin',
                    pass: 'snd2026!',
                    avatar: '/images/team/haas-khalfan.png',
                  },
                  {
                    name: 'Carlos Colon',
                    title: 'VP Preconstruction',
                    username: 'carlos',
                    pass: 'estimating2026',
                    avatar: '/images/team/carlos-colon.png',
                  },
                  {
                    name: 'Abbas Khalfan',
                    title: 'VP Operations',
                    username: 'abbas',
                    pass: 'plant410',
                    avatar: '/images/team/abbas-khalfan.png',
                  },
                  {
                    name: 'Sandra',
                    title: 'Project Coordinator',
                    username: 'sandra',
                    pass: 'coordinator2026',
                    avatar: '/images/team/sandra.png',
                  },
                  {
                    name: 'Robert Vance',
                    title: 'Chief Engineer',
                    username: 'robert',
                    pass: 'chiefengineer2026',
                    avatar: '/images/team/robert.png',
                  },
                  {
                    name: 'Clara Liranzo',
                    title: 'Finance & Compliance',
                    username: 'clara',
                    pass: 'compliance2026',
                    avatar: '/images/team/clara-liranzo.png',
                  },
                ].map((persona) => (
                  <button
                    key={persona.username}
                    type="button"
                    onClick={() => handleQuickStaffLogin(persona.username, persona.pass)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-400 text-left transition-all group cursor-pointer shadow-2xs hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={persona.avatar}
                        alt={persona.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 group-hover:border-amber-500 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-slate-900 group-hover:text-[#0f2b48] truncate">
                          {persona.name}
                        </div>
                        <div className="text-xs text-amber-700 font-medium truncate">
                          {persona.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          {persona.username}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white/70">
          Signs &amp; Decal Corp. • 410 Morgan Avenue, Brooklyn, NY 11211 • 256-Bit SSL Encrypted Admin Gateway • Certified MBE
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN CONSOLE
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* 1. TOP ADMIN BAR */}
      <header className="bg-[#0f2b48] text-white border-b-4 border-amber-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold font-heading text-2xl shadow-md">
              S+D
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading font-extrabold text-xl tracking-tight text-white">
                  Signs &amp; Decal Corp. — Admin Console
                </h1>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                  Brooklyn Plant CMS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Prequalification, Quote Inquiries &amp; Live Frontend Content Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Logged in User Pill */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-amber-400"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="text-left">
                <div className="font-bold text-white leading-tight">{currentUser.name}</div>
                <div className="text-xs text-amber-300 font-medium">{currentUser.role}</div>
              </div>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20 transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-4 h-4 text-amber-400" />
            </Link>

            <button
              onClick={() => {
                fetchInquiries();
                fetchConfig();
                fetchUsers();
              }}
              title="Refresh Data"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-amber-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingInquiries ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              title="Sign Out of Gateway"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-100 text-xs font-bold uppercase border border-red-500/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 border-t border-slate-700/60 pt-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm sm:text-base border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-amber-400 text-amber-400 bg-white/5 font-bold'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Inquiries &amp; Leads CRM</span>
            {stats.new > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-emerald-500 text-slate-950 font-extrabold">
                {stats.new} NEW
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm sm:text-base border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400 bg-white/5 font-bold'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Frontend Content &amp; Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm sm:text-base border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'border-amber-400 text-amber-400 bg-white/5 font-bold'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Team Logins &amp; Access Gateway</span>
            <span className="ml-1.5 px-2 py-0.5 rounded text-xs bg-amber-400/20 text-amber-300 font-mono font-bold">
              {usersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm sm:text-base border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-amber-400 text-amber-400 bg-white/5 font-bold'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Pipeline Analytics</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* User Success Message Banner */}
        {userSuccessMessage && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-950 font-bold text-sm flex items-center gap-2.5 animate-in fade-in duration-200 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{userSuccessMessage}</span>
          </div>
        )}

        {/* TAB 1: INQUIRIES & ESTIMATING PIPELINE */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            {/* Top Stat Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {[
                { label: 'Total Inquiries', count: stats.total, color: 'text-slate-900', bg: 'bg-white', border: 'border-slate-200' },
                { label: 'New / Unreviewed', count: stats.new, color: 'text-emerald-700', bg: 'bg-emerald-50/80', border: 'border-emerald-300', pulse: stats.new > 0 },
                { label: 'In Estimating', count: stats.inReview, color: 'text-blue-700', bg: 'bg-blue-50/80', border: 'border-blue-300' },
                { label: 'Forwarded to Sales', count: stats.forwardedToSales, color: 'text-amber-800', bg: 'bg-amber-50/80', border: 'border-amber-300' },
                { label: 'Bid Submitted', count: stats.responded, color: 'text-purple-700', bg: 'bg-purple-50/80', border: 'border-purple-300' },
                { label: 'Contracts Won', count: stats.won, color: 'text-green-800', bg: 'bg-green-50/80', border: 'border-green-300' },
              ].map((card, i) => (
                <div key={i} className={`p-4 rounded-xl border shadow-xs ${card.bg} ${card.border} transition-all`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 truncate flex items-center gap-1.5">
                    {card.pulse && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                    <span>{card.label}</span>
                  </div>
                  <div className={`text-3xl font-extrabold mt-1 tracking-tight ${card.color}`}>{card.count}</div>
                </div>
              ))}
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-amber-600" />
                  <span>Pipeline Stage:</span>
                </span>
                {(
                  [
                    { key: 'ALL', label: 'All Inquiries' },
                    { key: 'NEW', label: 'New' },
                    { key: 'IN_REVIEW', label: 'In Estimating' },
                    { key: 'FORWARDED_TO_SALES', label: 'Sales Followup' },
                    { key: 'RESPONDED', label: 'Bid Sent' },
                    { key: 'WON', label: 'Contracts Won' },
                    { key: 'REJECTED', label: 'Declined' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === f.key
                        ? 'bg-[#0f2b48] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search contractor, project scope, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchInquiries()}
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#0f2b48] focus:ring-2 focus:ring-[#0f2b48]/10 outline-none"
                />
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-[#0f2b48] text-white uppercase text-xs tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Inquiry Ref &amp; Date</th>
                      <th className="py-3.5 px-4">Contractor / Contact</th>
                      <th className="py-3.5 px-4">Project Scope &amp; Location</th>
                      <th className="py-3.5 px-4">Source</th>
                      <th className="py-3.5 px-4">Current Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-base text-slate-700">No inquiry records match the selected filters.</p>
                          <p className="text-xs text-slate-400 mt-1">Try switching to &quot;All Inquiries&quot; or clearing your search.</p>
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((inq) => {
                        const statusBadge = getStatusBadge(inq.status);
                        const isSelected = selectedInquiry?.id === inq.id;
                        return (
                          <tr
                            key={inq.id}
                            onClick={() => setSelectedInquiry(inq)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-amber-50/60' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="font-mono font-bold text-sm text-[#0f2b48]">{inq.id}</div>
                              <div className="text-xs text-slate-500">
                                {new Date(inq.createdAt).toLocaleDateString()} •{' '}
                                {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-bold text-base text-slate-900">{inq.fullName}</div>
                              <div className="text-sm text-slate-600 font-medium">{inq.company}</div>
                              <div className="text-xs text-slate-500 font-mono">{inq.email}</div>
                            </td>

                            <td className="py-4 px-4 max-w-xs">
                              <div className="font-bold text-sm text-[#0f2b48] truncate">{inq.projectType}</div>
                              <div className="text-xs text-slate-600 truncate">{inq.projectLocation}</div>
                            </td>

                            <td className="py-4 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getSourceBadge(
                                  inq.source
                                )}`}
                              >
                                {inq.source === 'AI Chatbot' && <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                                {inq.source === 'Quote Request' && <FileText className="w-3.5 h-3.5 text-amber-600" />}
                                {inq.source === 'Contact Form' && <Mail className="w-3.5 h-3.5 text-blue-600" />}
                                <span>{inq.source}</span>
                              </span>
                            </td>

                            <td className="py-4 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg}`}
                              >
                                <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                                <span>{statusBadge.label}</span>
                              </span>
                            </td>

                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenReplyModal(inq);
                                  }}
                                  title="Draft official reply in Outlook"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-[#0078d4] text-[#0078d4] hover:text-white text-xs font-bold transition-all border border-blue-200"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>Reply</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInquiry(inq);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0f2b48] text-slate-700 hover:text-white text-xs font-bold transition-all"
                                >
                                  <span>Review</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inquiry Detail Drawer Modal */}
            {selectedInquiry && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-[#0f2b48] text-white p-5 flex items-center justify-between border-b-2 border-amber-500">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
                        {selectedInquiry.id.slice(-4)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-heading font-extrabold text-xl text-white">
                            {selectedInquiry.company || selectedInquiry.fullName}
                          </h2>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSourceBadge(
                              selectedInquiry.source
                            )}`}
                          >
                            {selectedInquiry.source}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300">
                          Contact: {selectedInquiry.fullName} • Submitted{' '}
                          {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                        title="Delete Inquiry Record"
                        className="p-2 rounded-lg text-red-300 hover:text-red-100 hover:bg-red-900/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedInquiry(null)}
                        className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
                    {/* Stage Progression Buttons */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Pipeline Stage:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(
                          [
                            { key: 'NEW', label: 'New' },
                            { key: 'IN_REVIEW', label: 'In Estimating' },
                            { key: 'FORWARDED_TO_SALES', label: 'Sales Followup' },
                            { key: 'RESPONDED', label: 'Bid Sent' },
                            { key: 'WON', label: 'Contract Won' },
                            { key: 'REJECTED', label: 'Declined' },
                          ] as const
                        ).map((st) => (
                          <button
                            key={st.key}
                            onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, st.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              selectedInquiry.status === st.key
                                ? 'bg-[#0f2b48] text-white border-[#0f2b48] shadow-xs'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Inquiry Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                      <div>
                        <span className="font-semibold text-xs text-slate-500 uppercase block mb-0.5">Work Email:</span>
                        <div className="font-mono text-sm text-slate-900 font-medium">{selectedInquiry.email}</div>
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-slate-500 uppercase block mb-0.5">Telephone:</span>
                        <div className="font-mono text-sm text-slate-900 font-medium">{selectedInquiry.phone || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-slate-500 uppercase block mb-0.5">Project Scope / Trade:</span>
                        <div className="font-bold text-slate-900">{selectedInquiry.projectType}</div>
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-slate-500 uppercase block mb-0.5">Project Location:</span>
                        <div className="font-bold text-slate-900">{selectedInquiry.projectLocation}</div>
                      </div>
                    </div>

                    {selectedInquiry.chatSummary && (
                      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-sm text-slate-800 space-y-1.5">
                        <div className="font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 text-xs">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span>AI Chatbot Executive Brief</span>
                        </div>
                        <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-slate-700">
                          {selectedInquiry.chatSummary}
                        </pre>
                      </div>
                    )}

                    <div>
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-700 block mb-1.5">
                        Client Inscription / Specifications:
                      </span>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {selectedInquiry.message}
                      </div>
                    </div>

                    {/* Internal Estimating Notes */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0f2b48]">
                        <HardHat className="w-4 h-4 text-amber-600" />
                        <span>Internal Estimating Notes (Persisted to Disk)</span>
                      </div>
                      <textarea
                        rows={3}
                        defaultValue={selectedInquiry.internalNotes || ''}
                        placeholder="e.g. Drawings downloaded from Procore. Carlos Colon scheduled site survey for Monday."
                        onBlur={(e) => handleSaveNotes(selectedInquiry.id, e.target.value)}
                        className="w-full p-3 text-sm rounded-xl border border-amber-300 bg-white focus:border-[#0f2b48] outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 font-mono">
                      Inquiry ID: <span className="font-bold text-slate-800">{selectedInquiry.id}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenReplyModal(selectedInquiry)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0078d4] hover:bg-[#005a9e] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <Mail className="w-4 h-4 text-blue-100" />
                        <span>Send Official Email Reply</span>
                      </button>
                      <button
                        onClick={() => setSelectedInquiry(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-bold cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OFFICIAL OUTLOOK EMAIL REPLY COMPOSER MODAL */}
            {replyModalInquiry && (
              <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-[#0078d4] via-[#005a9e] to-[#0f2b48] text-white p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white">
                        <Mail className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
                          <span>Official Email Reply — Outlook Integration</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-blue-100">
                          Pre-filled response citing client query. Review and edit before opening in Outlook.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setReplyModalInquiry(null)}
                      className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Context Bar */}
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-600 gap-2">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="font-bold text-slate-900">{replyModalInquiry.fullName}</span>
                      <span>•</span>
                      <span>{replyModalInquiry.company || 'Direct Client'}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-500">{replyModalInquiry.email}</span>
                    </div>
                    <div className="font-mono text-xs bg-white px-2.5 py-1 rounded-md border border-slate-200 font-bold text-[#0f2b48]">
                      Ref: {replyModalInquiry.id}
                    </div>
                  </div>

                  {/* Composer Form Body */}
                  <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800 text-sm">
                    {/* Recipient */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        To (Recipient Work Email):
                      </label>
                      <input
                        type="email"
                        value={replyRecipient}
                        onChange={(e) => setReplyRecipient(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/10 text-sm font-mono font-medium outline-none"
                      />
                    </div>

                    {/* Subject Line */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Subject Line:
                      </label>
                      <input
                        type="text"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/10 text-sm font-semibold outline-none text-slate-900"
                      />
                    </div>

                    {/* Body Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Official Reply Message Body (Editable):
                        </label>
                        <span className="text-xs text-slate-500 font-medium">
                          Quotes client&apos;s exact query and provides Brooklyn estimating next steps
                        </span>
                      </div>
                      <textarea
                        rows={12}
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        className="w-full p-4 text-sm sm:text-base rounded-xl border border-slate-300 focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/10 font-sans leading-relaxed text-slate-800 outline-none shadow-2xs"
                      />
                    </div>

                    {/* Auto-advance status checkbox */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="autoMarkResponded"
                        checked={autoMarkResponded}
                        onChange={(e) => setAutoMarkResponded(e.target.checked)}
                        className="w-4 h-4 text-[#0078d4] rounded border-slate-300 focus:ring-[#0078d4]"
                      />
                      <label htmlFor="autoMarkResponded" className="text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                        Automatically update inquiry status to &quot;Proposal / Bid Sent&quot; (RESPONDED) upon launching Outlook
                      </label>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={handleCopyDraft}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                    >
                      {replyCopied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-500" />
                          <span>Copy Draft to Clipboard</span>
                        </>
                      )}
                    </button>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* 1. Outlook Web Primary */}
                      <button
                        onClick={() => handleLaunchOutlookWeb('office')}
                        title="Opens Microsoft 365 / Corporate Outlook Web in browser"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0078d4] hover:bg-[#005a9e] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-blue-100" />
                        <span>Open in Outlook Web (Office 365)</span>
                      </button>

                      {/* 2. Outlook Personal Live Web */}
                      <button
                        onClick={() => handleLaunchOutlookWeb('live')}
                        title="Opens personal Outlook.com / Live Web in browser"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0078d4] border border-blue-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                      >
                        <Laptop className="w-4 h-4" />
                        <span>Outlook.com</span>
                      </button>

                      {/* 3. Desktop Mail / App */}
                      <button
                        onClick={handleLaunchDesktopMail}
                        title="Triggers native desktop Outlook or Windows Mail client via mailto"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                      >
                        <Mail className="w-4 h-4 text-slate-600" />
                        <span>Desktop Mail</span>
                      </button>

                      <button
                        onClick={() => setReplyModalInquiry(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs sm:text-sm font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FRONTEND CONTENT & SITE SETTINGS CMS */}
        {activeTab === 'settings' && config && (
          <div className="space-y-6">
            {configSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-950 font-bold text-sm flex items-center gap-2.5 animate-in fade-in duration-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{configSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-6">
              {/* Card 1: Company Contact */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-[#0f2b48]">
                      Company Information &amp; Email Addresses
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Manage official contact details and automated customer inquiry routing.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                  <div>
                    <label className="block font-bold text-slate-700 text-xs uppercase tracking-wide mb-1.5">
                      Legal Company Name
                    </label>
                    <input
                      type="text"
                      value={config.companyName}
                      onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0f2b48] outline-none text-base"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-xs uppercase tracking-wide mb-1.5">
                      Primary Telephone
                    </label>
                    <input
                      type="text"
                      value={config.phone}
                      onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0f2b48] outline-none text-base font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-xs uppercase tracking-wide mb-1.5">
                      General Sales Email (Published on Frontend)
                    </label>
                    <input
                      type="email"
                      value={config.salesEmail}
                      onChange={(e) => setConfig({ ...config, salesEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0f2b48] outline-none text-base font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-xs uppercase tracking-wide mb-1.5">
                      Notification Recipients (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={config.notificationEmails.join(', ')}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          notificationEmails: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0f2b48] outline-none text-base font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: AI Chatbot Configuration */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-[#0f2b48]">
                      AI Chatbot Configuration (Sandra)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Configure Sandra, our 23-year-old architectural project coordinator and intelligent assistant.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="chatbotToggle"
                      checked={config.chatbot.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          chatbot: { ...config.chatbot, enabled: e.target.checked },
                        })
                      }
                      className="w-5 h-5 text-[#0f2b48] rounded border-slate-300 focus:ring-amber-500"
                    />
                    <label htmlFor="chatbotToggle" className="font-bold text-base text-slate-800 cursor-pointer">
                      Enable Sandra AI Assistant on Public Frontend
                    </label>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-800 uppercase tracking-wide text-xs">
                        Google Gemini AI API Key (Powers Direct Google AI Responses)
                      </label>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Gemini 1.5 Flash
                      </span>
                    </div>
                    <input
                      type="password"
                      placeholder="Paste your Google Gemini API key (e.g. AIzaSy...)"
                      value={config.chatbot.geminiApiKey || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          chatbot: { ...config.chatbot, geminiApiKey: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white focus:border-[#0f2b48] outline-none text-base font-mono"
                    />
                    <p className="text-xs text-slate-600 leading-normal">
                      Connects Sandra directly to Google Gemini 1.5 Flash. When empty, Sandra operates using our built-in high-capacity knowledge library with zero external latency.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  Changes save directly to <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-800">data/site-config.json</code>
                </div>

                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f2b48] hover:bg-[#153e68] text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>{isSavingConfig ? 'Publishing Changes...' : 'Save & Publish Live Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: TEAM LOGINS & ACCESS GATEWAY (USER MANAGEMENT) */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-xl text-[#0f2b48] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span>Team Logins &amp; Access Gateway</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Manage all administrative credentials, create new team logins, reveal passwords, or directly switch into other user accounts.
                </p>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f2b48] hover:bg-[#1e3a8a] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Create New Team Login</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-[#0f2b48] text-white uppercase text-xs tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">User &amp; Profile</th>
                      <th className="py-3.5 px-4">Username &amp; Email</th>
                      <th className="py-3.5 px-4">Department / Role</th>
                      <th className="py-3.5 px-4">Gateway Password</th>
                      <th className="py-3.5 px-4 text-center">Direct Access</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {usersList.map((user) => {
                      const isCurrentSession = currentUser.id === user.id;
                      const isPasswordRevealed = Boolean(revealedPasswords[user.id]);
                      const isEditingPassword = editingUserId === user.id;

                      return (
                        <tr
                          key={user.id}
                          className={`transition-colors ${isCurrentSession ? 'bg-amber-50/70' : 'hover:bg-slate-50'}`}
                        >
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-3.5">
                              {user.avatarUrl ? (
                                <img
                                  src={user.avatarUrl}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover border border-amber-400 shadow-2xs"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-200 text-[#0f2b48] font-bold flex items-center justify-center text-sm">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-base text-slate-900 flex items-center gap-2">
                                  <span>{user.name}</span>
                                  {isCurrentSession && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500 text-slate-950 uppercase">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-400 font-mono">{user.id}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="font-mono font-bold text-slate-800 text-sm">{user.username}</div>
                            <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                                user.role.includes('Administrator')
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : user.role.includes('Estimator')
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : user.role.includes('Operations')
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-slate-100 text-slate-800 border-slate-300'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {isEditingPassword ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editPasswordValue}
                                  onChange={(e) => setEditPasswordValue(e.target.value)}
                                  placeholder="New password"
                                  className="px-3 py-1.5 text-xs rounded-lg border border-amber-400 focus:ring-1 focus:ring-amber-500 font-mono outline-none w-36"
                                />
                                <button
                                  onClick={() => handleSavePasswordChange(user.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingUserId(null)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                                  {isPasswordRevealed ? user.passwordPlain : '••••••••••••'}
                                </span>
                                <button
                                  onClick={() => toggleRevealPassword(user.id)}
                                  title={isPasswordRevealed ? 'Hide Password' : 'Show Password'}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                                >
                                  {isPasswordRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingUserId(user.id);
                                    setEditPasswordValue(user.passwordPlain);
                                  }}
                                  title="Change Password"
                                  className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                                >
                                  Change
                                </button>
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            {isCurrentSession ? (
                              <span className="text-xs sm:text-sm text-emerald-600 font-bold flex items-center justify-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Active Session</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSwitchUser(user)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-2xs transition-all hover:scale-102 cursor-pointer"
                              >
                                <Key className="w-3.5 h-3.5" />
                                <span>Login As This User</span>
                              </button>
                            )}
                          </td>

                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            {user.id !== 'USR-101' && (
                              <button
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                title="Revoke Login Access"
                                className="p-2 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Create New User Modal */}
            {showAddUserModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-[#0f2b48] text-white p-5 flex items-center justify-between border-b-2 border-amber-500">
                    <div className="flex items-center gap-2 font-heading font-extrabold text-lg">
                      <UserPlus className="w-5 h-5 text-amber-400" />
                      <span>Create New Team Login Access</span>
                    </div>
                    <button
                      onClick={() => setShowAddUserModal(false)}
                      className="p-1.5 text-slate-300 hover:text-white cursor-pointer"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-sm">
                    <div>
                      <label className="block font-bold text-slate-700 text-xs uppercase tracking-wide mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Michael Vance"
                        value={newUserData.name}
                        onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0f2b48] outline-none text-base"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 text-xs uppercase tracking-wide mb-1">
                          Username *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. mvance"
                          value={newUserData.username}
                          onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0f2b48] outline-none text-base font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 text-xs uppercase tracking-wide mb-1">
                          Department Role *
                        </label>
                        <select
                          value={newUserData.role}
                          onChange={(e) =>
                            setNewUserData({
                              ...newUserData,
                              role: e.target.value as AdminUser['role'],
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0f2b48] outline-none text-sm font-semibold bg-white"
                        >
                          <option value="Senior Estimator">Senior Estimator</option>
                          <option value="Executive Administrator">Executive Administrator</option>
                          <option value="Operations Director">Operations Director</option>
                          <option value="Finance & Compliance">Finance & Compliance</option>
                          <option value="Design & Engineering">Design & Engineering</option>
                          <option value="Project Coordinator">Project Coordinator</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 text-xs uppercase tracking-wide mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="mvance@signsanddecal.com"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0f2b48] outline-none text-base font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 text-xs uppercase tracking-wide mb-1">
                        Initial Gateway Password *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. estimator2026!"
                        value={newUserData.passwordPlain}
                        onChange={(e) => setNewUserData({ ...newUserData, passwordPlain: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0f2b48] outline-none text-base font-mono"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(false)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#0f2b48] hover:bg-[#153e68] text-white font-bold text-sm uppercase tracking-wider cursor-pointer shadow-md"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PIPELINE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-heading font-extrabold text-xl text-[#0f2b48]">
                    Estimating Pipeline &amp; Conversion Analytics
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Live operational metrics across municipal, commercial, and transit subcontracting inquiries.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-2">
                <div className="space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                    Inquiry Volume by Status
                  </h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'New Inquiries', count: stats.new, color: 'bg-emerald-500' },
                      { label: 'In Estimating Review', count: stats.inReview, color: 'bg-blue-500' },
                      { label: 'Forwarded to Sales', count: stats.forwardedToSales, color: 'bg-amber-500' },
                      { label: 'Formal Proposals Sent', count: stats.responded, color: 'bg-purple-600' },
                      { label: 'Contracts Awarded (Won)', count: stats.won, color: 'bg-green-600' },
                      { label: 'Declined / Out of Scope', count: stats.rejected, color: 'bg-rose-500' },
                    ].map((item) => {
                      const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                      return (
                        <div key={item.label} className="space-y-1.5">
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span>{item.label}</span>
                            <span>
                              {item.count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                    Lead Generation Channels
                  </h3>
                  <div className="space-y-3 text-sm">
                    {[
                      {
                        label: 'Request a Quote / Project Bid Form',
                        count: stats.bySource.quoteRequests,
                        color: 'bg-amber-500',
                      },
                      {
                        label: 'Contact Us Page',
                        count: stats.bySource.contactForms,
                        color: 'bg-blue-500',
                      },
                      {
                        label: 'AI Chatbot Architectural Consultations',
                        count: stats.bySource.chatbotLeads,
                        color: 'bg-purple-600',
                      },
                    ].map((ch) => {
                      const pct = stats.total > 0 ? Math.round((ch.count / stats.total) * 100) : 0;
                      return (
                        <div key={ch.label} className="space-y-1.5">
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span>{ch.label}</span>
                            <span>
                              {ch.count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div className={`${ch.color} h-2.5 rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-7 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0f2b48]">
                      Response Rate Metric
                    </span>
                    <div className="text-4xl font-extrabold text-emerald-700 tracking-tight">
                      {stats.total > 0
                        ? `${Math.round(((stats.responded + stats.won) / stats.total) * 100)}%`
                        : '100%'}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Proportion of qualified subcontractor inquiries with formal bids or proposals sent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
