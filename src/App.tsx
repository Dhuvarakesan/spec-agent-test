import { useState } from 'react';

import './App.css';

type ShellView = 'Dashboard' | 'New Todo' | 'Tasks' | 'Storage';

const shellViews: ShellView[] = ['Dashboard', 'New Todo', 'Tasks', 'Storage'];

const viewSummaries: Record<ShellView, string> = {
  Dashboard: 'A calm starting point for tracking the work ahead.',
  'New Todo': 'A focused space for adding the next useful task.',
  Tasks: 'A list area ready for upcoming todo interactions.',
  Storage: 'A local-first area reserved for browser storage details.',
};

function App() {
  const [activeView, setActiveView] = useState<ShellView>('Dashboard');

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Simple Todo Application home">
          <span className="brand-mark" aria-hidden="true">
            T
          </span>
          <span>Simple Todo Application</span>
        </a>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="Application sections">
          <nav>
            {shellViews.map((view) => (
              <button
                className={view === activeView ? 'nav-button active' : 'nav-button'}
                key={view}
                type="button"
                aria-current={view === activeView ? 'page' : undefined}
                onClick={() => setActiveView(view)}
              >
                {view}
              </button>
            ))}
          </nav>
        </aside>

        <main className="content">
          <section className="hero-panel" aria-labelledby="app-title">
            <p className="eyebrow">Client-only todo workspace</p>
            <h1 id="app-title">Simple Todo Application</h1>
            <p className="intro">
              A lightweight React shell for planning, capturing, and organizing
              todos entirely in the browser.
            </p>
          </section>

          <section className="card-grid" aria-label="Application preview">
            <article className="summary-card">
              <p className="card-label">Current view</p>
              <h2>{activeView}</h2>
              <p>{viewSummaries[activeView]}</p>
            </article>
            <article className="summary-card notice-card">
              <p className="card-label">Status</p>
              <h2>Ready</h2>
              <p>No backend, auth, networking, analytics, or telemetry is configured.</p>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
