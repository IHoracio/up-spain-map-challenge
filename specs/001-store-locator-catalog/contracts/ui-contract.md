# User Interface Contract

## Routes

| URL | Result |
|---|---|
| `/` | Redirect to `/stores`. |
| `/stores` | Store finder with search, list, and map; no selected-store catalog. |
| `/stores/:storeId` | Same finder with the matching store selected and its details/catalog displayed. |
| Unknown path or unknown store ID | Clear not-found state with a keyboard-accessible path back to `/stores`. |

The root router lazy-loads the store-locator route tree. Direct navigation, refresh, and browser back/forward must restore the URL's selected-store state. Static hosting must route unknown application paths to the SPA entry point.

## Selection and search

- A map marker, store-list button, or search-result button selects the same store and navigates to its `/stores/:storeId` URL.
- A valid selected store is highlighted in the list and represented by the matching map marker when it has valid coordinates.
- A store with invalid coordinates can be selected from search/list and displays a location-unavailable fallback.
- Search matches trimmed, case-insensitive substrings of store names. No matches produce a labelled empty state and a clear-search action. Clearing search restores all stores in the results/list.
- Search narrows its result list; it does not remove other valid stores from the map.

## Accessible interaction and feedback

- Search uses a visible label and native text input; clear and retry actions are native buttons.
- Stores are available in a semantic list with one button per store, meaningful accessible names, selected state, and visible keyboard focus.
- Map keyboard pan/zoom controls and markers are keyboard operable and labelled. The map supplements the list; it is not the sole way to select a store.
- Store and product services present loading, success/empty, and error/retry states. Product state is scoped to the selected store.
- Tile imagery failure is announced with a visible explanation while the accessible list and product flow remain usable.
- At 360 px and wider, the finder remains readable without horizontal page scrolling; responsive layout may stack the list and map/details.

## External map layer

Use the OpenStreetMap standard HTTPS tile URL and visible contributor attribution. Do not prefetch tiles or promise offline availability. Keep attribution visible, and handle tile load errors as described above. Any future tile provider change must follow that provider's attribution and usage terms.
