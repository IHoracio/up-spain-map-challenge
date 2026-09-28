# Quickstart and Validation Guide

## Prerequisites

- Git and Node.js/npm for local development. Use the npm version compatible with the repository lockfile/package-manager declaration.
- Docker for the container path; Docker users do not need Node.js or project dependencies installed on the host.

## Local development

```sh
npm ci
npm start
```

Open `http://localhost:4200`. On first load, confirm that loading feedback is visible during the mock service's 800 ms delay, then confirm stores and valid-coordinate markers appear. Select a marker and a list item and verify the same selected-store URL, details, positive-stock count, and associated products. Search by full and partial names, check no matches, and clear the query. Verify that a zero-stock product remains visible and is not included in the available-product count.

## Automated checks

```sh
npm test -- --no-watch
npm run test:coverage
npm run build
```

The coverage command enforces **80% aggregate minimum coverage for each of statements, branches, functions, and lines** across `src/**/*.ts`. It excludes only `*.spec.ts` and `*.d.ts` files. Inspect `coverage/index.html` when a metric is below its threshold. The production build must respect the bundle budgets in `angular.json`.

The unit/component suites cover:

- Every fixture store with valid coordinates has a selectable marker; invalid or missing coordinates create no marker but do not remove the store from the accessible list.
- Selecting from markers, list items, or search results selects the same store and URL. Product association, displayed price and stock, and positive-stock counts match the fixtures; zero-stock products remain visible.
- Full and partial, case-insensitive search accepts surrounding whitespace; no matches are announced, and clearing search restores all stores.
- Store and product loading, empty results, failed loads, and retry; a store with no products; unknown store IDs and application paths; direct routes; and browser back/forward history.
- Failed map tiles produce a warning while list selection remains available. Keyboard search and selection, visible focus, map control labels, and axe WCAG A/AA checks are covered.

## Acceptance and edge-case review

- Select every map marker and several list entries. Confirm the store name, location, exact catalog, and positive-stock count; check that a zero-stock product has an out-of-stock label.
- Search by a full name, a partial name, mixed case, and whitespace-padded text. Try a no-match query and clear it.
- Confirm a store with unavailable coordinates stays selectable and reports its unavailable location. Confirm a store with no products shows the empty catalog state.
- Use the service test providers to check loading, empty, error, and retry behavior for stores and products. Simulate tile failure and confirm list selection still works.
- Open `/stores`, a known `/stores/{id}`, an unknown store ID, and an unknown application path directly. Use browser back and forward after changing stores.
- Complete search and store selection with the keyboard, checking visible focus and accessible control names. Check the finder at 360 px and wider for horizontal scrolling.
- Build and run the Docker image, open the application, refresh a selected-store route, and verify the SPA fallback restores the route.

## Manual accessibility and responsive checks

- Complete search, store selection, retry, and catalog review with keyboard only; confirm visible focus and useful accessible names.
- Test the map keyboard controls and marker activation, then repeat selection using only the accessible store list.
- Simulate failed tile requests and verify the map warning while list selection still works.
- Check the finder at 360 px and desktop widths; verify no horizontal page scrolling.
- Open `/stores` and a known `/stores/{id}` directly, then use browser back/forward. Open an unknown store ID and confirm the not-found recovery link.

## Docker

Build and run the static production application without installing dependencies on the host:

```sh
docker build -t up-spain-map-challenge .
docker run --rm -p 8080:80 up-spain-map-challenge
```

Open `http://localhost:8080`. Confirm that the finder loads and that a direct refresh on `/stores/{id}` is served by the SPA fallback and restores selection. Map tiles need internet access; if tile requests fail, the store list remains usable.

## Expected result

The local and Docker deployments expose the same responsive store finder. Search/list/map selection resolves to one store, the catalog contains only that store's products, loading feedback is observable, route history is usable, and map/data failure paths leave a recovery path.
