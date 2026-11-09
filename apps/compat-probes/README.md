# compat-probes

Compatibility v2: native HTML and Anta browser test fixtures.

## Run

```sh
npm ci
npm run dev
```

Build with `npm run build`. Dependency versions are recorded in `package-lock.json`.

## Tests

```sh
npx playwright install chromium
npm run build
npm test
```

Install Firefox and WebKit with `npx playwright install firefox webkit`. Run WebKit separately with `npm run test:webkit`.
