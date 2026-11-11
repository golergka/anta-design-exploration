import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@antadesign/anta/bundle.css';
import { Button, Tabs, Text, Title } from '@antadesign/anta/bundle';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import './style.css';
loader.config({ monaco });
const files: Record<string, string> = {
  'queries.sql':
    'SELECT customer, total\nFROM orders\nWHERE total > 100\nORDER BY total DESC;',
  'schema.sql': 'CREATE TABLE orders (\n  customer TEXT,\n  total NUMERIC\n);',
};
function App() {
  const [file, setFile] = useState('queries.sql'),
    [panel, setPanel] = useState('results'),
    [dark, setDark] = useState(false),
    [ran, setRan] = useState(false);
  useEffect(() => {
    Object.assign(window, {
      compatV2: {
        results: () => setPanel('results'),
        errors: () => setPanel('errors'),
        dark: () => setDark(true),
        light: () => setDark(false),
      },
    });
  }, []);
  return (
    <div className={'shell ' + (dark ? 'dark' : '')}>
      <header className="flex items-center justify-between gap-2 px-2 sm:gap-6 sm:px-6">
        <div>
          <small>compat-v2 &nbsp; </small>
          <b className="mark">◈</b> <strong>Workbench</strong>
          <span className="muted"> / analytics</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          <Button
            label={dark ? 'Light mode' : 'Dark mode'}
            priority="tertiary"
            onClick={() => setDark(!dark)}
          />{' '}
          <Button
            label="Run query"
            tone="brand"
            onClick={() => {
              setRan(true);
              setPanel('results');
            }}
          />
        </div>
      </header>
      <div className="workspace">
        <aside>
          <div className="eyebrow">
            EXPLORER <span>＋</span>
          </div>
          <Text size="small">WORKSPACE</Text>
          <div className="folder">▾ &nbsp; analytics</div>
          {Object.keys(files).map((f) => (
            <button
              className={'file ' + (file === f ? 'active' : '')}
              key={f}
              onClick={() => setFile(f)}
            >
              ⌁ &nbsp; {f}
            </button>
          ))}
          <div className="tip">
            Connected to
            <br />
            <strong>Production warehouse</strong>
            <br />● &nbsp; Healthy
          </div>
        </aside>
        <main>
          <div className="editor-tabs">
            <Tabs
              label="Open files"
              priority="tertiary"
              value={file}
              onStateChange={(_, d) => d.next && setFile(d.next)}
              options={Object.keys(files).map((value) => ({
                value,
                label: value,
              }))}
            />
            <span>⋯</span>
          </div>
          <div className="crumb">analytics / {file}</div>
          <div className="editor">
            <Editor
              path={file}
              defaultLanguage="sql"
              defaultValue={files[file]}
              theme={dark ? 'vs-dark' : 'light'}
              options={{
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
          <section className="bottom">
            <div className="bottom-head">
              <Tabs
                label="Query output"
                priority="tertiary"
                value={panel}
                onStateChange={(_, d) => d.next && setPanel(d.next)}
                options={[
                  { value: 'results', label: 'Results' },
                  { value: 'errors', label: 'Problems · 1' },
                ]}
              />
              <span>⌄</span>
            </div>
            {panel === 'results' ? (
              <div className="result">
                <div className="result-meta">
                  {ran ? 'Query completed in 128 ms' : 'Last run · 128 ms'}{' '}
                  <span>3 rows</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>customer</th>
                      <th>total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['1', 'Acme Studio', '$ 2,480.00'],
                      ['2', 'Northstar', '$ 1,920.00'],
                      ['3', 'Evergreen', '$ 875.00'],
                    ].map((row) => (
                      <tr key={row[0]}>
                        {row.map((x) => (
                          <td key={x}>{x}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="problem">
                ● &nbsp; <b>queries.sql</b> &nbsp; Consider adding a LIMIT to
                this query. <span>Ln 1</span>
              </div>
            )}
          </section>
        </main>
      </div>
      <footer>
        <span>● &nbsp; Connected &nbsp; / &nbsp; main</span>
        <span>SQL &nbsp; UTF-8 &nbsp; Ln 1, Col 1</span>
      </footer>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
