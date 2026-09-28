# Implementation Plan: Store Locator and Product Catalog

**Branch**: `001-store-locator-catalog` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-store-locator-catalog/spec.md`

## Summary

Build the store finder as a responsive Angular single-page application. A lazy-loaded store-locator feature presents a Leaflet map, a searchable accessible store list, and selected-store details and products. Store and product fixtures are served through focused RxJS services with the required 800 ms delay. The selected store is represented in the URL so direct links and browser history restore the same selection. OpenStreetMap tiles provide the initial map layer; the store list remains usable if tiles fail or coordinates are invalid.

## Technical Context

**Language/Version**: TypeScript 6.0.2 with Angular 22.2 (versions declared in `package.json`).

**Primary Dependencies**: Angular common, core, forms, router; RxJS 7.8; Leaflet and its TypeScript declarations (to be added for the map).

**Storage**: In-memory TypeScript fixtures; no persistence or backend API is supplied.

**Testing**: Angular unit-test builder with Vitest dependencies; `npm test` runs the project's unit tests. `npm run build` validates the production bundle.

**Target Platform**: Browser-based SPA, served locally by Angular CLI or as static assets from Docker/Nginx. Map tiles require network access.

**Project Type**: Single Angular web application.

**Performance Goals**: Store search returns local fixture matches within the 2-second success criterion. The configured 800 ms mock-service delay makes loading states observable. Keep within the existing Angular production initial-bundle budget (500 kB warning, 1 MB error).

**Constraints**: No live store or inventory API. Preserve the supplied Store and Product field shapes. Mock service calls use RxJS and an 800 ms delay. Keep keyboard-accessible list selection independent from map interaction. Use the OpenStreetMap standard tile service only with visible attribution and its usage policy; tile failure must not block store selection.

**Scale/Scope**: Challenge-sized representative store/product fixtures, one store-finder feature, and its selected-store URL state. No server-side account, inventory, or write flows.

## Constitution Check

**Pre-design gate: PASS.** The design follows the constitution without exceptions:

- Type safety: use strict TypeScript and the declared Store/Product shapes; avoid `any`.
- Accessibility: retain a semantic keyboard-operable store list, visible focus, labelled controls, and clear loading/error/empty feedback; do not make the map the only selection method.
- State: use signals for component-local state and derived state; keep mock data delivery in RxJS services.
- Angular structure: use standalone components and lazy-loaded feature routes; follow Angular defaults without explicit `standalone` or `OnPush` metadata.
- Mock data: keep store and product services separate and apply the required 800 ms RxJS `delay`.
- Styling and templates: use SCSS with BEM names, native control flow, explicit imports, and class/style bindings. No static bitmap assets are required.

**Post-design gate: PASS.** The planned route, data, map fallback, and validation artifacts retain these constraints. No constitution exceptions are needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-store-locator-catalog/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── ui-contract.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── core/
│   │   ├── data/                  # typed representative store/product fixtures
│   │   ├── models/                # Store and Product interfaces
│   │   └── services/              # separate delayed RxJS data services
│   └── features/
│       └── store-locator/
│           ├── store-locator.routes.ts
│           ├── pages/              # routed finder view
│           └── components/         # search, store list, map, details, catalog
├── styles.scss
└── main.ts
Dockerfile
nginx.conf
README.md
```

**Structure Decision**: Keep the single Angular application and organize the feature under `src/app/features/store-locator`; shared domain models, fixtures, and the two mock services live under `src/app/core`. Lazy-load the store-locator routes from the root router. Keep Docker/Nginx and challenge setup documentation at repository root.
