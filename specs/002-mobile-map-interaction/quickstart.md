# Quickstart and Validation Guide: Mobile Map Interaction

## Prerequisites

- Node.js/npm compatible with the repository package manager declaration.
- The repository dependencies installed.
- Browser access to the local Angular development server and OpenStreetMap tiles.

## Run the application

```sh
npm.cmd start
```

Open `http://localhost:4200/stores`.

## Responsive acceptance checks

At a viewport width of 760 px or less:

1. Note the page scroll position.
2. Select a store from a `store-list__button`. Confirm the selected store,
   details, and URL update, the map centers on that store, and the document
   scroll position stays unchanged.
3. Select a different store using a map marker. Confirm the map centers on the
   selected store and the document scroll position stays unchanged.
4. Use keyboard activation for a list button and a marker. Confirm focus stays
   visible on the activated control after selection.
5. Compare marker size to desktop. Confirm the marker is smaller and its tip
   remains on the store location.

## Desktop acceptance checks

At a viewport width above 760 px:

1. Select a store from the list and from a map marker.
2. Confirm the selected store updates and the map centers on its coordinates.
3. Confirm existing marker sizing and appearance are unchanged.

## Breakpoint checks

- At exactly 760 px, confirm responsive behavior.
- At 761 px, confirm desktop behavior.
- Resize the browser across the breakpoint and select a different store to
  confirm the current viewport classification is used.

## Scope checks

- Verify a store with invalid coordinates remains selectable from the list and
  does not trigger map panning.
- Confirm search selection continues to update the selected store and details.
- Confirm no horizontal page scrolling is introduced at 360 px width.
