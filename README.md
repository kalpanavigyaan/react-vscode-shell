# react-vscode-shell

A React + TypeScript + Vite template that replicates the Visual Studio Code desktop UI in the browser. Use it as a starting point for any developer tool, AI agent manager, or productivity app that needs a familiar IDE-style interface.

![Shell layout: activity bar · sidebar · editor tabs · terminal panel · status bar](docs/screenshot.png)

## What's included

### IDE shell
| Component | Description |
|-----------|-------------|
| `ActivityBar` | Left icon strip — switches between Explorer, Search, Git, Extensions, Settings, and custom panels |
| `FileExplorer` | Collapsible file tree with create / rename / delete |
| `EditorTabs` | Tabbed editor header with unsaved-change indicators |
| `MonacoEditor` | Full Monaco editor — syntax highlighting, IntelliSense, multi-cursor, minimap |
| `TerminalPanel` | Bottom console panel, resizable by drag |
| `PreviewPanel` | Live HTML/CSS/JS preview in a sandboxed iframe |
| `SearchPanel` | Global text search across all open files |
| `SettingsPanel` | Editor settings — font size, tab size, word wrap, minimap, theme |
| `StatusBar` | Bottom bar showing language, cursor position, file count |
| `TitleBar` | Top bar with title and light/dark theme toggle |

### Workspace features
- Persistent workspace via `localStorage` — files, tabs, and settings survive refresh
- GitHub Gist sync — save / load the entire workspace to a Gist
- ZIP export of all files
- Resizable sidebar and terminal panel (persisted across sessions)
- Keyboard shortcuts: `Ctrl+S` save · `Ctrl+B` explorer · `Ctrl+\`` terminal · `F5` preview

### Example custom panel: Fleet Console
The `src/fleet/` folder contains a complete working example of a custom activity-bar panel — a multi-agent AI manager built on top of this shell. It demonstrates:
- Adding a custom icon to the `ActivityBar`
- Replacing the editor area with a full-width panel
- Connecting to a backend API via SSE for live state
- Building tabbed sub-panels (Sessions, History, Controls, Queue)

Use it as a reference when adding your own panels.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** — dev server and production build
- **Monaco Editor** (`@monaco-editor/react`) — the same editor engine as VS Code
- **Lucide React** — icon set
- **CSS custom properties** — all colours and spacing in `src/index.css`; swap the theme by changing a handful of variables

## Getting started

```bash
npm install
npm run dev        # dev server at http://localhost:5174
npm run build      # production build → dist/
```

## Adding a custom panel

1. Create `src/panels/MyPanel.tsx`
2. Add an icon + view name to `ActivityBar.tsx`
3. Handle the view in `IDE.tsx` — either as a sidebar view or a full-width takeover (see the `fleet` branch for a full-width example)

## Theming

All design tokens are CSS variables in `src/index.css`:

```css
--accent:   #007acc;   /* blue highlight */
--border:   #2d2d2d;   /* panel borders  */
--ed-bg:    #1e1e1e;   /* editor bg      */
--sb-bg:    #252526;   /* sidebar bg     */
--sb-fg:    #cccccc;   /* default text   */
--muted:    #858585;   /* secondary text */
--red:      #f44747;
--cyan:     #4ec9b0;
```

Override any variable in your app's CSS to retheme the entire shell instantly.

## Credits

This project was inspired by and draws on ideas from:

- **[codeharborhub/web-editor](https://github.com/codeharborhub/web-editor)** — Monaco editor integration, GitHub Gist sync pattern, live HTML/CSS/JS preview in a sandboxed iframe, and multi-language support approach.

- **[design-sparx/code-editor-x](https://github.com/design-sparx/code-editor-x)** — Multi-file tabbed editing patterns, resizable draggable panels, hierarchical file tree operations, and persistent layout preferences.

## Keywords

`react` `vscode` `vscode-style` `ide` `monaco-editor` `code-editor` `typescript` `vite` `template` `shell` `developer-tools` `activity-bar` `panel` `dark-theme` `ai` `agent`

## License

MIT
