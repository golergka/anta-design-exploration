# ChatGPT mock

A frontend-only conversation prototype using Anta 0.3.38. No messages leave the browser and nothing persists after reload.

```sh
npm ci
npm run dev
npm run build
```

Open the Vite URL printed by the dev command. The initial view shows a prepared conversation. Select another chat in the sidebar, search chat titles, or start a new chat to see the empty state and suggested prompts. Enter sends a message; Shift+Enter adds a line. New messages receive a canned response and create an in-memory chat. The attachment button inserts a placeholder; there is no upload. The sidebar can be collapsed, including on narrow screens. Like and copy controls are local demo interactions.

## Anta observations

- The full `bundle` and `bundle.css` setup registered and styled the components with only two imports. Buttons supply icons, accessible names, priorities, selected and disabled states; the copy preset handles clipboard feedback. The built-in generated Avatar also gave the account a distinct image without an asset.
- The documentation index and per-component examples made the actual icon names and Button props easy to verify. TypeScript caught invalid component props during `npm run build`.
- The chat composer needs a multiline, auto-growing text surface with actions inside its border. Anta's documented Input is oriented around its field wrapper, so this prototype uses a native textarea and an Anta Button for the send action. The conversation layout and prompt tiles also need application-specific CSS.
- Anta components render custom elements. Styling a sidebar navigation row required checking its exposed parts and layout rather than assuming ordinary button markup. The full bundle produces a 315 kB CSS and 453 kB JS build before gzip in this small prototype; granular imports may be preferable for a production app.
