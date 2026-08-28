import { useEffect, useState, type FormEvent } from 'react';
import { Check, Menu, Plus, X, Zap } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useTasks } from './hooks/useTasks';
import { useWallet } from './hooks/useWallet';
import type { UserRole } from './types/api';

function useRoute() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/client');
  useEffect(() => { const onChange = () => setRoute(window.location.hash.slice(1) || '/client'); window.addEventListener('hashchange', onChange); return () => window.removeEventListener('hashchange', onChange); }, []);
  return route;
}
function go(path: string) { window.location.hash = path; }

function AuthScreen({ signup = false }: { signup?: boolean }) {
  const { login, signup: register } = useAuth();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [role, setRole] = useState<UserRole>('youth'); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(''); try { if (signup) await register({ name, email, password, role }); else await login({ email, password }); go(role === 'client' ? '/client' : '/youth'); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Authentication failed.'); } finally { setLoading(false); } }
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><div className="auth-brand"><Zap size={25} fill="#ff9418" /> Kazi</div><h1>{signup ? 'Create your account' : 'Welcome back'}</h1><p>{signup ? 'Join the Kazi community.' : 'Sign in to continue.'}</p>{signup && <><label>Name<input required value={name} onChange={(event) => setName(event.target.value)} /></label><label>Role<select value={role} onChange={(event) => setRole(event.target.value as UserRole)}><option value="youth">Youth</option><option value="client">Client</option></select></label></>}<label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="error-message">{error}</p>}<button className="primary-button" disabled={loading}>{loading ? 'Please wait…' : signup ? 'Sign up' : 'Sign in'}</button><button type="button" className="text-button" onClick={() => go(signup ? '/signin' : '/signup')}>{signup ? 'Already have an account? Sign in' : 'Need an account? Sign up'}</button></form></main>;
}

function ClientDashboard() {
  const { user, logout } = useAuth(); const { tasks, loading, error, actionError, reload, createTask, approveAndPay } = useTasks(); const { wallet } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false); const [modalOpen, setModalOpen] = useState(false); const [newTitle, setNewTitle] = useState(''); const [busyId, setBusyId] = useState<string | number | null>(null); const [formError, setFormError] = useState('');
  const pendingCount = tasks.filter((task) => task.status === 'reviewing').length;
  async function addTask(event: FormEvent) { event.preventDefault(); if (!newTitle.trim()) return; setFormError(''); try { await createTask({ title: newTitle.trim(), category: 'New Task', rewardSats: 1000 }); setNewTitle(''); setModalOpen(false); } catch (cause) { setFormError(cause instanceof Error ? cause.message : 'Unable to create task.'); } }
  async function pay(id: string | number) { setBusyId(id); try { await approveAndPay(id); } finally { setBusyId(null); } }
  return <div className="app-shell"><header className="topbar"><button className="icon-button" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}><Menu size={23} /></button><div className="brand"><Zap size={24} fill="#ff9418" strokeWidth={2.5} /></div><div className="account"><span>Balance</span><strong>{wallet?.balanceSats.toLocaleString() || '—'}</strong><span>sats</span><div className="avatar">{user?.name.slice(0, 2).toUpperCase() || 'KZ'}</div></div></header>{menuOpen && <nav className="menu"><button onClick={() => setMenuOpen(false)}>Posted tasks</button><button onClick={() => setMenuOpen(false)}>Payments</button><button onClick={logout}>Sign out</button></nav>}<main className="content"><div className="heading-row"><div><h1>Posted Tasks</h1><p>Review submissions and release Lightning payments.</p></div><button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={16} /> Post New Task</button></div><section className="stats"><div className="stat-card orange"><span>Paid out</span><strong>{tasks.filter((task) => task.status === 'paid').reduce((sum, task) => sum + task.rewardSats, 0).toLocaleString()}</strong><small>sats</small></div><div className="stat-card"><span>To review</span><strong>{pendingCount}</strong><small>pending</small></div></section>{actionError && <p className="error-message">{actionError}</p>}{error ? <section className="state-card"><p>{error}</p><button className="secondary-button" onClick={() => void reload()}>Retry</button></section> : loading ? <section className="state-card">Loading tasks…</section> : <section className="task-table"><div className="table-head"><span>Task</span><span>Reward</span><span>Submitted by</span><span>Status</span><span>Action</span></div>{tasks.length === 0 ? <div className="state-card">No tasks available right now.</div> : tasks.map((task) => <div className="task-row" key={task.id}><div className="task-name"><strong>{task.title}</strong><em className={`tag ${task.category.toLowerCase().replace(' ', '-')}`}>{task.category}</em></div><div className="reward"><strong>{task.rewardSats.toLocaleString()}</strong> sats</div><div className="submitter">{task.submittedBy || '—'}</div><div><span className={`status ${task.status}`}>{task.status.replace('_', ' ')}</span></div><div>{task.status === 'reviewing' ? <button className="approve-button" disabled={busyId === task.id} onClick={() => void pay(task.id)}><Check size={14} /> {busyId === task.id ? 'Paying…' : 'Approve & Pay'}</button> : <span className="empty-action">{task.status === 'paid' ? 'Released' : '—'}</span>}</div></div>)}</section>}</main>{modalOpen && <div className="modal-backdrop" onMouseDown={() => setModalOpen(false)}><form className="modal" onSubmit={addTask} onMouseDown={(event) => event.stopPropagation()}><button type="button" className="close-button" aria-label="Close" onClick={() => setModalOpen(false)}><X size={18} /></button><h2>Post a new task</h2><p>Give your community something useful to do.</p><label>Task title<input autoFocus required value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="e.g. Review our landing page" /></label>{formError && <p className="error-message">{formError}</p>}<button className="primary-button" type="submit">Post task</button></form></div>}</div>;
}

export default function App() {
  const route = useRoute(); const { isAuthenticated, role } = useAuth();
  if (route === '/signin') return <AuthScreen />;
  if (route === '/signup') return <AuthScreen signup />;
  if (!isAuthenticated) { if (window.location.hash !== '#/signin') go('/signin'); return <AuthScreen />; }
  if (route.startsWith('/youth') && role !== 'youth') return <AuthScreen />;
  if (route.startsWith('/client') && role !== 'client') return <AuthScreen />;
  return <ClientDashboard />;
}
