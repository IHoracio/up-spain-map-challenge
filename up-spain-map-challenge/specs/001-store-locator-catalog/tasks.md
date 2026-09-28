# Tasks: Store Locator and Product Catalog

**Input**: Design documents from `specs/001-store-locator-catalog/` and the user-requested project quality gates.

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-contract.md`, `quickstart.md`

**Test strategy**: Use the existing Angular unit-test builder with Vitest. For each user story, complete all of its test-writing tasks and confirm the new tests fail before starting any implementation task for that story. `[P]` permits parallel work among tasks in the same stage only; it does not remove this test-before-implementation dependency. Reuse the production mock fixtures, typed test-data builders, and provider helpers across suites. Keep one test for each distinct acceptance behavior; do not copy the same scenario into multiple suites. Cover all acceptance scenarios, data boundaries, empty/error states, retry flows, keyboard paths, routes, and map fallbacks.

**Coverage gate**: Require at least 80% project-wide aggregate coverage for statements, branches, functions, and lines over all application TypeScript under `src/**/*.ts`. Exclude test files and declaration files only. Enforce this with the dedicated coverage command after all user stories are implemented; this is an aggregate project threshold, not an 80% threshold for each file.

**Organization**: Tasks are ordered by dependency and grouped by user story. Every task includes the implementation or test path.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Tasks that can run in parallel because they use different files and have no incomplete dependencies.
- **[Story]**: User story the task serves; Setup, Foundational, and Polish tasks have no story label.
- Paths are relative to the repository root.

## Phase 1: Setup

**Purpose**: Add map and coverage tooling, threshold configuration, and container entry point.

- [X] T001 Add Leaflet and its TypeScript declarations to `package.json` and update `package-lock.json`.
- [X] T002 Add a Vitest 5-compatible `@vitest/coverage-v8` dev dependency and a `test:coverage` script that runs `ng test --coverage --no-watch` in `package.json` and `package-lock.json`.
- [X] T003 Configure the Angular test target in `angular.json` to include all `src/**/*.ts` application files, exclude only `src/**/*.spec.ts` and `src/**/*.d.ts`, and enforce aggregate minimums of 80 for statements, branches, functions, and lines.
- [X] T004 [P] Ignore generated coverage output in `.gitignore`.
- [X] T005 [P] Create the production multi-stage `Dockerfile` and `nginx.conf` with Angular SPA fallback routing.

## Phase 2: Foundational

**Purpose**: Enforce repository TypeScript rules and establish typed data, delayed services, and reusable test support before feature work.

- [X] T006 Enable `"strict": true` in `tsconfig.json` and fix existing application and spec diagnostics without weakening strict compiler settings.
- [X] T007 [P] Define the `Store` interface in `src/app/core/models/store.model.ts` with the specified `id`, `name`, `latitude`, and `longitude` fields.
- [X] T008 [P] Define the `Product` interface in `src/app/core/models/product.model.ts` with the specified `id`, `storeId`, `name`, `price`, and `stock` fields.
- [X] T009 Implement coordinate validation in `src/app/core/utils/store-coordinates.ts`: latitude and longitude must be finite numbers within their geographic ranges.
- [X] T010 Add representative Spain store fixtures in `src/app/core/data/mock-stores.ts` with unique IDs and non-empty names; keep stores with invalid/missing runtime coordinates discoverable through list-only test cases.
- [X] T011 Add product fixtures in `src/app/core/data/mock-products.ts` with unique IDs, non-empty names, store IDs that resolve to stores, finite non-negative prices, non-negative stock, a zero-stock product, and a store with no products.
- [X] T012 [P] Implement `StoreService` in `src/app/core/services/store.service.ts` as a typed RxJS observable over store fixtures with an 800 ms `delay`.
- [X] T013 [P] Implement `ProductService` in `src/app/core/services/product.service.ts` as a typed RxJS observable over product fixtures with an 800 ms `delay`.
- [X] T014 Create reusable typed store/product builders, shared fixture imports, test-provider overrides for success/empty/error responses, and Leaflet test doubles in `src/testing/store-locator-test-helpers.ts`.
- [X] T015 Add foundational tests for coordinate boundaries, fixture uniqueness/references/product constraints, and each service's 800 ms observable behavior in `src/app/core/utils/store-coordinates.spec.ts`, `src/app/core/services/store.service.spec.ts`, and `src/app/core/services/product.service.spec.ts`; use T014 helpers instead of duplicating fixtures.

**Checkpoint**: Strict TypeScript, project-wide coverage enforcement, typed fixtures, delayed services, and reusable test support are ready.

## Phase 3: User Story 1 - Find a store and explore its products (Priority: P1, MVP)

**Goal**: Select a store from the map or list and see its location, positive-stock product count, and full associated catalog.

**Independent Test**: Without searching, select known stores from markers and list buttons. Confirm every fixture store with valid coordinates has one matching marker; each selection shows the matching store, exact associated products and prices/stocks, and the correct count of products with stock greater than zero. Confirm zero-stock products remain visible and stores without valid coordinates remain selectable from the list.

### Tests for User Story 1

- [X] T016 [P] [US1] Write map tests for every valid fixture coordinate producing a matching selectable marker, invalid coordinates producing no marker, and list-only selection remaining available in `src/app/features/store-locator/components/store-map/store-map.spec.ts`; confirm they fail before map implementation.
- [X] T017 [P] [US1] Write page/catalog tests for marker/list selection parity, store location and name, exact store-to-product association, correct price/stock display, and positive-stock product count in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.spec.ts`; use T014 helpers and confirm they fail before implementation.

### Implementation for User Story 1

- [X] T018 [P] [US1] Define the lazy store-locator route tree for `/stores` and `/stores/:storeId` in `src/app/features/store-locator/store-locator.routes.ts`.
- [X] T019 [P] [US1] Create the routed finder page with standalone metadata defaults, signal-based local state, and computed derived selection in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.ts`, `store-locator-page.html`, and `store-locator-page.scss`.
- [X] T020 [P] [US1] Build the Leaflet map component with valid-coordinate markers, keyboard-operable labelled markers, map keyboard controls, and visible OpenStreetMap attribution in `src/app/features/store-locator/components/store-map/store-map.ts`, `store-map.html`, and `store-map.scss`.
- [X] T021 [P] [US1] Build the semantic keyboard-operable store list with selected state and signal-based component APIs in `src/app/features/store-locator/components/store-list/store-list.ts`, `store-list.html`, and `store-list.scss`.
- [X] T022 [P] [US1] Build the selected-store name and location summary in `src/app/features/store-locator/components/store-details/store-details.ts`, `store-details.html`, and `store-details.scss`.
- [X] T023 [P] [US1] Build the associated product catalog with name, price, stock, and text out-of-stock status in `src/app/features/store-locator/components/product-catalog/product-catalog.ts`, `product-catalog.html`, and `product-catalog.scss`.
- [X] T024 [US1] Connect services, lazy routes, map/list events, store summary, and catalog in `src/app/app.routes.ts` and `src/app/features/store-locator/pages/store-locator-page/store-locator-page.ts`; use `inject()`, signals, native template control flow, and strict BEM styles.
- [X] T025 [US1] Run the User Story 1 suites in `src/app/features/store-locator/components/store-map/store-map.spec.ts` and `src/app/features/store-locator/pages/store-locator-page/store-locator-page.spec.ts`; reuse T014 test support and correct marker, selection, product, or count failures.

**Checkpoint**: A customer can explore all valid store markers, select a store with the map or accessible list, and inspect the matching catalog.

## Phase 4: User Story 2 - Search for a store by name (Priority: P2)

**Goal**: Search by full or partial name and select a result to show that store on the map and its catalog.

**Independent Test**: Search by full name, partial name, mixed case, and surrounding whitespace; select a result and confirm its URL, selected store, marker, and catalog. Check no matches and clearing search restores all stores.

### Tests for User Story 2

- [X] T026 [US2] Write full/partial, case-insensitive, whitespace-normalized, no-results, clear-search, and search-result route-selection tests in `src/app/features/store-locator/components/store-search/store-search.spec.ts` and `src/app/features/store-locator/pages/store-locator-page/store-locator-page.spec.ts`; use T014 helpers and confirm they fail before search implementation.

### Implementation for User Story 2

- [X] T027 [P] [US2] Build a labelled store search input with signal-based query state, clear action, and selection output in `src/app/features/store-locator/components/store-search/store-search.ts`, `store-search.html`, and `store-search.scss`.
- [X] T028 [US2] Connect normalized search results to the accessible list while retaining every valid marker on the map in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.ts` and `store-locator-page.html`.
- [X] T029 [US2] Route search-result selection to the matching store and pan to its marker when coordinates are valid in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.ts` and `src/app/features/store-locator/components/store-map/store-map.ts`.
- [X] T030 [US2] Run the User Story 2 suites in `src/app/features/store-locator/components/store-search/store-search.spec.ts` and `src/app/features/store-locator/pages/store-locator-page/store-locator-page.spec.ts`; reuse T014 helpers and verify representative searches return promptly within the 2-second criterion.

**Checkpoint**: Search handles matching, no-match, clear, and result selection without hiding valid store markers.

## Phase 5: User Story 3 - Use the finder across devices and recover from problems (Priority: P3)

**Goal**: Preserve store selection and recovery when data or map loading fails, and support keyboard and mobile use.

**Independent Test**: Use provider test doubles for no stores, no products, failed store/product loads and retry, and failed map tiles. Navigate by keyboard, check axe results, open direct/unknown routes, use browser history, and inspect a 360 px viewport.

### Tests for User Story 3

- [X] T031 [P] [US3] Write store/product loading, empty, failure and retry tests using shared response providers in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.spec.ts`; confirm they fail before implementing recovery states.
- [X] T032 [P] [US3] Write tile-error, invalid/missing-coordinate, unknown-store, unknown-path, direct-route, and browser-history tests in `src/app/features/store-locator/components/store-map/store-map.spec.ts` and `src/app/app.spec.ts`; reuse T014 test doubles and confirm they fail before implementation.
- [X] T033 [P] [US3] Add `axe-core` to `package.json` and `package-lock.json`, then write reusable axe and keyboard-flow checks for finder routes and selection controls in `src/app/features/store-locator/store-locator-accessibility.spec.ts`; confirm the suite reports actionable failures before accessibility fixes.

### Implementation for User Story 3

- [X] T034 [US3] Present store loading, empty, and recoverable error/retry states in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.ts` and `store-locator-page.html`.
- [X] T035 [US3] Present product loading, empty-catalog, and recoverable error/retry states in `src/app/features/store-locator/components/product-catalog/product-catalog.ts` and `product-catalog.html`.
- [X] T036 [US3] Handle Leaflet tile errors with a visible map warning while leaving the accessible store list selectable in `src/app/features/store-locator/components/store-map/store-map.ts` and `store-map.html`.
- [X] T037 [US3] Keep invalid-coordinate stores selectable and show an unavailable-location fallback in `src/app/features/store-locator/components/store-list/store-list.html` and `src/app/features/store-locator/components/store-details/store-details.html`.
- [X] T038 [US3] Show a recoverable unknown-store and unknown-path state and restore selected-store views from direct URLs and browser history in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.ts`, `store-locator-page.html`, `src/app/features/store-locator/store-locator.routes.ts`, and `src/app/app.routes.ts`.
- [X] T039 [US3] Ensure keyboard-operable search/list/map selection, meaningful accessible names, visible focus, and strict BEM styling in `src/app/features/store-locator/components/store-search/store-search.html`, `store-search.scss`, `src/app/features/store-locator/components/store-list/store-list.html`, `store-list.scss`, and `src/app/features/store-locator/components/store-map/store-map.ts`.
- [X] T040 [US3] Make the finder usable without horizontal page scrolling at 360 px and wider in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.scss`, `src/app/features/store-locator/components/store-list/store-list.scss`, `src/app/features/store-locator/components/store-map/store-map.scss`, and `src/styles.scss`.
- [X] T041 [US3] Run the User Story 3 state, route, keyboard, and axe suites in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.spec.ts`, `src/app/features/store-locator/components/store-map/store-map.spec.ts`, `src/app/app.spec.ts`, and `src/app/features/store-locator/store-locator-accessibility.spec.ts`; reuse T014 support and resolve failures until no axe violations remain.

**Checkpoint**: Data/map failures have recovery paths, and keyboard/mobile flows remain usable.

## Phase 6: Polish and delivery

**Purpose**: Document and verify the complete challenge and project-wide quality gate.

- [X] T042 [P] Document local setup, development, production build, Docker build/run, the strict TypeScript rule, the 80% coverage gate, technical decisions, improvements, future work, and AI/external tool use when applicable in `README.md`.
- [X] T043 [P] Update `specs/001-store-locator-catalog/quickstart.md` with `npm run test:coverage`, the four global 80% coverage metrics, all acceptance/edge-case scenarios, and the keyboard, 360 px, direct-route, map-failure, and Docker checks.
- [X] T044 Run `npm run test:coverage` across all `src/**/*.ts` production code and meet at least 80% aggregate statements, branches, functions, and lines; use `coverage/index.html` to find gaps and add focused tests with T014 helpers rather than duplicate scenarios.
- [X] T045 Run `npm test -- --no-watch`, `npm run build`, and Docker/deep-link checks from `README.md`; fix strict compilation, test, build, coverage, or deployment failures in the affected files. Validation passed: 8 test files and 37 tests; production build; Docker image build; and HTTP 200 responses for `/` and `/stores/2` from the running Nginx container.

## Requirements and acceptance coverage

| Requirement | Planned coverage |
|---|---|
| FR-001 | T016, T020 |
| FR-002 | T016, T021, T024 |
| FR-003 | T017, T022, T024 |
| FR-004 | T017, T023 |
| FR-005 | T026-T028 |
| FR-006 | T026, T028-T029 |
| FR-007 | T030-T031, T034-T035, T037 |
| FR-008 | T032, T036 |
| FR-009 | T033, T039, T041 |
| FR-010 | T040, T043 |
| FR-011 | T005, T042, T045 |
| FR-012 | T018, T032, T038, T045 |
| SC-001 | T016, T020 |
| SC-002 | T017, T023-T024 |
| SC-003 | T026-T030 |
| SC-004 | T033, T039, T041 |
| SC-005 | T040, T043 |
| SC-006 | T030-T037, T043 |
| SC-007 | T005, T042-T045 |

## Dependencies and execution order

### Phase dependencies

- Setup (Phase 1) can begin immediately.
- Foundational (Phase 2) follows Setup and blocks all user stories. Strict mode and reusable test support must be in place before story work.
- User Story 1 follows Foundational and is the MVP increment.
- User Story 2 follows User Story 1 because it reuses the finder selection and catalog flow.
- User Story 3 follows User Stories 1 and 2 because it covers failure recovery, accessibility, route history, and responsive behavior across the completed finder.
- Polish follows all desired stories; full challenge delivery includes the global coverage gate and Docker/README validation.

### User story dependencies

- **US1 (P1)**: After Foundational; no dependency on another story.
- **US2 (P2)**: After US1; depends on the shared store selection and map/catalog integration.
- **US3 (P3)**: After US1 and US2; validates fallback and accessibility across the complete finder.

### Parallel opportunities

- T004 and T005 use separate setup files.
- T007 and T008 define separate models.
- T012 and T013 implement separate services after their fixture dependencies.
- T016 and T017 are independent US1 test files; T020-T023 are separate UI components after the page contract is agreed.
- T031-T033 use separate tests and can be prepared in parallel after the shared test helpers are ready.
- T042 and T043 update separate documentation files.

## Parallel Example: User Story 1

After T016 and T017 define the expected behavior, these separate components can be implemented concurrently:

- Task: `T020` Map component in `src/app/features/store-locator/components/store-map/`
- Task: `T021` Accessible store list in `src/app/features/store-locator/components/store-list/`
- Task: `T022` Store details in `src/app/features/store-locator/components/store-details/`
- Task: `T023` Product catalog in `src/app/features/store-locator/components/product-catalog/`

## Implementation strategy

### MVP first

1. Complete Setup and Foundational phases, including strict TypeScript and reusable test fixtures.
2. Complete User Story 1 and validate all its selection, marker, product, and stock-count criteria.
3. Stop for review; this MVP delivers the primary store-finding and catalog flow.

### Incremental delivery

1. Deliver User Story 1 as the core finder.
2. Add User Story 2 search and route selection.
3. Add User Story 3 recovery, accessibility, map fallback, responsive behavior, and unknown-route handling.
4. Complete the project-wide 80% coverage gate and README/Docker validation.

## Notes

- The coverage target is an aggregate across every application TypeScript source file under `src/**/*.ts`; only test and declaration files are excluded. Templates and SCSS are checked through rendered-component, axe, keyboard, and responsive scenarios rather than TypeScript line coverage.
- The four coverage dimensions (statements, branches, functions, lines) must each meet 80% overall. No per-file 80% gate is imposed.
- All suites should reuse the production fixtures and T014 typed helpers where practical, with edge-case overrides only where needed; do not duplicate the same acceptance scenario across suites.
- Story test tasks are scheduled before their story implementations. Coverage is enforced as a final project-wide gate so incremental story tests do not fail only because later stories are not implemented yet.
- All services remain focused, use `inject()`, return RxJS observables, and preserve the 800 ms mock delay. Components use signals/computed state, native standalone defaults, and SCSS BEM conventions.
