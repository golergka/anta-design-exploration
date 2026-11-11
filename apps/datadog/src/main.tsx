import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@antadesign/anta/bundle.css';
import { Button, Card, Icon, Tag, Text, Title } from '@antadesign/anta/bundle';
import { Plot, area, line } from '@antadesign/plot';
import '@antadesign/plot/elements/a-plot-surface';
import '@antadesign/plot/plot.css';
import './style.css';

const nav = [
  ['◈', 'Overview'],
  ['▦', 'Dashboards'],
  ['◉', 'Infrastructure'],
  ['⌁', 'APM & Services'],
  ['▤', 'Logs'],
  ['◇', 'Digital Experience'],
  ['◎', 'Monitors'],
  ['⬡', 'Security'],
  ['◷', 'Notebooks'],
];
const services = [
  {
    name: 'checkout-service',
    team: 'commerce',
    requests: '2.41k',
    latency: '284 ms',
    errors: '1.24%',
    status: 'Alert',
    tone: 'critical',
  },
  {
    name: 'payment-service',
    team: 'payments',
    requests: '1.86k',
    latency: '192 ms',
    errors: '0.38%',
    status: 'Healthy',
    tone: 'success',
  },
  {
    name: 'product-catalog',
    team: 'commerce',
    requests: '4.12k',
    latency: '86 ms',
    errors: '0.02%',
    status: 'Healthy',
    tone: 'success',
  },
  {
    name: 'user-service',
    team: 'platform',
    requests: '1.23k',
    latency: '118 ms',
    errors: '0.06%',
    status: 'Healthy',
    tone: 'success',
  },
];
const data = Array.from({ length: 61 }, (_, i) => ({
  x: i,
  traffic:
    56 +
    7 * Math.sin(i / 5) +
    4 * Math.cos(i / 2.1) +
    (i > 39 && i < 50 ? 12 : 0),
  latency:
    31 +
    5 * Math.sin(i / 4) +
    3 * Math.cos(i / 2) +
    (i > 41 && i < 52 ? 24 * Math.sin(((i - 41) / 11) * Math.PI) : 0),
  error:
    8 +
    2 * Math.sin(i / 3) +
    (i > 41 && i < 52 ? 17 * Math.sin(((i - 41) / 11) * Math.PI) : 0),
}));
function Chart({
  kind = 'traffic',
}: {
  kind?: 'traffic' | 'latency' | 'error';
}) {
  const colors =
    kind === 'traffic'
      ? ['#e9e0f6', '#8c5ac2']
      : kind === 'latency'
        ? ['#d9f2f1', '#19a7a0']
        : ['#fce4e6', '#dc6574'];
  const points = data.map((p) => ({ x: p.x, y: p[kind] }));
  return (
    <Plot
      plotArgs={{
        height: 155,
        series: [
          area({
            data: points,
            y2: 0,
            color: colors[0],
            stroke: { color: colors[1], width: 2 },
            hoverable: false,
          }),
          line({ data: points, color: colors[1], width: 2, tooltip: true }),
        ],
        axis: {
          x: { min: 0, max: 60, label: '' },
          y: { min: 0, max: 100, label: '' },
        },
        margin: { top: 8, right: 5, bottom: 20, left: 28 },
        grid: { x: false, y: true },
        border: false,
        zoom_pan: false,
        background: '#ffffff',
        chrome_color: '#e8e9ef',
      }}
    />
  );
}
function App() {
  const [range, setRange] = useState('Past 1 hour');
  const [env, setEnv] = useState('prod');
  const [tab, setTab] = useState('All services');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(false);
  const filtered = services.filter(
    (s) =>
      (tab === 'All services' || s.status === 'Alert') &&
      s.name.includes(search.toLowerCase()),
  );
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">◈</div>
          <b>datadog</b>
          <span>⌄</span>
        </div>
        <div className="workspace">
          <div className="workspace-icon">A</div>
          <div>
            <strong>Acme Inc.</strong>
            <small>Production workspace</small>
          </div>
          <span>⌄</span>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {nav.map(([icon, label]) => (
            <button
              key={label}
              className={'nav-item ' + (label === 'Overview' ? 'active' : '')}
              onClick={() => label !== 'Overview' && setNotice(true)}
            >
              <span>{icon}</span>
              {label}
              {label === 'Monitors' && <i>2</i>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help">
            ✧ <span>Help & support</span>
          </div>
          <div className="profile">
            <div className="avatar">JD</div>
            <div>
              <b>Jordan Davis</b>
              <small>Admin</small>
            </div>
            <span>⌄</span>
          </div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="crumb">
            Dashboards <span>/</span> <strong>Overview</strong>
          </div>
          <div className="top-actions">
            <button
              className="search-top"
              onClick={() => document.getElementById('service-search')?.focus()}
            >
              ⌕ <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </button>
            <button aria-label="Notifications" className="icon-button">
              ♧<em />
            </button>
            <button aria-label="Help" className="icon-button">
              ?
            </button>
            <div className="avatar small">JD</div>
          </div>
        </header>
        <main>
          <div className="heading">
            <div>
              <div className="eyebrow">
                YOUR WORKSPACE <span> / </span> OVERVIEW
              </div>
              <Title level={1}>System overview</Title>
              <Text size="small" priority="tertiary">
                A real-time pulse on your infrastructure and services.
              </Text>
            </div>
            <div className="heading-actions">
              <Button
                size="small"
                icon="refresh"
                label="Refresh"
                onClick={() => setNotice(true)}
              />
              <Button
                size="small"
                tone="brand"
                priority="primary"
                icon="plus"
                label="New dashboard"
                onClick={() => setNotice(true)}
              />
            </div>
          </div>
          {notice && (
            <div className="notice" role="status">
              This is a frontend demo. Data and navigation are simulated.{' '}
              <button onClick={() => setNotice(false)}>Dismiss</button>
            </div>
          )}
          <div className="toolbar">
            <div className="filters">
              <span className="filter-label">FILTER BY</span>
              <button
                className="filter"
                onClick={() => setEnv(env === 'prod' ? 'staging' : 'prod')}
              >
                <span>env:</span> {env} <b>⌄</b>
              </button>
              <button className="filter" onClick={() => setNotice(true)}>
                <span>service:</span> all <b>⌄</b>
              </button>
              <button className="add-filter" onClick={() => setNotice(true)}>
                ＋ Add filter
              </button>
            </div>
            <div className="time-controls">
              <span className="live">
                <i /> LIVE
              </span>
              <button
                className="filter"
                onClick={() =>
                  setRange(
                    range === 'Past 1 hour' ? 'Past 24 hours' : 'Past 1 hour',
                  )
                }
              >
                ◷ &nbsp;{range} <b>⌄</b>
              </button>
            </div>
          </div>
          <div className="section-head">
            <div>
              <Title level={4}>At a glance</Title>
              <Text size="small" priority="tertiary">
                Key signals across your environment
              </Text>
            </div>
            <span className="updated">◷ &nbsp; Updated just now</span>
          </div>
          <div className="metrics">
            {[
              {
                label: 'Total requests',
                value: '12.8M',
                delta: '↗ 12.4%',
                sub: 'vs. previous hour',
                color: 'purple',
                icon: '⌁',
              },
              {
                label: 'Avg. latency',
                value: '142',
                unit: 'ms',
                delta: '↘ 8.2%',
                sub: 'vs. previous hour',
                color: 'teal',
                icon: '◷',
              },
              {
                label: 'Error rate',
                value: '0.42',
                unit: '%',
                delta: '↗ 0.12%',
                sub: 'vs. previous hour',
                color: 'red',
                icon: '◎',
              },
              {
                label: 'Active hosts',
                value: '148',
                delta: '●  All reporting',
                sub: 'across 3 regions',
                color: 'blue',
                icon: '▣',
              },
            ].map((m) => (
              <Card key={m.label} size="small">
                <div className="metric-top">
                  <span>{m.label}</span>
                  <span className={'metric-icon ' + m.color}>{m.icon}</span>
                </div>
                <div className="metric-value">
                  {m.value}
                  <small>{m.unit}</small>
                </div>
                <div className="metric-foot">
                  <span className={m.color}>{m.delta}</span> {m.sub}
                </div>
              </Card>
            ))}
          </div>
          <div className="section-head charts-heading">
            <div>
              <Title level={4}>Performance</Title>
              <Text size="small" priority="tertiary">
                Traffic and health over time
              </Text>
            </div>
            <Button
              size="small"
              priority="quaternary"
              label="View all metrics →"
              onClick={() => setNotice(true)}
            />
          </div>
          <div className="charts">
            <Card size="small">
              <div className="chart-head">
                <div>
                  <b>Request volume</b>
                  <small>Requests per second</small>
                </div>
                <button>···</button>
              </div>
              <div className="chart-number">
                3.56k <span>req/s</span>
              </div>
              <Chart />
              <div className="legend">
                <i className="dot purple-bg" /> Requests <span>avg</span>{' '}
                <b>3.42k</b>
                <span>max</span> <b>4.18k</b>
              </div>
            </Card>
            <Card size="small">
              <div className="chart-head">
                <div>
                  <b>Request latency</b>
                  <small>95th percentile</small>
                </div>
                <button>···</button>
              </div>
              <div className="chart-number">
                284 <span>ms</span>
              </div>
              <Chart kind="latency" />
              <div className="legend">
                <i className="dot teal-bg" /> p95 latency <span>avg</span>{' '}
                <b>241 ms</b>
                <span>max</span> <b>387 ms</b>
              </div>
            </Card>
            <Card size="small">
              <div className="chart-head">
                <div>
                  <b>Error rate</b>
                  <small>Percentage of requests</small>
                </div>
                <button>···</button>
              </div>
              <div className="chart-number">
                0.42 <span>%</span>
              </div>
              <Chart kind="error" />
              <div className="legend">
                <i className="dot red-bg" /> Errors <span>avg</span>{' '}
                <b>0.38%</b>
                <span>max</span> <b>1.24%</b>
              </div>
            </Card>
          </div>
          <div className="bottom-grid">
            <Card size="small">
              <div className="table-heading">
                <div>
                  <Title level={4}>Services</Title>
                  <Text size="small" priority="tertiary">
                    Health and performance by service
                  </Text>
                </div>
                <Button
                  size="small"
                  priority="quaternary"
                  label="View service catalog →"
                  onClick={() => setNotice(true)}
                />
              </div>
              <div className="table-controls">
                <div className="tabs">
                  {['All services', 'Needs attention'].map((t) => (
                    <button
                      className={tab === t ? 'selected' : ''}
                      onClick={() => setTab(t)}
                      key={t}
                    >
                      {t} {t === 'Needs attention' && <span>1</span>}
                    </button>
                  ))}
                </div>
                <label className="table-search">
                  ⌕{' '}
                  <input
                    id="service-search"
                    placeholder="Search services"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>SERVICE</th>
                      <th>REQUESTS</th>
                      <th>LATENCY P95</th>
                      <th>ERROR RATE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.name}>
                        <td>
                          <strong>{s.name}</strong>
                          <small>{s.team}</small>
                        </td>
                        <td>
                          {s.requests} <small>req/s</small>
                        </td>
                        <td>{s.latency}</td>
                        <td>{s.errors}</td>
                        <td>
                          <Tag size="small" tone={s.tone} label={s.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filtered.length && (
                  <div className="empty">No services match your search.</div>
                )}
              </div>
            </Card>
            <Card size="small">
              <div className="table-heading">
                <div>
                  <Title level={4}>Recent alerts</Title>
                  <Text size="small" priority="tertiary">
                    Monitor activity in your environment
                  </Text>
                </div>
                <button className="dots">···</button>
              </div>
              <div className="alert">
                <div className="alert-symbol">!</div>
                <div>
                  <b>High error rate on checkout</b>
                  <p>checkout-service · prod</p>
                  <div>
                    <Tag size="small" tone="critical" label="Triggered" />{' '}
                    <span>12 min ago</span>
                  </div>
                </div>
              </div>
              <div className="alert">
                <div className="alert-symbol warning">!</div>
                <div>
                  <b>Elevated latency on payments</b>
                  <p>payment-service · prod</p>
                  <div>
                    <Tag size="small" tone="warning" label="Warning" />{' '}
                    <span>38 min ago</span>
                  </div>
                </div>
              </div>
              <div className="alert">
                <div className="alert-symbol resolved">✓</div>
                <div>
                  <b>Host CPU usage recovered</b>
                  <p>i-0a48c2 · us-east-1</p>
                  <div>
                    <Tag size="small" tone="success" label="Resolved" />{' '}
                    <span>1 hour ago</span>
                  </div>
                </div>
              </div>
              <Button
                size="small"
                priority="quaternary"
                label="View all monitors →"
                onClick={() => setNotice(true)}
              />
            </Card>
          </div>
          <footer>
            Showing data for <b>{env}</b> · {range}{' '}
            <span>Built for a clearer view of your stack</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
