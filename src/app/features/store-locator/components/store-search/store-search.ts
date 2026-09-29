import { Component, computed, input, model, output } from '@angular/core';
import type { Store } from '../../../../core/models/store.model';
import { isValidCoordinates } from '../../../../core/utils/store-coordinates';

@Component({
  selector: 'app-store-search',
  templateUrl: './store-search.html',
  styleUrl: './store-search.scss',
})
export class StoreSearchComponent {
  readonly stores = input.required<Store[]>();
  readonly query = model('');
  readonly storeSelected = output<Store>();

  readonly normalizedQuery = computed(() => this.query().trim().toLowerCase());

  readonly results = computed(() => {
    const query = this.normalizedQuery();
    const stores = this.stores();
    return stores.filter(
      (store) =>
        isValidCoordinates(store.latitude, store.longitude) &&
        (!query || store.name.trim().toLowerCase().includes(query)),
    );
  });

  protected resultMessage(): string {
    const query = this.normalizedQuery();
    if (!query) {
      return '';
    }

    const count = this.results().length;
    if (count === 0) {
      return 'No stores match your search.';
    }

    return count === 1
      ? '1 matching store.'
      : `${count} matching stores.`;
  }

  protected onQueryInput(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.query.set(event.target.value);
    }
  }

  protected selectUniqueResult(): void {
    const results = this.results();
    if (results.length === 1) {
      this.storeSelected.emit(results[0]);
    }
  }
}
