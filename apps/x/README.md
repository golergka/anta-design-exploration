# X feed mock

A frontend-only social timeline built with Vite, React, TypeScript, and Anta 0.3.38.

```sh
npm ci
npm run dev
npm run build
```

The default “For you” timeline has sample posts. Write a post and select Post to add it locally; the character counter appears while writing. Likes and follow buttons toggle locally. “Following” shows an empty timeline, and the other navigation items show preview states. Search and the remaining toolbar actions are visual mock controls. All state resets on reload. The post photo is loaded from Unsplash and requires a network connection.

## Anta observations

- The full `bundle` and `bundle.css` setup made registration and styling straightforward; `Avatar` generates consistent user pictures from names without image assets, and `Icon` provides a useful typed set for the navigation and post actions.
- The component docs specify details that are easy to miss: `Input` uses `onValueChange` for its string value, while the search field's inner surface needs `::part(field)` for the pill treatment. Both are used in `src/main.tsx` and `src/style.css`.
- Anta's buttons top out at a documented 32px large size. The prominent X-style posting action needed a custom 50px height and dark surface. The social feed layout, composer, and engagement rows also needed application CSS and native controls; Anta does not provide a social-post composition.
- The built-in icon set covers generic actions, but lacks several exact social-network symbols, so the composer and view count use approximate icons. Generated avatars are convenient but have a visibly different character from photographic profile pictures.
