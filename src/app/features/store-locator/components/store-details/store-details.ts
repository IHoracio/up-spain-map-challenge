import { Component, input } from '@angular/core';
import { isValidCoordinates } from '../../../../core/utils/store-coordinates';
import type { Store } from '../../../../core/models/store.model';

@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.html',
  styleUrl: './store-details.scss',
})
export class StoreDetailsComponent {
  readonly store = input.required<Store>();
  readonly availableProductCount = input<number | null>(null);
  readonly productState = input<
    'idle' | 'loading' | 'success' | 'error'
  >('success');

  protected locationLabel(store: Store): string {
    return isValidCoordinates(store.latitude, store.longitude)
      ? `${store.latitude.toFixed(4)}, ${store.longitude.toFixed(4)}`
      : 'Location unavailable';
  }
}
