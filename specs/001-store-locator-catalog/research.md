# Research: Store Locator and Product Catalog

## Decisions

### Map library and loading boundary

**Decision**: Use Leaflet directly from the lazily loaded store-locator feature, with Leaflet TypeScript declarations. Use its keyboard navigation, keyboard-operable markers, title/alt marker labels, and visible attribution; expose a semantic HTML store list as a complete parallel selection path.

**Rationale**: The repository is a small Angular SPA with no existing map dependency. Direct Leaflet use keeps integration to the mapping API and avoids coupling the feature to a framework wrapper. Angular supports lazy-loading components and route trees with dynamic imports, keeping the map feature out of the initial route bundle. Leaflet documents keyboard map navigation and marker focus/activation options.

**Alternatives considered**: A framework-specific Leaflet wrapper would add an integration layer without existing project need. A vector-map stack adds styling/provider configuration beyond the challenge's raster map needs.

### Map tiles and service availability

**Decision**: Start with the OpenStreetMap standard raster tile endpoint over HTTPS and display the required contributor attribution visibly. Treat the layer as an external, best-effort service; report tile errors while retaining the store list and selection flow. Do not prefetch or bundle tiles. Keep the tile URL in one map configuration point so a compliant provider can replace it later.

**Rationale**: OpenStreetMap's tile policy specifies the HTTPS URL, visible attribution, browser Referer expectations, normal caching, and prohibits bulk download/offline prefetch. Its standard tile service provides no availability SLA, so map success cannot gate the core finder.

**Alternatives considered**: A commercial/provider-hosted tile service requires selecting a provider and satisfying its separate terms. Self-hosting tiles is outside the challenge scope.

### Data delivery and loading/error states

**Decision**: Use separate root-provided StoreService and ProductService methods returning typed RxJS observables over representative fixtures, with `delay(800)` in each mock request path. The feature owns loading, success/empty, and error/retry presentation. Test failures and empty fixtures through service/provider test doubles, not production-only URL flags.

**Rationale**: The repository contains no backend or supplied store data, and the project instructions require RxJS mock calls with 800 ms latency. Separate services preserve the boundary between fixture delivery and view state.

**Alternatives considered**: Browser storage or a new backend would add persistence/API scope not in the challenge. A component-owned fixture array would bypass the required service behavior and make failure/loading states harder to exercise.

### Store selection and browser navigation

**Decision**: Use `/stores` for the finder with no selection and `/stores/:storeId` for a selected store. Navigate to the selected-store URL from marker, list, or search result actions; treat the route parameter as the source of truth for selection and show a not-found state for unknown IDs.

**Rationale**: This supports direct links and normal browser history without duplicating selection state in a second store. The same lazy-loaded finder handles both URL forms.

**Alternatives considered**: A query parameter or an in-memory-only selection is less clear for a primary selected-store view and would weaken direct-access behavior.

### Search and coordinate availability

**Decision**: Search by trimmed, case-insensitive substring of store name. Keep all valid store markers on the map while search narrows the results/list; selecting any result selects and pans to its marker when coordinates are valid. Stores with missing, non-finite, or out-of-range coordinates remain in the list but have no marker.

**Rationale**: This preserves the requirement that every valid store be represented on the map while still making search results easy to select. Coordinates are validated at the map boundary so bad location values do not prevent discovery.

**Alternatives considered**: Filtering map markers along with search would temporarily hide valid store locations. Requiring valid coordinates for store acceptance would conflict with list fallback requirements.

## Primary references

- [Leaflet reference: map keyboard options and marker keyboard/title/alt options](https://leafletjs.com/reference)
- [OpenStreetMap Foundation Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)
- [Angular: Lazy-loaded routes](https://angular.dev/best-practices/performance/lazy-loaded-routes)

## Unresolved research questions

None. The feature specification and repository establish the supported data source, framework version, mock latency, route expectations, and challenge-scale scope.
