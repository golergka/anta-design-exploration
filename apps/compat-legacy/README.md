# compat-legacy

Compatibility v2: Bootstrap application with a staged Anta migration.

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

The `compat-legacy-baseline` Git tag identifies the Bootstrap-only version used by the comparison test.
