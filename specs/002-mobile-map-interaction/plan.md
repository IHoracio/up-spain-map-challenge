# Implementation Plan: Mobile Map Interaction

**Branch**: `fix/mobile-map-no-pan-on-selection` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-mobile-map-interaction/spec.md`

## Summary

Use a shared viewport utility with the store finder's existing 760 px responsive
breakpoint. Selecting a store from the map or list centers the Leaflet map on
that store at every viewport width. On responsive viewports, keep the document
scroll position unchanged. Reduce marker dimensions at the responsive breakpoint
while preserving the pin's geographic anchor.

## Technical Context

**Language/Version**: TypeScript 6.0.2 with Angular 22.2.

**Primary Dependencies**: Angular core and browser APIs; Leaflet 1.9.4; RxJS 7.8
remains in use for existing store and product loading.

**Storage**: None. Viewport mode and current map center are runtime UI state.

**Testing**: Angular unit-test builder with Vitest 5 is present. The validation
guide defines browser-based responsive and desktop acceptance checks.

**Target Platform**: Browser-based Angular single-page application.

**Project Type**: Single Angular web application.

**Performance Goals**: Viewport classification is synchronous and does not add
network requests or work to mock-data service flows.

**Constraints**: Use the existing 760 px responsive breakpoint. Preserve store
selection, route, details, and map centering at all widths. Keep responsive
document scroll stable for selections from both list and map. Marker resizing
must preserve the marker tip location. Follow strict TypeScript, Angular signal,
accessibility, and SCSS BEM project guidance.

**Scale/Scope**: One reusable viewport service, the store-map and store-locator
page selection/focus behavior, global Leaflet marker styling, and feature
documentation. No store/product model, route, or API changes.

## Constitution Check

### Pre-design gate: PASS

- Type safety: expose a boolean viewport check with explicit browser-document
  handling; use no `any` types.
- Accessibility: preserve keyboard-operable list and map selection. Responsive
  selection must not move focus to an off-screen heading or scroll the document.
- Signal-based state: keep existing signal state and use a small shared service
  for viewport classification; do not duplicate detection in components.
- Angular structure: use the Angular 22 service pattern and `inject()` in the
  standalone feature components.
- Mock data: no data-service behavior changes; existing RxJS calls retain their
  configured 800 ms delay.
- Styling: retain BEM selectors and scope responsive marker styling to the map.

No constitution exceptions are required.

## Project Structure

### Documentation (this feature)

```text
specs/002-mobile-map-interaction/
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
│   ├── core/
│   │   └── services/
│   │       └── viewport.service.ts                 # reusable responsive check
│   └── features/store-locator/
│       ├── pages/store-locator-page/
│       │   └── store-locator-page.ts               # avoid responsive document scroll
│       └── components/store-map/
│           └── store-map.ts                        # center selected store at all widths
└── styles.scss                                     # responsive Leaflet marker size
```

**Structure Decision**: Keep the viewport utility in `core/services` for reuse
and keep store-selection policy with the existing store-locator page and map.
Leaflet’s generated marker elements require the responsive override in global
styles, scoped under the existing `.store-map__canvas` BEM block.

## Design Decisions

1. Treat widths at or below 760 px as responsive, matching the current
   store-finder layout breakpoint. Widths above 760 px retain desktop behavior.
2. Center the map on a valid selected store from either selection path at every
   viewport width. The viewport service controls page focus behavior, not map
   centering.
3. The selected-store effect currently focuses the page heading. On responsive
   selection, preserve focus on the activated list button or map marker so the
   browser does not scroll the document. Keep the existing desktop focus behavior.
4. Reduce the default 25 by 41 px marker to approximately 19 by 31 px at the
   responsive breakpoint. Compensate for the dimension change so the pin tip
   stays at its geographic coordinate; do not change desktop marker styling.
5. Keep the utility read-only and synchronous. It must safely report desktop
   when the document has no browser `matchMedia` implementation.

### Post-design gate: PASS

The service is focused and typed, responsive focus behavior keeps the active
control visible, map selection remains keyboard available through the list, and
no mock API or data model behavior changes. Map centering is preserved at all
viewport widths. Responsive marker CSS uses the existing BEM block. No
exceptions are needed.
