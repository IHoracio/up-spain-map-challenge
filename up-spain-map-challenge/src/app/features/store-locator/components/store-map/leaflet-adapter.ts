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
    factory: () => {
      const markerIcon = L.icon({
        iconUrl: new URL('leaflet/images/marker-icon.png', document.baseURI)
          .href,
        iconRetinaUrl: new URL(
          'leaflet/images/marker-icon-2x.png',
          document.baseURI,
        ).href,
        shadowUrl: new URL('leaflet/images/marker-shadow.png', document.baseURI)
          .href,
      });

      return {
        createMap: (container, options) => L.map(container, options),
        createTileLayer: (url, options) => L.tileLayer(url, options),
        createMarker: (position, options) =>
          L.marker(position, { ...options, icon: markerIcon }),
      };
    },
  },
);
