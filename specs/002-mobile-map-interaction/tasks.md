# Tasks: Mobile Map Interaction

**Input**: Design documents from `/specs/002-mobile-map-interaction/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: No automated test tasks are included because the feature request does not ask for them. Manual acceptance scenarios are documented in `quickstart.md`.

**Organization**: Tasks are grouped by user story so each outcome can be delivered independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with another task because it changes a separate file and has no unfinished dependency.
- **[Story]**: User story label from `spec.md`.
- Every implementation task names its target file.

## Phase 1: Setup

**Purpose**: Confirm project setup and dependencies.

No project initialization or dependency changes are required. The existing Angular, Leaflet, and SCSS setup is used.

## Phase 2: Foundational

**Purpose**: Provide one responsive viewport classification before implementing the selection and marker behavior.

- [X] T001 Create a reusable `ViewportService` that reports responsive mode at widths up to and including 760 px, with a safe browser-support fallback, in `src/app/core/services/viewport.service.ts`.

**Checkpoint**: The feature has one shared responsive classification for subsequent UI work.

## Phase 3: User Story 1 - Center the selected store without scrolling the page (Priority: P1)

**Goal**: Selecting a store from the map or list updates the store and centers the map at every viewport width, while responsive selection preserves the document scroll position.

**Independent Test**: At 760 px or less, select a store from the list and another from a map marker; confirm details and URL update, the map centers on the selected store, and document scroll stays fixed. Above 760 px, confirm selection recenters the map.

### Implementation for User Story 1

- [X] T002 [P] [US1] Center valid selected stores with `panTo` at every viewport width in `src/app/features/store-locator/components/store-map/store-map.ts`.
- [X] T003 [P] [US1] Use `ViewportService` in selected-store focus handling so responsive list or marker selection keeps focus on its activated control and does not scroll the document in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.ts`.
- [ ] T004 [US1] Manually verify responsive map centering, unchanged document scroll, and focus behavior plus desktop recentering using `specs/002-mobile-map-interaction/quickstart.md`.

**Checkpoint**: The P1 selection flow works from both map and list at responsive and desktop widths.

## Phase 4: User Story 2 - Read store markers on mobile (Priority: P2)

**Goal**: Reduce marker size at responsive widths without changing desktop marker appearance or marker geographic anchors.

**Independent Test**: Compare marker size and anchor at 760 px and 761 px; confirm smaller responsive markers remain anchored to their store locations and desktop markers retain their current appearance.

### Implementation for User Story 2

- [X] T005 [P] [US2] Add a responsive Leaflet marker size rule under `.store-map__canvas` and compensate for the smaller dimensions so the pin tip stays on its coordinate in `src/styles.scss`.
- [ ] T006 [US2] Manually verify responsive marker dimensions, geographic anchoring, and unchanged desktop appearance using `specs/002-mobile-map-interaction/quickstart.md`.

**Checkpoint**: Responsive markers are smaller and remain aligned with their locations; desktop markers are unchanged.

## Phase 5: Polish and delivery

**Purpose**: Prepare the requested local PR draft and create separate documentation and implementation commits.

- [X] T007 Update the local PR title and description to match the delivered behavior in `description.md`; leave this draft out of both commits.
- [X] T008 Create the documentation commit for `specs/002-mobile-map-interaction/` with message `docs: align responsive map selection behavior`.
- [X] T009 Create the implementation commit for `src/app/core/services/viewport.service.ts`, `src/app/features/store-locator/components/store-map/store-map.ts`, `src/app/features/store-locator/pages/store-locator-page/store-locator-page.ts`, and `src/styles.scss` with message `fix: keep map centered without mobile page scroll`.

## Requirements and acceptance coverage

| Requirement | Planned coverage |
|---|---|
| FR-001 | T001-T004 |
| FR-002 | T002-T004 |
| FR-003 | T005-T006 |
| FR-004 | T005-T006 |
| FR-005 | T001-T003 |
| SC-001 | T002-T004 |
| SC-002 | T002-T004 |
| SC-003 | T005-T006 |
| SC-004 | T001-T004 |

## Dependencies and execution order

### Phase dependencies

- **Setup (Phase 1)**: Existing project setup is sufficient; no setup task is needed.
- **Foundational (Phase 2)**: Complete T001 before implementing either story.
- **User Stories (Phases 3-4)**: Both stories depend on T001 and can otherwise proceed independently.
- **Polish (Phase 5)**: Complete both stories and their manual acceptance checks before updating the PR draft and creating commits.

### User story dependencies

- **US1 (P1)**: Starts after T001. T002 and T003 are independent file changes; T004 follows both.
- **US2 (P2)**: Starts after T001. T005 is independent of US1 implementation; T006 follows T005.

### Parallel opportunities

- T002 and T003 can run in parallel because they change separate files.
- T005 can run in parallel with T002 and T003 after T001 because it changes a separate file.
- T008 and T009 must be performed sequentially because both update the Git index.

## Parallel Example: User Story 1

After T001, implement the map and page behavior in parallel:

- Task: `T002` in `src/app/features/store-locator/components/store-map/store-map.ts`
- Task: `T003` in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.ts`

## Implementation strategy

### MVP first

1. Complete T001 and the P1 User Story 1 tasks.
2. Confirm list and marker selection center the map at every width, while responsive selection preserves document scroll.
3. User Story 1 is the MVP because it resolves the disruptive selection behavior.

### Incremental delivery

1. Complete User Story 1 for responsive and desktop selection behavior.
2. Complete User Story 2 for responsive marker sizing.
3. Review the local PR draft and create the documentation and implementation commits separately.

## Phase 6: Convergence

- [X] T010 Align the specification, plan, data model, research, UI contract, and quickstart acceptance scenarios to require map centering while preserving document scroll on responsive viewports.
- [X] T011 Restore map centering for selected stores at responsive widths while retaining the page-scroll guard in `src/app/features/store-locator/pages/store-locator-page/store-locator-page.ts`.
