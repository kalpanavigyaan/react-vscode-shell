import { useState, useEffect, useRef } from 'react';

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

export function CommandPalette({ isOpen, onClose, commands }: Props) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const filtered = commands.filter(c => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      c.label.toLowerCase().includes(q) ||
      (c.description?.toLowerCase().includes(q) ?? false)
    );
  });

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  function execute(cmd: Command) {
    onClose();
    cmd.action();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,.5)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 72,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 580,
          background: 'var(--sb-bg)',
          border: '1px solid var(--border)',
          borderRadius: 6, overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,.7)',
        }}
      >
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
        }}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor"
            strokeWidth="1.5" style={{ color: 'var(--muted)', flexShrink: 0 }}>
            <circle cx="7" cy="7" r="5" /><line x1="11" y1="11" x2="15" y2="15" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') { onClose(); return; }
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
                return;
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
                return;
              }
              if (e.key === 'Enter' && filtered[selectedIndex]) {
                execute(filtered[selectedIndex]);
              }
            }}
            placeholder="Type a command or search files…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--sb-fg)', fontSize: 14,
            }}
          />
          <kbd style={{
            fontSize: 10, padding: '2px 5px', borderRadius: 3,
            border: '1px solid var(--border)', color: 'var(--muted)',
            background: 'rgba(255,255,255,.05)', fontFamily: 'monospace',
          }}>Esc</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: 360, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              No commands match "{query}"
            </div>
          ) : (
            filtered.map((cmd, i) => {
              const active = i === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 12px', cursor: 'pointer',
                    background: active ? 'var(--accent)' : 'transparent',
                    color: active ? '#fff' : 'var(--sb-fg)',
                  }}
                >
                  {cmd.icon && (
                    <span style={{ fontSize: 15, flexShrink: 0, width: 20, textAlign: 'center' }}>
                      {cmd.icon}
                    </span>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13 }}>{cmd.label}</div>
                    {cmd.description && (
                      <div style={{ fontSize: 11, opacity: 0.6, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cmd.description}
                      </div>
                    )}
                  </div>
                  {cmd.shortcut && (
                    <kbd style={{
                      fontSize: 10, padding: '2px 6px', borderRadius: 3, flexShrink: 0,
                      border: `1px solid ${active ? 'rgba(255,255,255,.3)' : 'var(--border)'}`,
                      color: active ? 'rgba(255,255,255,.8)' : 'var(--muted)',
                      background: 'rgba(255,255,255,.05)', fontFamily: 'monospace',
                    }}>
                      {cmd.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          display: 'flex', gap: 16, padding: '5px 12px',
          borderTop: '1px solid var(--border)',
          fontSize: 10, color: 'var(--muted)',
        }}>
          <span><kbd style={{ fontFamily: 'monospace' }}>↑↓</kbd> navigate</span>
          <span><kbd style={{ fontFamily: 'monospace' }}>↵</kbd> select</span>
          <span><kbd style={{ fontFamily: 'monospace' }}>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
