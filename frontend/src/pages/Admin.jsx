import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MailOpen,
  MessageCircle,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  UserRound,
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import './Admin.css';

const tokenKey = 'easyacct_admin_token';
const adminKey = 'easyacct_admin_user';
const statusLabels = {
  new: 'New',
  in_progress: 'In Progress',
  closed: 'Closed',
};

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
];
const defaultWhatsAppNumber = '+1 (617) 412-8999';

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey) || '');
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem(adminKey);
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });
  const [activeView, setActiveView] = useState('dashboard');
  const [credentials, setCredentials] = useState({
    email: 'admin@easyacct.us',
    password: 'ChangeMe123!',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [siteSettings, setSiteSettings] = useState({
    whatsapp_number: defaultWhatsAppNumber,
  });
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, in_progress: 0, closed: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingSiteSettings, setSavingSiteSettings] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const selectedMessage = useMemo(() => {
    return messages.find((message) => message.id === selectedId) || messages[0] || null;
  }, [messages, selectedId]);

  const fetchMessages = async (currentToken = token) => {
    if (!currentToken) return;

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('status', filters.status);

      const response = await fetch(`${API_BASE_URL}/api/admin/messages?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Unable to load contact messages.');
      }

      const nextMessages = payload.messages.data || [];
      setMessages(nextMessages);
      setStats(payload.stats);
      setSelectedId((currentId) => {
        const currentStillVisible = nextMessages.some((message) => message.id === currentId);
        return currentStillVisible ? currentId : nextMessages[0]?.id || null;
      });
    } catch (messagesError) {
      setError(messagesError.message);
      if (messagesError.message.includes('login')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async (currentToken = token) => {
    if (!currentToken) return;

    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Unable to load site settings.');
      }

      setSiteSettings({
        whatsapp_number: payload.settings?.whatsapp_number || defaultWhatsAppNumber,
      });
    } catch (settingsError) {
      setError(settingsError.message);
    }
  };

  const login = async (event) => {
    event.preventDefault();
    setLoginLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Admin login failed.');
      }

      localStorage.setItem(tokenKey, payload.token);
      localStorage.setItem(adminKey, JSON.stringify(payload.admin));
      setToken(payload.token);
      setAdmin(payload.admin);
      setNotice('Welcome back. Contact messages are ready.');
      await fetchMessages(payload.token);
      await fetchSettings(payload.token);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(adminKey);
    setToken('');
    setAdmin(null);
    setMessages([]);
    setSelectedId(null);
    setActiveView('dashboard');
  };

  const updateStatus = async (messageId, status) => {
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/messages/${messageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Unable to update message status.');
      }

      setNotice('Message status updated.');
      await fetchMessages();
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  const deleteMessage = async (message) => {
    if (!message) return;

    const confirmed = window.confirm(`Delete the message from ${message.name}? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingMessageId(message.id);
    setError('');
    setNotice('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/messages/${message.id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Unable to delete the message.');
      }

      setNotice(payload.message || 'Message deleted successfully.');
      await fetchMessages();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingMessageId(null);
    }
  };

  const saveSiteSettings = async (event) => {
    event.preventDefault();
    setSavingSiteSettings(true);
    setError('');
    setNotice('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(siteSettings),
      });

      const payload = await response.json();

      if (!response.ok) {
        const firstError = payload.errors ? Object.values(payload.errors).flat()[0] : null;
        throw new Error(firstError || payload.message || 'Unable to update site settings.');
      }

      setSiteSettings({
        whatsapp_number: payload.settings?.whatsapp_number || defaultWhatsAppNumber,
      });
      setNotice(payload.message || 'Site settings updated successfully.');
    } catch (settingsError) {
      setError(settingsError.message);
    } finally {
      setSavingSiteSettings(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    setError('');
    setNotice('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: admin?.email,
          ...passwordForm,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        const firstError = payload.errors ? Object.values(payload.errors).flat()[0] : null;
        throw new Error(firstError || payload.message || 'Unable to change admin password.');
      }

      setPasswordForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      setCredentials((current) => ({
        ...current,
        password: '',
      }));
      setNotice(payload.message || 'Admin password updated successfully.');
    } catch (passwordError) {
      setError(passwordError.message);
    } finally {
      setSavingPassword(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token, filters.status]);

  useEffect(() => {
    if (token) {
      fetchSettings();
    }
  }, [token]);

  if (!token) {
    return (
      <section className="admin-login-page">
        <div className="admin-login-art">
          <div className="admin-login-art__logo">
            <img src="/logo.png" alt="EasyAcct" />
            <span>EasyAcct</span>
          </div>
          <h1>Command center for every client inquiry.</h1>
          <p>Review contact messages, track follow-up status, and manage admin access from one focused workspace.</p>
          <div className="admin-login-art__metrics">
            <span><MailOpen size={18} /> Messages</span>
            <span><ShieldCheck size={18} /> Secure Login</span>
            <span><BarChart3 size={18} /> Live Stats</span>
          </div>
        </div>

        <form className="admin-login-card" onSubmit={login}>
          <p className="admin-kicker">Admin Panel</p>
          <h2>Sign In</h2>
          <p className="admin-muted">Use your admin account to open the contact dashboard.</p>

          {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}

          <label className="admin-field">
            <span>Email</span>
            <input
              type="email"
              value={credentials.email}
              onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>

          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              value={credentials.password}
              onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>

          <button className="admin-button admin-button--primary" type="submit" disabled={loginLoading}>
            <ShieldCheck size={18} />
            {loginLoading ? 'Checking...' : 'Login'}
            <ArrowRight size={18} />
          </button>

          <p className="admin-login__hint">Default login: admin@easyacct.us / ChangeMe123!</p>
        </form>
      </section>
    );
  }

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img src="/logom.png" alt="EasyAcct" />
          <div>
            <strong>EasyAcct</strong>
            <span>Admin Suite</span>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin">
          <button
            className={activeView === 'dashboard' ? 'is-active' : ''}
            type="button"
            onClick={() => setActiveView('dashboard')}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>
          <button
            className={activeView === 'settings' ? 'is-active' : ''}
            type="button"
            onClick={() => setActiveView('settings')}
          >
            <Settings size={19} />
            Settings
          </button>
        </nav>

        <div className="admin-sidebar__profile">
          <UserRound size={19} />
          <div>
            <strong>{admin?.name || 'Admin'}</strong>
            <span>{admin?.email}</span>
          </div>
        </div>
      </aside>

      <main className="admin-workspace">
        <header className="admin-header">
          <div>
            <p className="admin-kicker">EasyAcct Admin</p>
            <h1>{activeView === 'dashboard' ? 'Contact Messages' : 'Settings'}</h1>
            <p className="admin-muted">
              {activeView === 'dashboard'
                ? 'Track every website inquiry and keep follow-up moving.'
                : 'Manage admin access, security, and public contact settings.'}
            </p>
          </div>
          <div className="admin-actions">
            {activeView === 'dashboard' ? (
              <button className="admin-button" type="button" onClick={() => fetchMessages()} disabled={loading}>
                <RefreshCw size={17} />
                Refresh
              </button>
            ) : null}
            <button className="admin-button admin-button--dark" type="button" onClick={logout}>
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>

        {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
        {notice ? <div className="admin-alert admin-alert--success">{notice}</div> : null}

        {activeView === 'dashboard' ? (
          <>
            <div className="admin-stats">
              {Object.entries(stats).map(([key, value]) => (
                <button
                  className={`admin-stat admin-stat--${key} ${filters.status === key || (key === 'total' && !filters.status) ? 'is-active' : ''}`}
                  key={key}
                  type="button"
                  onClick={() => setFilters((current) => ({ ...current, status: key === 'total' ? '' : key }))}
                >
                  <span>{key === 'total' ? 'Total' : statusLabels[key]}</span>
                  <strong>{value}</strong>
                </button>
              ))}
            </div>

            <div className="admin-toolbar">
              <label className="admin-search">
                <Search size={18} />
                <input
                  value={filters.search}
                  onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') fetchMessages();
                  }}
                  placeholder="Search name, email, phone, service"
                />
              </label>
              <button className="admin-button admin-button--primary admin-button--compact" type="button" onClick={() => fetchMessages()}>
                Search
              </button>
            </div>

            <div className="admin-grid">
              <div className="admin-list">
                <div className="admin-list__head">
                  <span>Inbox</span>
                  <strong>{messages.length}</strong>
                </div>

                {loading ? <div className="admin-empty">Loading messages...</div> : null}
                {!loading && messages.length === 0 ? (
                  <div className="admin-empty">
                    <Inbox size={24} />
                    No contact form submissions yet.
                  </div>
                ) : null}

                {messages.map((message) => (
                  <button
                    key={message.id}
                    className={`admin-message ${selectedMessage?.id === message.id ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setSelectedId(message.id)}
                  >
                    <span className={`admin-badge admin-badge--${message.status}`}>
                      {statusLabels[message.status] || message.status}
                    </span>
                    <strong>{message.name}</strong>
                    <span>{message.email}</span>
                    <small>{message.service}</small>
                  </button>
                ))}
              </div>

              <aside className="admin-detail">
                {selectedMessage ? (
                  <>
                    <div className="admin-detail__top">
                      <span className={`admin-badge admin-badge--${selectedMessage.status}`}>
                        {statusLabels[selectedMessage.status] || selectedMessage.status}
                      </span>
                      <div className="admin-detail__actions">
                        <select
                          value={selectedMessage.status}
                          onChange={(event) => updateStatus(selectedMessage.id, event.target.value)}
                          disabled={deletingMessageId === selectedMessage.id}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <button
                          className="admin-button admin-button--danger"
                          type="button"
                          onClick={() => deleteMessage(selectedMessage)}
                          disabled={deletingMessageId === selectedMessage.id}
                        >
                          <Trash2 size={16} />
                          {deletingMessageId === selectedMessage.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                    <h2>{selectedMessage.name}</h2>
                    <dl className="admin-detail__list">
                      <div>
                        <dt>Email</dt>
                        <dd><a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a></dd>
                      </div>
                      <div>
                        <dt>Phone</dt>
                        <dd><a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a></dd>
                      </div>
                      <div>
                        <dt>Service</dt>
                        <dd>{selectedMessage.service}</dd>
                      </div>
                      <div>
                        <dt>Submitted</dt>
                        <dd>{new Date(selectedMessage.created_at).toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt>Message</dt>
                        <dd>{selectedMessage.message}</dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <div className="admin-empty">Select a message to view details.</div>
                )}
              </aside>
            </div>
          </>
        ) : (
          <section className="admin-settings">
            <div className="admin-settings-stack">
              <div className="admin-settings-card">
                <div className="admin-settings__intro">
                  <MessageCircle size={28} />
                  <div>
                    <h2>WhatsApp Button</h2>
                    <p>Choose the WhatsApp number used by the floating website button.</p>
                  </div>
                </div>

                <form className="admin-settings-form" onSubmit={saveSiteSettings}>
                  <label className="admin-field">
                    <span>WhatsApp Number</span>
                    <input
                      type="text"
                      value={siteSettings.whatsapp_number}
                      onChange={(event) => setSiteSettings((current) => ({ ...current, whatsapp_number: event.target.value }))}
                      placeholder="+1 (617) 412-8999"
                      required
                    />
                  </label>

                  <button className="admin-button admin-button--primary" type="submit" disabled={savingSiteSettings}>
                    <CheckCircle2 size={18} />
                    {savingSiteSettings ? 'Saving...' : 'Update WhatsApp'}
                  </button>
                </form>
              </div>

              <div className="admin-settings-card">
                <div className="admin-settings__intro">
                  <KeyRound size={28} />
                  <div>
                    <h2>Change Admin Password</h2>
                    <p>Use a strong password with uppercase, lowercase, and numbers.</p>
                  </div>
                </div>

                <form className="admin-settings-form" onSubmit={changePassword}>
                  <label className="admin-field">
                    <span>Current Password</span>
                    <input
                      type="password"
                      value={passwordForm.current_password}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, current_password: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="admin-field">
                    <span>New Password</span>
                    <input
                      type="password"
                      value={passwordForm.password}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, password: event.target.value }))}
                      minLength={8}
                      required
                    />
                  </label>
                  <label className="admin-field">
                    <span>Confirm New Password</span>
                    <input
                      type="password"
                      value={passwordForm.password_confirmation}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, password_confirmation: event.target.value }))}
                      minLength={8}
                      required
                    />
                  </label>

                  <button className="admin-button admin-button--primary" type="submit" disabled={savingPassword}>
                    <CheckCircle2 size={18} />
                    {savingPassword ? 'Saving...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
    </section>
  );
}
