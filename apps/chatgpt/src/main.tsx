import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@antadesign/anta/bundle.css';
import {
  Avatar,
  Button,
  ButtonCopy,
  Icon,
  Text,
  Title,
  Tooltip,
} from '@antadesign/anta/bundle';
import './style.css';

type Chat = {
  id: number;
  title: string;
  question: string;
  answer: React.ReactNode;
};
const initial: Chat[] = [
  {
    id: 1,
    title: 'A slower kind of weekend',
    question:
      'Help me plan a slow weekend at home. I want it to feel restorative, not like another to-do list.',
    answer: (
      <>
        <p>
          That sounds lovely. The trick is to leave enough open space that the
          weekend can actually feel like yours.
        </p>
        <p>Here’s a gentle shape for it:</p>
        <div className="answer-card">
          <div className="card-kicker">A LITTLE WEEKEND RESET</div>
          <div className="weekend-row">
            <span>01</span>
            <div>
              <strong>Start slowly</strong>
              <p>
                Make a coffee or tea, open a window, and let the morning arrive
                without a plan.
              </p>
            </div>
          </div>
          <div className="weekend-row">
            <span>02</span>
            <div>
              <strong>Do one thing with your hands</strong>
              <p>
                Cook something simple, tend to a plant, or pick up a book you’ve
                been meaning to read.
              </p>
            </div>
          </div>
          <div className="weekend-row">
            <span>03</span>
            <div>
              <strong>Leave a little room</strong>
              <p>
                Take a walk with no destination. Let the rest of the day be
                pleasantly unaccounted for.
              </p>
            </div>
          </div>
        </div>
        <p>
          Think of these as invitations, not obligations. What usually helps you
          feel most like yourself?
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: 'Ideas for a dinner party',
    question: 'What’s a relaxed dinner party menu for six?',
    answer: (
      <>
        <p>
          Go for a menu that lets you spend more time at the table than at the
          stove.
        </p>
        <p>
          Start with olives and warm bread, then serve a big lemony roast
          chicken (or white beans), crisp potatoes, and a generous green salad.
          For dessert, try berries and softly whipped cream.
        </p>
        <p>
          Most of it can be prepared ahead. Add a good playlist, and you’re
          ready.
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: 'A note to my future self',
    question: 'Help me write a thoughtful note to my future self.',
    answer: (
      <>
        <p>Dear future me,</p>
        <p>
          I hope you remember that you didn’t need to have everything figured
          out. You were learning to pay attention to the small things, to make
          room for people you love, and to trust your own pace.
        </p>
        <p>Wherever you are now, I hope you’re being kind to yourself.</p>
      </>
    ),
  },
];
const prompts = [
  ['✳', 'Make a plan', 'for a slower weekend'],
  ['✎', 'Help me write', 'a thoughtful note'],
  ['◇', 'Brainstorm', 'ideas for dinner'],
  ['☼', 'Surprise me', 'with something new'],
];
function plainText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(plainText).join(' ');
  if (React.isValidElement<{ children?: React.ReactNode }>(node))
    return plainText(node.props.children);
  return '';
}
function App() {
  const [chats, setChats] = useState(initial);
  const [active, setActive] = useState<number | null>(1);
  const [draft, setDraft] = useState('');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [sidebar, setSidebar] = useState(true);
  const [liked, setLiked] = useState(false);
  const chat = chats.find((c) => c.id === active);
  const newChat = () => {
    setActive(null);
    setDraft('');
    setSearching(false);
    setSidebar(false);
  };
  const send = (text = draft) => {
    if (!text.trim()) return;
    const next: Chat = {
      id: Date.now(),
      title: text.trim().slice(0, 30),
      question: text.trim(),
      answer: (
        <>
          <p>That’s a good place to start. Let’s take it one step at a time.</p>
          <p>
            What matters most to you here? A little more context would help me
            make this useful and personal.
          </p>
          <p className="mock-note">
            This is a frontend demo, so this reply is a prewritten example.
          </p>
        </>
      ),
    };
    setChats([next, ...chats]);
    setActive(next.id);
    setDraft('');
    setSidebar(false);
  };
  return (
    <div className={'app ' + (sidebar ? 'sidebar-open' : 'sidebar-closed')}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand-mark" aria-label="ChatGPT">
            ✺
          </div>
          <Button
            icon="arrow-left-to-line"
            priority="tertiary"
            aria-label="Close sidebar"
            onClick={() => setSidebar(false)}
          />
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          <Button
            icon="edit"
            label="New chat"
            priority="tertiary"
            onClick={newChat}
          />
          <Button
            icon="search"
            label="Search chats"
            priority="tertiary"
            onClick={() => setSearching(!searching)}
          />
          {searching && (
            <input
              className="search"
              autoFocus
              placeholder="Search conversations"
              aria-label="Search conversations"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          <Button
            icon="cube"
            label="Explore GPTs"
            priority="tertiary"
            onClick={() => {
              setActive(null);
              setDraft('What can you help me explore?');
            }}
          />
        </nav>
        <div className="sidebar-section">
          <div className="section-label">
            Your chats <span>✧</span>
          </div>
          <div className="chat-list">
            {chats
              .filter((c) =>
                c.title.toLowerCase().includes(query.toLowerCase()),
              )
              .map((c) => (
                <button
                  key={c.id}
                  className={'chat-item ' + (active === c.id ? 'selected' : '')}
                  onClick={() => {
                    setActive(c.id);
                    setSidebar(false);
                  }}
                >
                  {c.title}
                </button>
              ))}
            {chats.filter((c) =>
              c.title.toLowerCase().includes(query.toLowerCase()),
            ).length === 0 && <div className="no-results">No chats found</div>}
          </div>
        </div>
        <div className="sidebar-bottom">
          <div className="upgrade-icon">✦</div>
          <div>
            <strong>Make space for more</strong>
            <small>Explore what’s possible with Plus</small>
          </div>
          <span>↗</span>
        </div>
        <div className="account">
          <Avatar name="Alex Morgan" seed="alex" round />
          <div>
            <strong>Alex Morgan</strong>
            <small>Personal workspace</small>
          </div>
          <Icon shape="more" />
        </div>
      </aside>
      {sidebar && (
        <button
          className="scrim"
          aria-label="Close sidebar"
          onClick={() => setSidebar(false)}
        />
      )}
      <main className="main">
        <header className="topbar">
          <div className="top-left">
            {!sidebar && (
              <Button
                icon="menu"
                priority="tertiary"
                aria-label="Open sidebar"
                onClick={() => setSidebar(true)}
              />
            )}
            <div className="model-switch">
              ChatGPT <Icon shape="chevron-down" />
            </div>
            <span className="model-badge">4o</span>
          </div>
          <div className="top-right">
            <span className="private-label">
              <span>●</span> Your space to think
            </span>
            <Button
              icon="edit"
              priority="tertiary"
              aria-label="New chat"
              onClick={newChat}
            >
              <Tooltip>New chat</Tooltip>
            </Button>
            <Avatar name="Alex Morgan" seed="alex" round />
          </div>
        </header>
        {chat ? (
          <div className="conversation-scroll">
            <div className="conversation">
              <div className="date-label">
                <span></span> TODAY <span></span>
              </div>
              <div className="user-message">{chat.question}</div>
              <div className="assistant-message">
                <div className="assistant-avatar">✺</div>
                <div className="answer">
                  <div className="answer-heading">
                    ChatGPT <span>·</span> <small>Thoughtfully, for you</small>
                  </div>
                  {chat.answer}
                  <div className="answer-actions">
                    <ButtonCopy
                      copy={plainText(chat.answer)}
                      priority="tertiary"
                      size="small"
                      aria-label="Copy response"
                    />
                    <Button
                      icon="heart"
                      priority="tertiary"
                      size="small"
                      selected={liked}
                      aria-label="Like response"
                      onClick={() => setLiked(!liked)}
                    />
                    <Button
                      icon="refresh"
                      priority="tertiary"
                      size="small"
                      aria-label="Regenerate response"
                      onClick={() => setLiked(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty">
            <div className="empty-spark">✺</div>
            <div className="eyebrow">A LITTLE SPACE FOR BIG THOUGHTS</div>
            <Title level={1}>What’s on your mind?</Title>
            <Text>Ideas, questions, plans, or just a place to start.</Text>
            <div className="prompt-grid">
              {prompts.map(([icon, a, b]) => (
                <button key={a} onClick={() => send(`${a} ${b}`)}>
                  <span>{icon}</span>
                  <strong>{a}</strong>
                  <small>{b}</small>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="composer-wrap">
          <div className="composer">
            <textarea
              aria-label="Message ChatGPT"
              placeholder="Ask anything"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <div className="composer-actions">
              <div>
                <Button
                  icon="plus"
                  priority="tertiary"
                  round
                  aria-label="Add attachment"
                  onClick={() => setDraft(draft + ' [Attachment]')}
                />
                <span className="composer-hint">Anything on your mind?</span>
              </div>
              <Button
                icon="arrow-narrow-up"
                priority="primary"
                round
                aria-label="Send message"
                disabled={!draft.trim()}
                onClick={() => send()}
              />
            </div>
          </div>
          <div className="disclaimer">
            ChatGPT can make mistakes. Check important info. <span>✳</span>
          </div>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
