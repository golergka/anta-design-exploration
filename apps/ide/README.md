# Orbit Studio

A frontend-only analytics IDE exploration built with React, Vite, Monaco, and Anta 0.3.38.

```sh
npm ci
npm run dev
npm run build
```

Open the local URL printed by Vite. Select files in the explorer or tabs to edit them. Edits live in memory until refresh. The workspace Problems panel lists three static issues across files; selecting one opens its file. Switch to Query results for sample rows, or use Run query to show the completed state. No SQL is executed and no connection, sync, or persistence is implemented. Other rail icons and project status are illustrative.

## Anta observations

- The full bundle setup is straightforward: `bundle.css` plus imports from `@antadesign/anta/bundle` provide registered components and styles. The `Button` run action, `Tag` status, and built-in `Icon` shapes work without custom icon assets.
- `Tabs` offers a compact tertiary presentation and a typed `onStateChange` payload. Its selection is managed separately from the output content here, because the editor's panel content has a custom layout.
- Anta has useful general-purpose controls, but no file tree or editor component in its documented component index. The explorer, editor tabs, issue rows, and IDE shell therefore need application-specific markup and CSS; Monaco supplies the editor.
- The full Monaco import makes the production JavaScript large: Vite warns that the main chunk exceeds 500 kB. The editor is bundled locally rather than relying on a CDN, but a production app should split or restrict Monaco's language contributions.
