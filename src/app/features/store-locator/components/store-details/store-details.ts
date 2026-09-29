import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { StoreAddressService } from '../../../../core/services/store-address.service';
import type { Store } from '../../../../core/models/store.model';

@Component({
  selector: 'app-store-details',
  imports: [AsyncPipe],
  templateUrl: './store-details.html',
  styleUrl: './store-details.scss',
})
export class StoreDetailsComponent {
  readonly store = input.required<Store>();
  readonly availableProductCount = input<number | null>(null);
  readonly productState = input<'idle' | 'loading' | 'success' | 'error'>('success');
  protected readonly storeAddresses = inject(StoreAddressService);
}
