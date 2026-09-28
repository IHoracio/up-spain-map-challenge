import type { Provider } from '@angular/core';
import * as L from 'leaflet';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { MOCK_PRODUCTS } from '../app/core/data/mock-products';
import { MOCK_STORES } from '../app/core/data/mock-stores';
import type { Product } from '../app/core/models/product.model';
import type { Store } from '../app/core/models/store.model';
import { ProductService } from '../app/core/services/product.service';
import { StoreService } from '../app/core/services/store.service';
import {
  LEAFLET_ADAPTER,
  type LeafletAdapter,
} from '../app/features/store-locator/components/store-map/leaflet-adapter';

export function makeStore(overrides: Partial<Store> = {}): Store {
  return {
    id: 9001,
    name: 'UP Test Store',
    latitude: 40.4168,
    longitude: -3.7038,
    ...overrides,
  };
}

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 9901,
    storeId: 9001,
    name: 'Test Product',
    price: 4.5,
    stock: 3,
    ...overrides,
  };
}

export function provideStoreResponse(stores: Store[] | Error = MOCK_STORES): Provider {
  return {
    provide: StoreService,
    useValue: {
      getStores: () =>
        stores instanceof Error ? throwError(() => stores) : of(stores),
    },
  };
}

export function provideProductResponse(
  products: Product[] | Error = MOCK_PRODUCTS,
): Provider {
  return {
    provide: ProductService,
    useValue: {
      getProducts: () =>
        products instanceof Error ? throwError(() => products) : of(products),
    },
  };
}

export interface LeafletTestDouble {
  provider: Provider;
  maps: L.Map[];
  tileLayers: L.TileLayer[];
  markers: L.Marker[];
  markerDetails: Array<{ position: L.LatLngExpression; options: L.MarkerOptions }>;
  selectMarker(index: number): void;
  failTiles(): void;
}

export function createLeafletTestDouble(): LeafletTestDouble {
  const maps: L.Map[] = [];
  const tileLayers: L.TileLayer[] = [];
  const markers: L.Marker[] = [];
  const markerDetails: LeafletTestDouble['markerDetails'] = [];
  const markerClicks: Array<() => void> = [];
  let reportTileError: (() => void) | undefined;

  const fakeMap = {
    setView: vi.fn(() => fakeMap),
    panTo: vi.fn(() => fakeMap),
    remove: vi.fn(),
    getZoom: vi.fn(() => 6),
    zoomIn: vi.fn(() => fakeMap),
    zoomOut: vi.fn(() => fakeMap),
  };

  const fakeTileLayer = {
    addTo: vi.fn(() => fakeTileLayer),
    on: vi.fn((event: string, handler: unknown) => {
      if (event === 'tileerror' && typeof handler === 'function') {
        reportTileError = () => handler();
      }
      return fakeTileLayer;
    }),
  };

  const adapter: LeafletAdapter = {
    createMap: vi.fn(() => {
      maps.push(fakeMap as unknown as L.Map);
      return fakeMap as unknown as L.Map;
    }),
    createTileLayer: vi.fn(() => {
      tileLayers.push(fakeTileLayer as unknown as L.TileLayer);
      return fakeTileLayer as unknown as L.TileLayer;
    }),
    createMarker: vi.fn((position, options) => {
      const fakeMarker = {
        addTo: vi.fn(() => fakeMarker),
        bindTooltip: vi.fn(() => fakeMarker),
        remove: vi.fn(),
        on: vi.fn((event: string, handler: unknown) => {
          if (event === 'click' && typeof handler === 'function') {
            markerClicks.push(() => handler());
          }
          return fakeMarker;
        }),
      };
      markerDetails.push({ position, options });
      markers.push(fakeMarker as unknown as L.Marker);
      return fakeMarker as unknown as L.Marker;
    }),
  };

  return {
    provider: { provide: LEAFLET_ADAPTER, useValue: adapter },
    maps,
    tileLayers,
    markers,
    markerDetails,
    selectMarker: (index) => markerClicks[index]?.(),
    failTiles: () => reportTileError?.(),
  };
}
