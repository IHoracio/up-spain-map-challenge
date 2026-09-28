# Research: Mobile Map Interaction

## Decision: Use the existing 760 px responsive boundary

**Rationale**: `store-locator-page.scss` already switches the finder workspace
to one column at `max-width: 760px`. The viewport utility and responsive focus
behavior use this same boundary so responsive layout and selection behavior
agree.

**Alternatives considered**: Add a device-type or user-agent check. Rejected
because interaction depends on available layout width, not the physical device.

## Decision: Center the map while preventing document movement on responsive selection

**Rationale**: `StoreMapComponent.syncMap()` calls `panTo()` when the selected
route ID changes. `StoreLocatorPage.focusSelectedView` also focuses the page
heading after selection, which can make the browser scroll. List and marker
selection both navigate through `selectStore`. Center the map on the selected
store at every viewport width. On responsive user selection, leave focus on the
activated control so the document does not scroll; desktop retains heading
focus.

**Alternatives considered**: Disable Leaflet panning on responsive viewports.
Rejected because the map should still show the selected store. Use
`focus({ preventScroll: true })` on an off-screen heading. Rejected because it
can move keyboard focus outside the visible area while hiding the scroll
movement.

## Decision: Resize the Leaflet marker while preserving its tip coordinate

**Rationale**: The shared marker icon uses Leaflet's default 25 by 41 px icon
with a bottom-centered anchor. A responsive 19 by 31 px image needs a small
position compensation because Leaflet continues positioning the marker using
the default anchor. Scope the rule to `.store-map__canvas` so other Leaflet
content is unaffected.

**Alternatives considered**: Change the map's zoom level. Rejected because it
changes geographic context and does not reduce marker overlap consistently.
Replace the marker asset. Rejected because the existing asset is suitable and
the requested change is size only.

## Decision: Keep viewport detection in a shared core service

**Rationale**: The feature needs a shared responsive classification for page
focus management and future components. A focused root service centralizes the
breakpoint and makes the check reusable without altering API/data services.

**Alternatives considered**: Duplicate `matchMedia` checks in each component.
Rejected because the breakpoints could drift. Use a user-agent detector.
Rejected because responsive behavior is based on viewport width.

## Resolved Unknowns

- Responsive threshold: 760 px, taken from the current store-finder layout.
- Store/product persistence: none; the feature only reads current viewport and
  existing route/store state.
- External contracts: no API or data contract changes; the interaction contract
  is documented in `contracts/ui-contract.md`.
