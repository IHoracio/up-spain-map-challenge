# User Interface Contract: Mobile Map Interaction

## Store selection

- Selecting a store from a list button or map marker updates the selected store,
  URL, details, and product catalog through the existing store-finder flow.
- At every viewport width, selection centers the map on the selected store when
  it has valid coordinates.
- At viewport widths up to and including 760 px, selection leaves the document
  scroll position unchanged. Keyboard focus stays on the activated list button
  or marker.
- Above 760 px, selection focuses the page heading as before.
- The accessible store list remains available as an alternative to selecting
  map markers.

## Marker presentation

- Markers use a smaller visual size at widths up to and including 760 px.
- The marker tip remains anchored to the corresponding store coordinates.
- Marker appearance above 760 px remains unchanged.

## Responsive classification

All components use the same viewport classification: 760 px and below is
responsive; widths above 760 px use desktop behavior. The classification is
derived from viewport width rather than user-agent identity.
