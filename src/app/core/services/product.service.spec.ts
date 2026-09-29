import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_PRODUCTS } from '../data/mock-products';
import { ProductService } from './product.service';

describe('ProductService', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns product fixtures after an 800 ms delay', async () => {
    const values: unknown[] = [];
    const subscription = new ProductService().getProducts().subscribe((products) => values.push(products));

    await vi.advanceTimersByTimeAsync(799);
    expect(values).toEqual([]);
    await vi.advanceTimersByTimeAsync(1);
    expect(values).toEqual([MOCK_PRODUCTS]);
    subscription.unsubscribe();
  });

  it('uses unique product IDs', () => {
    expect(new Set(MOCK_PRODUCTS.map((product) => product.id)).size).toBe(MOCK_PRODUCTS.length);
  });
});
