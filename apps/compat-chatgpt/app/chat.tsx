'use client';
import * as React from 'react';
import Link from 'next/link';
import { Button, Input, Title, configure } from '@antadesign/anta/bundle';
configure(React.createElement, React.Fragment, React, {
  hydratingEvents: true,
});
export default function Chat() {
  const [value, setValue] = React.useState('');
  const [messages, setMessages] = React.useState<string[]>([]);
  const [phase, setPhase] = React.useState('');
  function send() {
    if (!value.trim()) return;
    setMessages((m) => [...m, value]);
    setValue('');
    setPhase('Thinking…');
    setTimeout(() => setPhase('Here is a deterministic demo response.'), 350);
  }
  return (
    <div className="shell">
      <aside>
        <strong>◉ Chat demo</strong>
        <p>Conversations</p>
        <Button
          label="New chat"
          onClick={() => {
            setMessages([]);
            setPhase('');
          }}
        />
        <Link href="/about">About this demo</Link>
      </aside>
      <main>
        <header>
          <Title>Chat</Title>
          <span>compat-v2 · Compatibility playground</span>
        </header>
        <section className="conversation" aria-live="polite">
          {messages.length === 0 && (
            <div className="welcome">
              <Title>What can I help with?</Title>
              <p>Try a message to test the client boundary.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <p className="message" key={i}>
              {m}
            </p>
          ))}
          {phase && <p className="response">{phase}</p>}
        </section>
        <div className="compose">
          <Input
            label="Message"
            value={value}
            onValueChange={(_e, { value }) => setValue(value)}
            placeholder="Ask anything"
          />
          <Button label="Send" priority="primary" tone="brand" onClick={send} />
        </div>
        <small>Demo responses are scripted.</small>
      </main>
    </div>
  );
}
