import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet, Routes } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_PRODUCTS } from '../../../../core/data/mock-products';
import { MOCK_STORES } from '../../../../core/data/mock-stores';
import type { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { StoreAddressService } from '../../../../core/services/store-address.service';
import { StoreService } from '../../../../core/services/store.service';
import { isValidCoordinates } from '../../../../core/utils/store-coordinates';
import { STORE_LOCATOR_ROUTES } from '../../store-locator.routes';
import {
  createLeafletTestDouble,
  provideProductResponse,
  provideStoreResponse,
  type LeafletTestDouble,
} from '../../../../../testing/store-locator-test-helpers';

@Component({
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
class TestRouterHost {}

const testRoutes: Routes = [
  {
    path: 'stores',
    children: STORE_LOCATOR_ROUTES,
  },
];
const locatableStoreCount = MOCK_STORES.filter((store) =>
  isValidCoordinates(store.latitude, store.longitude),
).length;

describe('StoreLocatorPage', () => {
  let fixture: ComponentFixture<TestRouterHost>;
  let router: Router;
  let leaflet: LeafletTestDouble;

  beforeEach(async () => {
    leaflet = createLeafletTestDouble();
    await TestBed.configureTestingModule({
      imports: [TestRouterHost],
      providers: [
        provideRouter(testRoutes),
        provideStoreResponse(MOCK_STORES),
        provideProductResponse(MOCK_PRODUCTS),
        {
          provide: StoreAddressService,
          useValue: { getAddress: () => of('Calle Mayor, 5') },
        },
        leaflet.provider,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestRouterHost);
    router = TestBed.inject(Router);
  });

  afterEach(() => TestBed.resetTestingModule());

  async function open(url: string): Promise<void> {
    await router.navigateByUrl(url);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function enterSearch(value: string): void {
    const input = fixture.nativeElement.querySelector(
      '.store-search__input',
    ) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }

  it('navigates to the selected store when its list button is activated', async () => {
    const getStores = vi.spyOn(TestBed.inject(StoreService), 'getStores');
    await open('/stores');
    const button = fixture.nativeElement.querySelector(
      '.store-list__button',
    ) as HTMLButtonElement;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/stores/1');
    expect(
      fixture.nativeElement.querySelector('.store-details__name')?.textContent?.trim(),
    ).toBe('UP Madrid Centro');
    expect(getStores).toHaveBeenCalledTimes(1);
  });

  it('navigates to the same store when its map marker is activated', async () => {
    await open('/stores');
    leaflet.selectMarker(0);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/stores/1');
  });

  it('shows the selected store location and its exact associated catalog and stock count', async () => {
    await open('/stores/1');

    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).toContain('UP Madrid Centro');
    expect(page.textContent).toContain('Calle Mayor, 5');
    expect(
      page.querySelector('.store-details__value[aria-live="polite"]')?.textContent?.trim(),
    ).toBe('1');

    const catalog = page.querySelectorAll('.product-catalog__item');
    expect(catalog).toHaveLength(2);
    expect(page.textContent).toContain('Aceite de oliva virgen extra');
    expect(page.textContent).toContain('Cafe de Colombia molido');
    expect(page.textContent).toContain('Out of stock');
    expect(page.textContent).toContain('12.50');
    expect(page.textContent).toContain('7.25');
  });

  it('keeps stores selectable when address lookup fails but hides invalid coordinates', async () => {
    vi.spyOn(TestBed.inject(StoreAddressService), 'getAddress').mockReturnValue(
      of('Address unavailable'),
    );

    await open('/stores');
    const buttons = fixture.nativeElement.querySelectorAll(
      '.store-list__button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons).toHaveLength(locatableStoreCount);
    expect(buttons[0].textContent).toContain('Coordinates: 40.4168, -3.7038');
    expect([...buttons].some((button) => button.textContent?.includes('UP Lugo'))).toBe(false);
    expect(leaflet.markers).toHaveLength(7);
  });

  it('keeps a store selectable while its address is pending', async () => {
    const pendingAddress = new Subject<string>();
    const pendingAddress$ = pendingAddress.asObservable();
    vi.spyOn(TestBed.inject(StoreAddressService), 'getAddress').mockImplementation((store) =>
      store.latitude === MOCK_STORES[0].latitude
        ? pendingAddress$
        : of('Calle Mayor, 5'),
    );

    await open('/stores');
    expect(
      [...fixture.nativeElement.querySelectorAll('.store-list__button')].some(
        (button: HTMLButtonElement) =>
          button.textContent?.includes('UP Madrid Centro') &&
          button.textContent?.includes('Coordinates: 40.4168, -3.7038'),
      ),
    ).toBe(true);

    pendingAddress.next('Calle Mayor, 5');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(
      [...fixture.nativeElement.querySelectorAll('.store-list__button')].some(
        (button: HTMLButtonElement) =>
          button.textContent?.includes('UP Madrid Centro') &&
          button.textContent?.includes('Calle Mayor, 5'),
      ),
    ).toBe(true);
  });

  it('filters the list with normalized search and keeps every valid map marker', async () => {
    await open('/stores');
    enterSearch('  bArCeLoNa ');
    const buttons = fixture.nativeElement.querySelectorAll(
      '.store-list__button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent).toContain('UP Barcelona Rambla');
    expect(leaflet.markers).toHaveLength(7);
  });

  it('shows no search matches and restores all stores when search is cleared', async () => {
    await open('/stores');
    enterSearch('no such location');
    expect(
      fixture.nativeElement.textContent,
    ).toContain('No stores match your search.');

    fixture.nativeElement
      .querySelector('button[aria-label="Clear store search"]')
      .click();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.store-list__button'),
    ).toHaveLength(locatableStoreCount);
  });

  it('selects a matching search result and updates the route, details, and catalog', async () => {
    await open('/stores');
    enterSearch('valencia');
    const result = fixture.nativeElement.querySelector(
      '.store-list__button',
    ) as HTMLButtonElement;
    result.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/stores/3');
    expect(fixture.nativeElement.textContent).toContain('UP Valencia Mercado');
    expect(fixture.nativeElement.textContent).toContain('Arroz bomba valenciano');
  });

  it('shows store loading feedback until the store response arrives', async () => {
    const response = new Subject<typeof MOCK_STORES>();
    vi.spyOn(TestBed.inject(StoreService), 'getStores').mockReturnValue(
      response.asObservable(),
    );

    await open('/stores');
    expect(fixture.nativeElement.textContent).toContain('Loading stores');

    response.next(MOCK_STORES);
    response.complete();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.store-list__button'),
    ).toHaveLength(locatableStoreCount);
  });

  it('shows an empty state when the store service returns no stores', async () => {
    vi.spyOn(TestBed.inject(StoreService), 'getStores').mockReturnValue(of([]));

    await open('/stores');

    expect(fixture.nativeElement.textContent).toContain(
      'No stores are available at the moment.',
    );
  });

  it('recovers from a store load error when the customer retries', async () => {
    const storeService = TestBed.inject(StoreService);
    const getStores = vi
      .spyOn(storeService, 'getStores')
      .mockReturnValueOnce(throwError(() => new Error('offline')))
      .mockReturnValue(of(MOCK_STORES));

    await open('/stores');
    expect(fixture.nativeElement.textContent).toContain(
      'Stores could not be loaded.',
    );

    fixture.nativeElement
      .querySelector('button[aria-label="Retry loading stores"]')
      .click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getStores).toHaveBeenCalledTimes(2);
    expect(
      fixture.nativeElement.querySelectorAll('.store-list__button'),
    ).toHaveLength(locatableStoreCount);
  });

  it('shows product loading feedback and then the loaded catalog', async () => {
    const response = new Subject<typeof MOCK_PRODUCTS>();
    vi.spyOn(TestBed.inject(ProductService), 'getProducts').mockReturnValue(
      response.asObservable(),
    );

    await open('/stores/1');
    expect(fixture.nativeElement.textContent).toContain('Loading products');
    expect(
      fixture.nativeElement
        .querySelector('.store-details__value[aria-live="polite"]')
        ?.textContent?.trim(),
    ).toBe('Loading');

    response.next(MOCK_PRODUCTS);
    response.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Aceite de oliva virgen extra',
    );
  });

  it('shows an empty catalog when a store has no products', async () => {
    vi.spyOn(TestBed.inject(ProductService), 'getProducts').mockReturnValue(of([]));

    await open('/stores/1');

    expect(fixture.nativeElement.textContent).toContain(
      'No products are listed for this store.',
    );
  });

  it('shows fallback labels for products with missing or invalid fields', async () => {
    const incompleteProduct = {
      id: 999,
      storeId: 1,
      name: '',
      price: Number.NaN,
      stock: undefined,
    } as unknown as Product;
    vi.spyOn(TestBed.inject(ProductService), 'getProducts').mockReturnValue(
      of([incompleteProduct]),
    );

    await open('/stores/1');

    expect(fixture.nativeElement.textContent).toContain('Product name unavailable');
    expect(fixture.nativeElement.textContent).toContain('Price unavailable');
    expect(fixture.nativeElement.textContent).toContain('Stock unavailable');
    expect(fixture.nativeElement.textContent).toContain('Availability unavailable');
    expect(
      fixture.nativeElement
        .querySelector('.store-details__value[aria-live="polite"]')
        ?.textContent?.trim(),
    ).toBe('0');
  });

  it('recovers from a product load error when the customer retries', async () => {
    const productService = TestBed.inject(ProductService);
    const getProducts = vi
      .spyOn(productService, 'getProducts')
      .mockReturnValueOnce(throwError(() => new Error('offline')))
      .mockReturnValue(of(MOCK_PRODUCTS));

    await open('/stores/1');
    expect(fixture.nativeElement.textContent).toContain(
      'Products could not be loaded.',
    );

    fixture.nativeElement
      .querySelector('button[aria-label="Retry loading products"]')
      .click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getProducts).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).toContain(
      'Aceite de oliva virgen extra',
    );
  });

  it('shows a recoverable not-found state for an unknown store ID', async () => {
    await open('/stores/987654');

    expect(fixture.nativeElement.textContent).toContain('Store not found');
    expect(
      fixture.nativeElement.querySelector('a[href="/stores"]'),
    ).not.toBeNull();
  });
});
