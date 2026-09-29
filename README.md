# UP Spain Store Finder

Responsive Angular application to find stores across Spain, search by store name, and browse each store's product catalog.

## Run locally

Requirements: Git, Node.js, and npm versions compatible with the `packageManager` field in `package.json`.

```sh
git clone <repository-url>
cd up-spain-map-challenge
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200). Mock store and product services use an 800 ms RxJS delay so loading states can be seen. The map uses OpenStreetMap tiles and needs an internet connection; its attribution is shown below the map. Store search and the accessible list continue to work if map tiles fail.

## Checks and production build

```sh
npm test -- --no-watch
npm run test:coverage
npm run build
```

Application TypeScript is compiled in strict mode. The coverage command enforces aggregate minimums of 80% for statements, branches, functions, and lines across `src/**/*.ts`, excluding only spec and declaration files. It writes the HTML report to `coverage/index.html`.

## Docker

Docker builds the production bundle in a Node build stage and serves it with Nginx. A host Node.js installation and host project dependencies are not required.

```sh
docker build -t up-spain-map-challenge .
docker run --rm -p 8080:80 up-spain-map-challenge
```

Open [http://localhost:8080](http://localhost:8080). Refresh a direct route such as `/stores/2` to confirm Nginx's SPA fallback serves the application and the selected store is restored from the URL.

## Technical decisions

- The finder is a lazy-loaded Angular standalone feature. The selected store is encoded in `/stores/:storeId`, supporting direct links and browser history.
- Signals hold component state and derive search results, selection, and stock counts. Separate RxJS services provide typed in-memory store and product fixtures with the required simulated latency.
- Leaflet displays stores with valid coordinates. A semantic store list keeps stores with invalid coordinates discoverable and remains available when map imagery fails.
- SCSS uses BEM class names, Angular templates use native control flow, and interactive controls have accessible names and visible keyboard focus.
- Docker serves static production output with Nginx and falls back to `index.html` for client-side routes.

## Implemented improvements

- Normalized case-insensitive full and partial store search, including a clear action and no-results feedback.
- Store and product loading, empty, recoverable error, and retry states; map-tile warning; missing-location labels; and unknown-route recovery.
- Keyboard-operated map controls, focus management after store selection, responsive single-column layout on narrow viewports, route restoration, and automated axe checks.
- Strict TypeScript checking, reusable typed test helpers, project-wide coverage thresholds, and a multi-stage Docker deployment.

## Future improvements

- Connect the typed services to a production store and inventory API.
- Add server-side search and richer filtering as the catalog grows.
- Add a Spanish translation and locale-aware number formatting, including commas as decimal separators when Spanish is selected.
- Create a reusable spinner component and overlay it on components while they load data.
- Enlarge the map marker for the focused or selected store to make it easier to identify.
- Add browser-level visual and responsive checks against real map tiles and a deployed Nginx container.

## AI and external tools

GPT-6 Luna was used via the API for agentic programming, and GitHub Spec Kit supported specification-driven development. The application uses OpenStreetMap map tiles and displays the required contributor attribution; no external store or inventory API is used.
