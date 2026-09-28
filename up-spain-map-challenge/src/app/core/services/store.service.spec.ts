import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_PRODUCTS } from '../data/mock-products';
import { MOCK_STORES } from '../data/mock-stores';
import { StoreService } from './store.service';

describe('StoreService', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns representative Spain stores after an 800 ms delay', async () => {
    const values: unknown[] = [];
    const subscription = new StoreService().getStores().subscribe((stores) => values.push(stores));

    await vi.advanceTimersByTimeAsync(799);
    expect(values).toEqual([]);
    await vi.advanceTimersByTimeAsync(1);
    expect(values).toEqual([MOCK_STORES]);
    subscription.unsubscribe();
  });

  it('has unique store IDs and display names and keeps invalid-location stores in the collection', () => {
    expect(new Set(MOCK_STORES.map((store) => store.id)).size).toBe(MOCK_STORES.length);
    expect(MOCK_STORES.every((store) => store.name.trim().length > 0)).toBe(true);
    expect(MOCK_STORES.some((store) => !Number.isFinite(store.latitude))).toBe(true);
  });

  it('provides only product fixtures linked to known stores with valid product constraints', () => {
    const storeIds = new Set(MOCK_STORES.map((store) => store.id));
    expect(MOCK_PRODUCTS.every((product) => storeIds.has(product.storeId))).toBe(true);
    expect(MOCK_PRODUCTS.every((product) => product.name.trim().length > 0)).toBe(true);
    expect(MOCK_PRODUCTS.every((product) => Number.isFinite(product.price) && product.price >= 0)).toBe(true);
    expect(MOCK_PRODUCTS.every((product) => Number.isFinite(product.stock) && product.stock >= 0)).toBe(true);
    expect(MOCK_PRODUCTS.some((product) => product.stock === 0)).toBe(true);
    expect(MOCK_STORES.some((store) => !MOCK_PRODUCTS.some((product) => product.storeId === store.id))).toBe(true);
  });
});
