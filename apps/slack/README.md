# Northstar workspace mock

A frontend-only Slack-inspired workspace built with React, Vite, TypeScript, and Anta 0.3.38.

```sh
npm ci
npm run dev
npm run build
```

Open the local URL printed by Vite. The initial `#spring-launch` channel contains a launch conversation, reactions, an attachment preview, and reply links. Choose another channel or person for an empty conversation; open Files or About for alternate states. Reply links open a thread panel. Search filters the current channel's message text and authors. Type a message and press Enter or the send button; Shift+Enter adds a line. Reactions toggle visually. Other preview controls display a notice. Data is local to the page and resets on reload; thread replies are illustrative.

## Anta observations

- The full bundle requires both `@antadesign/anta/bundle` and `bundle.css`. Once loaded, `Avatar` generates consistent, distinctive portraits from a name and supports presence badges without image assets; this is useful for the repeated member lists and message rows.
- `Button` supplies keyboard focus and icon-only accessible names, and `Title`, `Text`, and `Tag` cover basic typography and status. Its documented `priority`, `tone`, and `size` props make the composer action and channel controls straightforward.
- The built-in icon vocabulary is finite: the installed `IconShapes` declarations have `chat` and `more`, but no `headphones` or `ellipsis`. The huddle control therefore uses `chat`; checking the declarations avoided assuming names from another library.
- The chat shell, compact sidebar rows, message stream, and rich-text composer have no direct Anta equivalent in the documented component index. These are composed with native controls and app CSS. The formatting toolbar is visual only, so this mock does not imply rich-text editing works.
