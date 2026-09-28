import { Component, input, output } from '@angular/core';
import { isValidCoordinates } from '../../../../core/utils/store-coordinates';
import type { Store } from '../../../../core/models/store.model';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.html',
  styleUrl: './store-list.scss',
})
export class StoreListComponent {
  readonly stores = input.required<Store[]>();
  readonly selectedStoreId = input<number | null>(null);
  readonly emptyMessage = input('No stores are available.');
  readonly storeSelected = output<Store>();

  protected selectStore(store: Store): void {
    this.storeSelected.emit(store);
  }

  protected hasLocation(store: Store): boolean {
    return isValidCoordinates(store.latitude, store.longitude);
  }

  protected locationLabel(store: Store): string {
    return this.hasLocation(store)
      ? `${store.latitude.toFixed(4)}, ${store.longitude.toFixed(4)}`
      : 'Location unavailable';
  }
}
