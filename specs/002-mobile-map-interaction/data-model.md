# Data Model: Mobile Map Interaction

This feature adds no persisted data and changes no existing store or product
fields.

## Store

The existing `Store` interface remains unchanged:

| Field | Type | Use in this feature |
|---|---|---|
| `id` | `number` | Identifies the selected store and its route. |
| `name` | `string` | Labels the list entry and map marker. |
| `latitude` | `number` | Supplies the marker and recenter coordinate at every viewport width when valid. |
| `longitude` | `number` | Supplies the marker and recenter coordinate at every viewport width when valid. |

## Responsive viewport classification

| Value | Type | Rule | Use |
|---|---|---|---|
| `isMobile` | `boolean` | True at viewport widths of 760 px or less; false above 760 px. If browser media-query support is unavailable, report false. | Shared responsive policy for selection focus and other responsive component behavior. |

This is derived runtime state. It is not stored in the URL or persisted.

## Map view state

The map center remains an internal Leaflet value and is not added to the Store
model. On selection at any viewport width, it is updated to the selected
store's valid coordinates. In responsive viewports, the document scroll
position remains unchanged while the map recenters.
