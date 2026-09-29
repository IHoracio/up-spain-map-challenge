import { AsyncPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { StoreAddressService } from '../../../../core/services/store-address.service';
import type { Store } from '../../../../core/models/store.model';

@Component({
  selector: 'app-store-list',
  imports: [AsyncPipe],
  templateUrl: './store-list.html',
  styleUrl: './store-list.scss',
})
export class StoreListComponent {
  readonly stores = input.required<Store[]>();
  readonly selectedStoreId = input<number | null>(null);
  readonly emptyMessage = input('No stores are available.');
  readonly storeSelected = output<Store>();
  protected readonly storeAddresses = inject(StoreAddressService);

  protected selectStore(store: Store): void {
    this.storeSelected.emit(store);
  }
}
