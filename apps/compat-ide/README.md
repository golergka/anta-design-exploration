# compat-ide

Compatibility v2: SQL editor using Anta, Tailwind, and Monaco.

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
