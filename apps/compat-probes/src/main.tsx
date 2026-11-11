import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@antadesign/anta/bundle.css';
import { Button, Input, Select, Title, Text } from '@antadesign/anta/bundle';
import './style.css';

function App() {
  const native =
    new URLSearchParams(location.search).get('control') === 'native';
  const [result, setResult] = useState('Not submitted');
  const [count, setCount] = useState(0);
  const [choice, setChoice] = useState<string | null>('blue');
  const [dark, setDark] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [generation, setGeneration] = useState(0);
  return (
    <main>
      <Title level={1}>Compatibility v2: platform probes</Title>
      <Text>
        Native HTML baseline versus Anta, under React StrictMode. No backend.
      </Text>
      <nav>
        <a href="?control=native">Native baseline</a>
        <a href="?control=anta">Anta controls</a>
      </nav>
      <div className="actions">
        <Button
          label="Toggle theme"
          onClick={() => {
            document.documentElement.classList.toggle('dark', !dark);
            setDark(!dark);
          }}
        />
        <Button
          label="Toggle fieldset"
          onClick={() => setDisabled(!disabled)}
        />
        <Button
          label="Remount controls"
          onClick={() => setGeneration(generation + 1)}
        />
      </div>
      <form
        key={generation}
        onSubmit={(e) => {
          e.preventDefault();
          setResult(
            JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
          );
          setCount((n) => n + 1);
        }}
      >
        <fieldset disabled={disabled}>
          <legend>{native ? 'Native' : 'Anta'} form controls</legend>
          {native ? (
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                defaultValue="initial@example.com"
              />
            </label>
          ) : (
            <Input
              name="email"
              type="email"
              required
              defaultValue="initial@example.com"
              label="Email"
            />
          )}
          {native ? (
            <label>
              Notes
              <textarea name="notes" defaultValue="Initial notes" />
            </label>
          ) : (
            <Input
              name="notes"
              multiline
              maxRows={4}
              defaultValue="Initial notes"
              label="Notes"
            />
          )}
          {native ? (
            <label>
              Color
              <select name="color" defaultValue="blue">
                <option>blue</option>
                <option>green</option>
              </select>
            </label>
          ) : (
            <Select
              label="Color"
              options={['blue', 'green']}
              value={choice}
              onValueChange={setChoice}
            />
          )}
        </fieldset>
        <div className="actions">
          {native ? (
            <>
              <button type="submit">Submit</button>
              <button type="reset">Reset</button>
            </>
          ) : (
            <>
              <Button type="submit" label="Submit" />
              <Button type="reset" label="Reset" />
            </>
          )}
        </div>
      </form>
      <output aria-label="Submission">{result}</output>
      <output aria-label="Submission count">{count}</output>
      <Text>
        Select intentionally has no hidden input adapter: this probe exposes its
        documented native-form boundary.
      </Text>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
