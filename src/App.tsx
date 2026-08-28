import { useState } from 'react';
import { ArrowRight, Check, Menu, MoveUpRight, Sparkles, Users, Wallet, X, Zap } from 'lucide-react';

const categories = [
  { label: 'All work', count: '2.4k' },
  { label: 'Writing', count: '840' },
  { label: 'Translation', count: '510' },
  { label: 'Voice & data', count: '290' },
];

const tasks = [
  { title: 'Localize a product story', detail: 'English to Kinyarwanda', reward: '4,200', category: 'Translation', color: 'coral' },
  { title: 'Three honest product reviews', detail: 'Short-form writing', reward: '2,100', category: 'Writing', color: 'blue' },
  { title: 'Record everyday phrases', detail: 'Voice & data collection', reward: '3,500', category: 'Voice & data', color: 'yellow' },
];

type AuthMode = 'login' | 'signup';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All work');
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [authSubmitted, setAuthSubmitted] = useState(false);
  const visibleTasks = selectedCategory === 'All work' ? tasks : tasks.filter((task) => task.category === selectedCategory);

  function joinKazi(event: React.FormEvent) {
    event.preventDefault();
    if (email.trim()) setJoined(true);
  }

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthSubmitted(false);
    setAuthOpen(true);
    setMenuOpen(false);
  }

  function submitAuth(event: React.FormEvent) {
    event.preventDefault();
    setAuthSubmitted(true);
  }

  return <div className="landing-page">
    <header className="site-header">
      <a className="logo" href="#top" aria-label="Kazi home"><span><Zap size={19} fill="currentColor" /></span> kazi</a>
      <nav className={menuOpen ? 'desktop-nav open' : 'desktop-nav'}><a href="#work" onClick={() => setMenuOpen(false)}>Find work</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href="#about" onClick={() => setMenuOpen(false)}>For teams</a></nav>
      <div className="header-actions"><button className="login-link header-link" onClick={() => openAuth('login')}>Log in</button><button className="dark-button small" onClick={() => openAuth('signup')}>Get started <ArrowRight size={15} /></button></div>
      <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </header>

    <main id="top">
      <section className="hero-section">
        <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-dot" /> The work economy, made human</p><h1>Small tasks.<br /><em>Real impact.</em></h1><p className="hero-description">Kazi connects thoughtful people with meaningful work from teams building the future across Africa and beyond.</p><div className="hero-buttons"><a className="dark-button" href="#work">Explore open work <ArrowRight size={17} /></a><a className="text-button" href="#how-it-works">See how it works <MoveUpRight size={16} /></a></div><div className="hero-proof"><div className="avatar-stack"><i>AM</i><i>CN</i><i>EM</i><i>+</i></div><span><strong>12,000+</strong> people already earning on Kazi</span></div></div>
        <div className="hero-art"><div className="art-note top-note"><Sparkles size={15} /> Your skills have value</div><div className="art-card"><div className="art-card-top"><span className="live-dot" /> Live opportunity <span>•••</span></div><h2>Help make technology<br />speak your language.</h2><div className="art-line" /><div className="art-meta"><span><Users size={15} /> 48 contributors</span><strong>4,200 sats</strong></div><div className="art-person"><div className="person-avatar">A</div><span><strong>Amina is working on this</strong><small> Kigali, Rwanda · 2 min ago</small></span><Check size={17} /></div></div><div className="art-note bottom-note"><Zap size={14} fill="currentColor" /> Paid instantly</div><div className="sun-shape" /></div>
      </section>

      <section className="ticker"><span>TRUSTED BY PEOPLE AT</span><strong>open source</strong><strong>mobi<span>²</span></strong><strong>kora.</strong><strong>🌍 made local</strong></section>

      <section className="work-section" id="work"><div className="section-heading"><div><p className="eyebrow">A good place to start</p><h2>Work that moves<br /><em>things forward.</em></h2></div><p>From a 10-minute task to a long-term collaboration, there’s room for your skills here.</p></div><div className="category-tabs">{categories.map((category) => <button className={selectedCategory === category.label ? 'active' : ''} key={category.label} onClick={() => setSelectedCategory(category.label)}>{category.label}<span>{category.count}</span></button>)}</div><div className="task-grid">{visibleTasks.map((task) => <article className="work-card" key={task.title}><div className={`work-icon ${task.color}`}><Sparkles size={20} /></div><span className="card-category">{task.category}</span><h3>{task.title}</h3><p>{task.detail}</p><div className="card-footer"><strong>{task.reward} <small>sats</small></strong><button aria-label={`View ${task.title}`}><ArrowRight size={17} /></button></div></article>)}</div><a className="browse-link" href="#join">Browse all open work <ArrowRight size={16} /></a></section>

      <section className="steps-section" id="how-it-works"><div className="section-heading centered"><p className="eyebrow">Simple by design</p><h2>Do good work.<br /><em>Get paid fairly.</em></h2></div><div className="steps-grid"><div className="step"><span>01</span><div className="step-icon"><Sparkles size={21} /></div><h3>Find your thing</h3><p>Choose tasks that match your skills, interests, and the time you have today.</p></div><div className="step"><span>02</span><div className="step-icon"><Check size={21} /></div><h3>Make it yours</h3><p>Do work you can be proud of. Every submission gets a real human review.</p></div><div className="step"><span>03</span><div className="step-icon"><Wallet size={21} /></div><h3>Get paid instantly</h3><p>Once approved, your reward lands in your wallet. No waiting. No awkward follow-up.</p></div></div></section>

      <section className="join-section" id="join"><div><p className="eyebrow">Your next chapter starts here</p><h2>There’s work<br /><em>worth doing.</em></h2></div>{joined ? <div className="joined-message"><Check size={22} /> You’re on the list. Welcome to Kazi.</div> : <form className="join-form" onSubmit={joinKazi}><label htmlFor="email">Get the best new work in your inbox.</label><div><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" required /><button type="submit" aria-label="Join Kazi"><ArrowRight size={18} /></button></div></form>}</section>
    </main><footer><a className="logo" href="#top"><span><Zap size={16} fill="currentColor" /></span> kazi</a><p>Work with purpose, wherever you are.</p><small>© 2024 Kazi</small></footer>
    {authOpen && <div className="auth-backdrop" onMouseDown={() => setAuthOpen(false)}><div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}><button className="auth-close" aria-label="Close authentication form" onClick={() => setAuthOpen(false)}><X size={19} /></button>{authSubmitted ? <div className="auth-success"><div className="success-icon"><Check size={25} /></div><h2>{authMode === 'signup' ? 'Welcome to Kazi.' : 'Good to see you.'}</h2><p>{authMode === 'signup' ? 'Your account is ready. Let’s find work worth doing.' : 'You’re signed in and ready to get back to work.'}</p><button className="dark-button auth-submit" onClick={() => setAuthOpen(false)}>Continue <ArrowRight size={16} /></button></div> : <><p className="eyebrow">{authMode === 'signup' ? 'Start your Kazi journey' : 'Welcome back'}</p><h2 id="auth-title">{authMode === 'signup' ? 'Make work matter.' : 'Pick up where you left off.'}</h2><p className="auth-intro">{authMode === 'signup' ? 'Join a community turning everyday skills into real impact.' : 'Log in to see your opportunities and payments.'}</p><form className="auth-form" onSubmit={submitAuth}>{authMode === 'signup' && <label>Full name<input type="text" placeholder="Amina Kigali" required /></label>}<label>Email address<input type="email" placeholder="you@example.com" required /></label><label>Password<input type="password" placeholder="At least 8 characters" minLength={8} required /></label><button className="dark-button auth-submit" type="submit">{authMode === 'signup' ? 'Create account' : 'Log in'} <ArrowRight size={16} /></button></form><p className="auth-switch">{authMode === 'signup' ? 'Already have an account?' : 'New to Kazi?'} <button onClick={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setAuthSubmitted(false); }}>{authMode === 'signup' ? 'Log in' : 'Sign up'}</button></p></>}</div></div>}
  </div>;
}
