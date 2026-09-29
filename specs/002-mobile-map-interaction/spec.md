# Feature Specification: Mobile Map Interaction

**Feature Branch**: `fix/mobile-map-no-pan-on-selection`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "En dispositivo movil al clicar un icono/una tienda en el mapa no te mueva la vista centrandose en el mapa, dejar esto solo para desktop. En movil los iconos en el mapa se ven muy grandes, en desktop esta correcto. Crear un servicio reutilizable para saber si isMobile."

## User Scenarios & Testing

### User Story 1 - Center a selected store without scrolling the page (Priority: P1)

As a mobile visitor, I want the map to center the selected store without the page scrolling, so I can see the chosen location without the browser jumping to another part of the page.

**Why this priority**: Unexpected page movement interrupts store selection on small screens, while centering the map on the selected store remains useful.

**Independent Test**: At a responsive viewport, note the page scroll position, select stores from the map and list, and confirm the map centers each selected store while the page scroll position stays unchanged.

**Acceptance Scenarios**:

1. **Given** a map displayed at a responsive viewport, **When** a visitor selects a store from a map marker, **Then** the map centers on that store and the page scroll position remains unchanged.
2. **Given** a map displayed at a responsive viewport, **When** a visitor selects a store from the list, **Then** the map centers on that store and the page scroll position remains unchanged.
3. **Given** a map displayed at a desktop viewport, **When** a visitor selects a store from the map or list, **Then** the map recenters on the selected store as it does today.

---

### User Story 2 - Read store markers on mobile (Priority: P2)

As a mobile visitor, I want store markers sized for a small screen, so they remain easy to distinguish without overwhelming the map.

**Why this priority**: Oversized markers obscure map details and make nearby locations harder to scan.

**Independent Test**: Compare the map at mobile and desktop viewports and confirm mobile markers are visibly smaller while desktop markers retain their current appearance.

**Acceptance Scenarios**:

1. **Given** the map at a mobile viewport, **When** store markers are shown, **Then** their visible size is reduced and each remains positioned on its store location.
2. **Given** the map at a desktop viewport, **When** store markers are shown, **Then** their current size and appearance are preserved.

### Edge Cases

- Resizing between responsive and desktop widths applies the marker presentation for the current width; selecting a store centers the map at either width.
- Stores without valid coordinates remain unavailable as map markers, while existing list selection continues to work.

## Requirements

### Functional Requirements

- **FR-001**: Selecting a store from the map or list on a responsive viewport MUST update the selected store and center the map on it without changing document scroll position.
- **FR-002**: Selecting a store from the map or list on a desktop viewport MUST center the map on that store.
- **FR-003**: Store markers MUST appear smaller on mobile viewports while remaining anchored to their store locations.
- **FR-004**: Store markers MUST retain their current size and appearance on desktop viewports.
- **FR-005**: Responsive store selection MUST preserve the document scroll position whether selection starts from the map or list.

### Key Entities

- **Store marker**: A selectable map representation of a store with a geographic location.

## Success Criteria

### Measurable Outcomes

- **SC-001**: In all responsive store-selection checks from the map and list, the map centers on the selected store while document scroll position remains unchanged.
- **SC-002**: In all desktop store-selection checks from the map and list, the map centers on the selected store.
- **SC-003**: A viewport comparison confirms markers are visibly smaller on mobile and keep their geographic anchor; desktop marker appearance remains unchanged.
- **SC-004**: Map and list selection both center the selected store at every viewport width; responsive selection preserves document scroll position.

## Assumptions

- The existing responsive layout breakpoint defines when the application is considered mobile.
- Selecting a store continues to update the store details on every viewport size.
- “Smaller markers” means reducing their visible footprint while preserving their geographic locations.
