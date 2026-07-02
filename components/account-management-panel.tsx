'use client';

import { useEffect, useState } from 'react';

type User = { id: string; email: string; name: string | null; role: string; created_at: string };
type Invitation = { id: string; email: string; role: string; accepted_at: string | null; expires_at: string; created_at: string };
type AuditEvent = { id: string; actor_id: string | null; action: string; resource_type: string; resource_id: string | null; created_at: string };

export function AccountManagementPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [email, setEmail] = useState('new.user@example.com');
  const [role, setRole] = useState('viewer');
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const [usersResponse, eventsResponse] = await Promise.all([
      fetch('/api/account/users'),
      fetch('/api/account/audit-events')
    ]);

    if (usersResponse.ok) {
      const payload = await usersResponse.json();
      setUsers(payload.users || []);
      setInvitations(payload.invitations || []);
    } else {
      const payload = await usersResponse.json().catch(() => ({}));
      setError(payload.error || 'Unable to load users. Login as an admin or owner.');
    }

    if (eventsResponse.ok) {
      const payload = await eventsResponse.json();
      setEvents(payload.events || []);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function invite() {
    setMessage(null);
    setError(null);
    setInviteToken(null);
    const response = await fetch('/api/account/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || 'Unable to invite user.');
      return;
    }
    setInviteToken(payload.invitationToken);
    setMessage(`Invitation created for ${payload.invitation.email}.`);
    await load();
  }

  async function updateRole(userId: string, nextRole: string) {
    setMessage(null);
    setError(null);
    const response = await fetch('/api/account/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: nextRole })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || 'Unable to update role.');
      return;
    }
    setMessage('Role updated.');
    await load();
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
        <h2 className="text-2xl font-bold">Invite user</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100" />
          <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100">
            <option value="admin">admin</option>
            <option value="auditor">auditor</option>
            <option value="viewer">viewer</option>
          </select>
          <button onClick={invite} className="rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950">Create invite</button>
        </div>
        {inviteToken && <p className="mt-3 break-all rounded-xl bg-slate-950/80 p-3 text-sm text-cyan-100">Invite token: {inviteToken}</p>}
        {message && <p className="mt-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">{message}</p>}
        {error && <p className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Users">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3 border-b border-white/10 py-3 text-sm">
              <div>
                <p className="font-semibold text-white">{user.email}</p>
                <p className="text-slate-400">{user.name || 'No name'} · {user.role}</p>
              </div>
              {user.role !== 'owner' && (
                <select value={user.role} onChange={(event) => updateRole(user.id, event.target.value)} className="rounded-lg bg-slate-950 px-3 py-2 text-slate-100">
                  <option value="admin">admin</option>
                  <option value="auditor">auditor</option>
                  <option value="viewer">viewer</option>
                </select>
              )}
            </div>
          ))}
        </Panel>

        <Panel title="Invitations">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="border-b border-white/10 py-3 text-sm">
              <p className="font-semibold text-white">{invitation.email}</p>
              <p className="text-slate-400">{invitation.role} · {invitation.accepted_at ? 'accepted' : 'pending'}</p>
            </div>
          ))}
        </Panel>
      </div>

      <Panel title="Durable audit events">
        {events.map((event) => (
          <div key={event.id} className="border-b border-white/10 py-3 text-sm">
            <p className="font-semibold text-white">{event.action}</p>
            <p className="text-slate-400">{event.resource_type} · {new Date(event.created_at).toLocaleString()}</p>
          </div>
        ))}
      </Panel>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
