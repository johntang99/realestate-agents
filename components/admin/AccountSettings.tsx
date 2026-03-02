'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function AccountSettings() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const loadSession = async () => {
    const response = await fetch('/api/admin/auth/session');
    if (!response.ok) return;
    const payload = await response.json();
    setUser(payload?.user || null);
  };

  useEffect(() => {
    loadSession();
  }, []);

  const handleChangePassword = async () => {
    setStatus(null);
    const response = await fetch('/api/admin/users/me/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Password update failed');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setStatus('Password updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600">Manage your account and security.</p>
      </div>

      {status && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {status}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="text-sm font-semibold text-gray-900">Account</div>
        {user ? (
          <div className="text-sm text-gray-600">
            Signed in as {user.name} ({user.email}) — {user.role}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Loading account…</div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="text-sm font-semibold text-gray-900">Change password</div>
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
        />
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <Button onClick={handleChangePassword}>Update password</Button>
      </div>
    </div>
  );
}
