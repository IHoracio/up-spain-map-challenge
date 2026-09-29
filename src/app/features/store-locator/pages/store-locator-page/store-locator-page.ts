import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ProductCatalogComponent } from '../../components/product-catalog/product-catalog';
import { StoreDetailsComponent } from '../../components/store-details/store-details';
import { StoreListComponent } from '../../components/store-list/store-list';
import { StoreMapComponent } from '../../components/store-map/store-map';
import { StoreSearchComponent } from '../../components/store-search/store-search';
import type { Product } from '../../../../core/models/product.model';
import type { Store } from '../../../../core/models/store.model';
import { ProductService } from '../../../../core/services/product.service';
import { StoreService } from '../../../../core/services/store.service';
import { ViewportService } from '../../../../core/services/viewport.service';

@Component({
  imports: [
    ProductCatalogComponent,
    StoreDetailsComponent,
    StoreListComponent,
    StoreMapComponent,
    StoreSearchComponent,
    RouterLink,
  ],
  selector: 'app-store-locator-page',
  templateUrl: './store-locator-page.html',
  styleUrl: './store-locator-page.scss',
})
export class StoreLocatorPage {
  readonly stores = signal<Store[]>([]);
  readonly products = signal<Product[]>([]);
  readonly searchQuery = signal('');
  readonly storeState = signal<'loading' | 'success' | 'error'>('loading');
  readonly productState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly storeService = inject(StoreService);
  private readonly productService = inject(ProductService);
  private readonly viewport = inject(ViewportService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pageHeading = viewChild<ElementRef<HTMLHeadingElement>>('pageHeading');
  private storeRequestId = 0;
  private productRequestId = 0;

  private readonly routeStoreId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('storeId'))),
    { initialValue: this.route.snapshot.paramMap.get('storeId') },
  );

  readonly selectedStoreId = computed(() => {
    const routeId = this.routeStoreId();
    if (routeId === null) {
      return null;
    }
    const parsedId = Number(routeId);
    return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : Number.NaN;
  });

  readonly selectedStore = computed(() => {
    const storeId = this.selectedStoreId();
    return storeId === null || !Number.isSafeInteger(storeId)
      ? null
      : this.stores().find((store) => store.id === storeId) ?? null;
  });

  readonly matchingStores = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const stores = this.stores();
    return query
      ? stores.filter((store) => store.name.trim().toLowerCase().includes(query))
      : stores;
  });

  readonly selectedProducts = computed(() => {
    const store = this.selectedStore();
    return store
      ? this.products().filter((product) => product.storeId === store.id)
      : [];
  });

  readonly availableProductCount = computed(() =>
    this.productState() === 'success'
      ? this.selectedProducts().filter(
          (product) => Number.isFinite(product.stock) && product.stock > 0,
        ).length
      : null,
  );

  private readonly selectedStoreEffect = effect(() => {
    const store = this.selectedStore();

    if (!store) {
      this.productRequestId += 1;
      this.products.set([]);
      this.productState.set('idle');
      return;
    }

    this.loadProducts(store);
  });

  constructor() {
    this.loadStores();
  }

  protected async selectStore(store: Store): Promise<void> {
    const navigated = await this.router.navigate(['/stores', store.id]);
    if (navigated && !this.viewport.isMobile()) {
      this.pageHeading()?.nativeElement.focus();
    }
  }

  protected retryStores(): void {
    this.loadStores();
  }

  protected retryProducts(): void {
    const store = this.selectedStore();
    if (store) {
      this.loadProducts(store);
    }
  }

  private loadStores(): void {
    const requestId = ++this.storeRequestId;
    this.storeState.set('loading');
    this.storeService
      .getStores()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (stores) => {
          if (requestId === this.storeRequestId) {
            this.stores.set(stores);
            this.storeState.set('success');
          }
        },
        error: () => {
          if (requestId === this.storeRequestId) {
            this.stores.set([]);
            this.storeState.set('error');
          }
        },
      });
  }

  private loadProducts(store: Store): void {
    const requestId = ++this.productRequestId;
    this.productState.set('loading');
    this.products.set([]);
    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          if (requestId === this.productRequestId) {
            this.products.set(products);
            this.productState.set('success');
          }
        },
        error: () => {
          if (requestId === this.productRequestId) {
            this.products.set([]);
            this.productState.set('error');
          }
        },
      });
  }
}
