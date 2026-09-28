import { InjectionToken } from '@angular/core';
import * as L from 'leaflet';

export interface LeafletAdapter {
  createMap(container: HTMLElement, options: L.MapOptions): L.Map;
  createTileLayer(url: string, options: L.TileLayerOptions): L.TileLayer;
  createMarker(position: L.LatLngExpression, options: L.MarkerOptions): L.Marker;
}

export const LEAFLET_ADAPTER = new InjectionToken<LeafletAdapter>(
  'LEAFLET_ADAPTER',
  {
    factory: () => ({
      createMap: (container, options) => L.map(container, options),
      createTileLayer: (url, options) => L.tileLayer(url, options),
      createMarker: (position, options) => L.marker(position, options),
    }),
  },
);
