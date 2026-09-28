import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type * as L from 'leaflet';
import { isValidCoordinates } from '../../../../core/utils/store-coordinates';
import type { Store } from '../../../../core/models/store.model';
import { LEAFLET_ADAPTER } from './leaflet-adapter';

@Component({
  selector: 'app-store-map',
  templateUrl: './store-map.html',
  styleUrl: './store-map.scss',
})
export class StoreMapComponent implements AfterViewInit, OnDestroy {
  readonly stores = input<Store[]>([]);
  readonly selectedStoreId = input<number | null>(null);
  readonly storeSelected = output<Store>();

  protected readonly tileError = signal(false);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly leaflet = inject(LEAFLET_ADAPTER);
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private renderedStores: Store[] | null = null;
  private lastSelectedStoreId: number | null = null;

  private readonly syncMapEffect = effect(() => {
    this.syncMap(this.stores(), this.selectedStoreId());
  });

  ngAfterViewInit(): void {
    const hostElement = this.host.nativeElement as HTMLElement;
    const container = hostElement.querySelector<HTMLElement>(
      '.store-map__canvas',
    );
    if (!container) {
      return;
    }

    this.map = this.leaflet.createMap(container, {
      center: [40.2, -3.7],
      zoom: 6,
      keyboard: true,
      zoomControl: false,
    });
    const tiles = this.leaflet.createTileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      },
    );
    tiles.on('tileerror', () => this.tileError.set(true));
    tiles.addTo(this.map);
    this.syncMap(this.stores(), this.selectedStoreId());
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  protected zoomIn(): void {
    this.map?.zoomIn();
  }

  protected zoomOut(): void {
    this.map?.zoomOut();
  }

  private syncMap(stores: Store[], selectedStoreId: number | null): void {
    if (!this.map) {
      return;
    }

    if (this.renderedStores !== stores) {
      this.markers.forEach((marker) => marker.remove());
      this.markers = [];
      this.renderedStores = stores;

      for (const store of stores) {
        if (!isValidCoordinates(store.latitude, store.longitude)) {
          continue;
        }

        const marker = this.leaflet.createMarker(
          [store.latitude, store.longitude],
          {
            alt: store.name,
            title: store.name,
            keyboard: true,
          },
        );
        marker.bindTooltip(store.name);
        marker.on('click', () => this.storeSelected.emit(store));
        marker.addTo(this.map);
        this.markers.push(marker);
      }
    }

    if (selectedStoreId !== this.lastSelectedStoreId) {
      this.lastSelectedStoreId = selectedStoreId;
      const selectedStore = stores.find(
        (store) => store.id === selectedStoreId,
      );
      if (
        selectedStore &&
        isValidCoordinates(selectedStore.latitude, selectedStore.longitude)
      ) {
        this.map.panTo([selectedStore.latitude, selectedStore.longitude]);
      }
    }
  }
}
