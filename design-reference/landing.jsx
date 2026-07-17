/**
 * Reference export from Claude Design — "Planbase Design System"
 * https://claude.ai/design/p/88e23aef-3fb8-4df9-9075-9982f7d638d8
 * Source components: ui_kits/planbase-app/TopBar.jsx + GoalComposer.jsx
 *
 * This file is a snapshot for reference only — the app's actual landing
 * page lives in src/components/ as Tailwind-based JSX wired to real state.
 */

function TopBar() {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px', borderBottom: '1px solid var(--border-subtle)' } },
    React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: 'var(--tracking-tight)' } }, 'Planbase'),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
      React.createElement('img', { src: 'https://unpkg.com/lucide-static@latest/icons/bell.svg', width: 18, height: 18, alt: '' }),
      React.createElement('span', { style: { width: 30, height: 30, borderRadius: '50%', background: 'var(--teal-200)', color: 'var(--teal-800)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, 'A')));
}

/** GoalComposer: the landing/empty-state screen — type a goal, AI plans it. */
function GoalComposer({ goal, setGoal, onPlan, loading, examples = [] }) {
  return React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '80px 24px', textAlign: 'center' } },
    React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 44, letterSpacing: 'var(--tracking-tight)', lineHeight: 'var(--leading-tight)', maxWidth: 640 } }, 'Turn any goal into a plan, instantly.'),
    React.createElement('div', { style: { fontSize: 17, color: 'var(--text-secondary)', maxWidth: 480 } }, 'Describe what you want to achieve — our AI Planner breaks it into tasks on a kanban board.'),
    React.createElement('div', { style: { display: 'flex', gap: 10, width: '100%', maxWidth: 560, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)', padding: '8px 8px 8px 22px', boxShadow: 'var(--shadow-s)' } },
      React.createElement('input', { value: goal, onChange: e => setGoal(e.target.value), placeholder: 'e.g. a birthday party, wedding, confirmation…', style: { flex: 1, border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 16, background: 'transparent' } }),
      React.createElement('button', { onClick: onPlan, disabled: loading, style: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '10px 20px', fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.7 : 1 } },
        loading ? 'Planning…' : 'Plan it', !loading && React.createElement('img', { src: 'https://unpkg.com/lucide-static@latest/icons/arrow-right.svg', width: 16, height: 16, style: { filter: 'invert(1) brightness(2)' }, alt: '' }))),
    examples.length > 0 && React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' } },
      examples.map(ex => React.createElement('button', { key: ex, onClick: () => setGoal(ex), style: { background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', padding: '7px 14px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' } }, ex))));
}

function Landing({ goal, setGoal, onPlan, loading }) {
  return React.createElement(React.Fragment, null,
    React.createElement(TopBar),
    React.createElement(GoalComposer, { goal, setGoal, onPlan, loading, examples: ['a birthday party', 'a wedding', 'a confirmation'] }));
}

export default Landing;