# Data Model: Store Locator and Product Catalog

## Store

The mock fixture contract follows the project-provided interface:

| Field | Type | Rules and use |
|---|---|---|
| `id` | `number` | Stable unique identifier used by the store list and `/stores/:storeId` route. |
| `name` | `string` | Non-empty display name and case-insensitive search field. |
| `latitude` | `number` | Geographic latitude. A map marker is allowed only for a finite value in [-90, 90]. |
| `longitude` | `number` | Geographic longitude. A map marker is allowed only for a finite value in [-180, 180]. |

The TypeScript fixture shape keeps latitude and longitude as required numbers, matching the supplied Store interface. A map-boundary validity check handles malformed runtime values defensively. A store failing coordinate validation remains in the result list and can still be selected; it is omitted from map markers.

## Product

The mock fixture contract follows the project-provided interface:

| Field | Type | Rules and use |
|---|---|---|
| `id` | `number` | Stable unique identifier within the product collection. |
| `storeId` | `number` | References the owning Store `id`. |
| `name` | `string` | Non-empty product display name. |
| `price` | `number` | Displayed price; fixture values are finite and non-negative, formatted as currency. |
| `stock` | `number` | Non-negative quantity. Stock greater than zero means available; zero stock remains visible as out of stock. |

## Relationships and derived values

- One Store has zero or more Products; `Product.storeId` is the foreign-key-like relationship.
- The catalog for a selected store is exactly the products where `product.storeId === selectedStore.id`.
- The available-product count is the number of associated products whose `stock > 0`; it counts products, not total units.
- Store selection is derived from the valid route identifier and the loaded store collection. It is not persisted separately.
- Search results are derived from all loaded stores and the normalized search query. An empty query returns the full store collection.

## Validation and state transitions

- Fixture identifiers are unique; product store references resolve to a store in the fixture set.
- A selected route ID is parsed as a safe integer. A malformed or unknown ID yields a recoverable store-not-found view with a link back to `/stores`.
- For a known selected store, product loading transitions through loading, success (including an empty catalog), and error with retry.
- Store loading transitions through loading, success (including an empty collection), and error with retry.
- Map tile loading/error is separate from store/product state. Tile failure displays an explanation; store list selection remains available.
- A store with invalid coordinates has no map position; location details use a clear unavailable-location fallback.
- Prices use a consistent currency formatter and inventory states are conveyed with text as well as visual styling.
