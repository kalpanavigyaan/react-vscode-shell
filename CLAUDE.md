# react-vscode-shell — Claude Guide

A React 19 + TypeScript + Vite template that renders a Visual Studio Code–style IDE in the browser or as an Electron desktop app.

## Repo layout

```
src/
  main.tsx              React entry point
  App.tsx               Root: mounts <IDE>, manages dark/light theme
  index.css             App layout styles — imports ./fleet-theme.css
  fleet-theme.css       ALL colour/spacing tokens (single source of truth)
  types.ts              Shared types: FileNode, Tab, EditorSettings, ConsoleMsg
  components/           IDE shell (do not add app logic here)
    ActivityBar.tsx     Left icon strip — add new panel icons here
    EditorTabs.tsx      Tab bar above editor
    FileExplorer.tsx    File tree with create/rename/delete
    GitHubGist.tsx      Gist save/load modal
    IDE.tsx             Top-level layout — wires all components together
    MonacoEditor.tsx    Monaco editor wrapper
    PreviewPanel.tsx    Live HTML/CSS/JS preview iframe
    SearchPanel.tsx     Global text search
    SettingsPanel.tsx   Editor settings UI
    StatusBar.tsx       Bottom bar (language, cursor, file count)
    TerminalPanel.tsx   Console output panel
    TitleBar.tsx        Top bar + theme toggle + Electron window controls
  fleet/                Example custom panel — AI agent manager
    FleetConsole.tsx    Root of the Fleet panel
    types.ts            Fleet-specific types (Session, FleetState, …)
    api.ts              fetch helpers — apiGet / apiPost / SSE
    …                   25+ sub-components (see src/fleet/)
  lib/
    fs.ts               File tree helpers (createFile, findById, getPath, …)
    storage.ts          localStorage workspace save/load + ZIP export
electron/
  main.js               Electron main process — creates BrowserWindow
  preload.js            Exposes window.electronShell to renderer
public/
  favicon.svg
  icons.svg
```

## Theme system

All colours are CSS custom properties defined in `src/fleet-theme.css` and overridden for light mode in `src/index.css`. **Never hard-code colours** — always use a variable:

| Variable | Use |
|----------|-----|
| `--accent` | Blue highlight (#007acc) |
| `--border` | Panel borders |
| `--ed-bg` | Editor / main background |
| `--sb-bg` | Sidebar background |
| `--sb-fg` | Default text |
| `--muted` | Secondary / placeholder text |
| `--red`, `--green`, `--amber`, `--cyan` | Status colours |

## Adding a custom panel

### 1. Create the panel component

```tsx
// src/panels/MyPanel.tsx
export function MyPanel() {
  return <div style={{ padding: 16, color: 'var(--sb-fg)' }}>My panel</div>;
}
```

### 2. Register the icon in ActivityBar

In `src/components/ActivityBar.tsx`, add a new `ActivityView` string and an icon entry to the `TOP_ICONS` or `BOTTOM_ICONS` array.

### 3. Wire it up in IDE.tsx

For a **sidebar panel** (like Explorer or Search): add a branch to the `{activeView === 'mypanel' && <MyPanel />}` block inside the sidebar `<div>`.

For a **full-width takeover** (like Fleet Console): follow the `activeView === 'fleet'` pattern — render outside the `.workbench` div so the panel fills the entire content area.

## Electron notes

- `electron/main.js` loads `http://localhost:5174` in dev and `dist/index.html` in production.
- The custom title bar (`TitleBar.tsx`) calls `window.electronShell.minimize/maximize/close` when running inside Electron. In browser mode those calls are no-ops (the API is undefined).
- Add IPC channels in `electron/main.js` → `ipcMain.handle(...)` and expose them in `electron/preload.js` → `contextBridge.exposeInMainWorld('electronShell', {...})`.

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server at http://localhost:5174 |
| `npm run build` | TypeScript check + Vite production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run electron:dev` | Vite dev server + Electron side by side |
| `npm run electron:build` | Production build + electron-builder → `dist-electron/` |

## Fleet Console example panel

`src/fleet/` connects to a separate orchestrator backend at `http://localhost:4318`. It demonstrates the full pattern for a real custom panel:

- `FleetConsole.tsx` — root, manages SSE connection and session selection
- `ChatView.tsx` — renders conversation messages with markdown and tool calls
- `ControlsPane.tsx` — tabbed Config / Dirs / Actions panel
- `HistoryPane.tsx` — scrollable session history with right-click context menu
- `api.ts` — `apiGet`, `apiPost`, `openSSE` helpers

When building a new app, copy the structure (not the fleet-specific logic) and connect to your own backend.
