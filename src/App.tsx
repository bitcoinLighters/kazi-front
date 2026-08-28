import { useState } from 'react';
import { Bell, Check, Menu, Plus, X, Zap } from 'lucide-react';

type TaskStatus = 'Reviewing' | 'Paid' | 'Approved';
type Task = { id: number; title: string; category: string; reward: number; submittedBy: string; status: TaskStatus };

const initialTasks: Task[] = [
  { id: 1, title: 'Translate product FAQ to Kinyarwanda', category: 'Translation', reward: 4200, submittedBy: 'Amina K.', status: 'Reviewing' },
  { id: 2, title: 'Write 3 short product reviews', category: 'Copywriting', reward: 2100, submittedBy: 'Claude N.', status: 'Paid' },
  { id: 3, title: 'Record 10 phrases in Kinyarwanda', category: 'Voice Data', reward: 3500, submittedBy: 'Eric M.', status: 'Approved' },
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [paidOut, setPaidOut] = useState(3500);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const pendingCount = tasks.filter((task) => task.status === 'Reviewing').length;

  function approveTask(id: number) {
    const task = tasks.find((item) => item.id === id);
    if (!task || task.status !== 'Reviewing') return;
    setPaidOut((currentBalance) => currentBalance + task.reward);
    setTasks((current) => current.map((item) => item.id === id ? { ...item, status: 'Paid' } : item));
  }

  function addTask(event: React.FormEvent) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    setTasks((current) => [{ id: Date.now(), title: newTitle.trim(), category: 'New Task', reward: 1000, submittedBy: 'You', status: 'Reviewing' }, ...current]);
    setNewTitle('');
    setModalOpen(false);
  }

  return <div className="app-shell">
    <header className="topbar">
      <button className="icon-button" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}><Menu size={23} /></button>
      <div className="brand"><Zap size={24} fill="#ff9418" strokeWidth={2.5} /></div>
      <div className="account"><span>Balance</span><strong>23,450</strong><span>sats</span><div className="avatar">TK</div></div>
    </header>
    {menuOpen && <nav className="menu"><button onClick={() => setMenuOpen(false)}>Posted tasks</button><button onClick={() => setMenuOpen(false)}>Payments</button><button onClick={() => setMenuOpen(false)}>Settings</button></nav>}
    <main className="content">
      <div className="heading-row"><div><h1>Posted Tasks</h1><p>Review submissions and release Lightning payments.</p></div><button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={16} /> Post New Task</button></div>
      <section className="stats"><div className="stat-card orange"><span>Paid out</span><strong>{paidOut.toLocaleString()}</strong><small>sats</small></div><div className="stat-card"><span>To review</span><strong>{pendingCount}</strong><small>pending</small></div></section>
      <section className="task-table"><div className="table-head"><span>Task</span><span>Reward</span><span>Submitted by</span><span>Status</span><span>Action</span></div>
        {tasks.map((task) => <div className="task-row" key={task.id}><div className="task-name"><strong>{task.title}</strong><em className={`tag ${task.category.toLowerCase().replace(' ', '-')}`}>{task.category}</em></div><div className="reward"><strong>{task.reward.toLocaleString()}</strong> sats</div><div className="submitter">{task.submittedBy}</div><div><span className={`status ${task.status.toLowerCase()}`}>{task.status}{task.status === 'Paid' && ' ϟ'}</span></div><div>{task.status === 'Reviewing' ? <button className="approve-button" onClick={() => approveTask(task.id)}><Check size={14} /> Approve & Pay</button> : <span className="empty-action">{task.status === 'Approved' ? 'Complete' : 'Released'}</span>}</div></div>)}
      </section>
    </main>
    {modalOpen && <div className="modal-backdrop" onMouseDown={() => setModalOpen(false)}><form className="modal" onSubmit={addTask} onMouseDown={(event) => event.stopPropagation()}><button type="button" className="close-button" aria-label="Close" onClick={() => setModalOpen(false)}><X size={18} /></button><h2>Post a new task</h2><p>Give your community something useful to do.</p><label>Task title<input autoFocus value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="e.g. Review our landing page" /></label><button className="primary-button" type="submit">Post task</button></form></div>}
  </div>;
}
