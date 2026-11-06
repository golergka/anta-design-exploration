# Observability overview

A frontend-only, Datadog-inspired dashboard built with React, Vite, Anta 0.3.38, and Anta Plot 0.1.7. All data is illustrative.

```sh
npm ci
npm run dev
npm run build
```

The environment and time controls toggle their labels. Service tabs filter to the alerting service, and the search field filters service names, including an empty state. Other navigation and action buttons show a demo notice; they do not connect to a backend. Chart points support Anta Plot's default hover tooltip.

## Developer observations

- Anta's `Card`, `Title`, `Text`, `Tag`, and `Button` supply consistent surfaces, typography, semantic status colors, and action priorities without hand-building those primitives. The installed component pages include prop examples and explicit size and tone vocabularies.
- Anta Plot's `area` and `line` series compose in one `Plot`, making the three time-series cards straightforward. Plot requires a separate package, stylesheet, and surface registration even when Anta's full bundle is loaded; its notebook examples also use a different `plot()` API from the React `<Plot>` setup.
- Cards do not have a dedicated actions region, so the chart and table headers use custom flex layouts. The dashboard shell and compact table also need application CSS. The full bundle plus plotting library produces a Vite chunk-size warning (about 770 kB JavaScript before gzip in this build).
