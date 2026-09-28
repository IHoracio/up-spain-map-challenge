import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { MOCK_PRODUCTS } from '../data/mock-products';
import type { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  getProducts(): Observable<Product[]> {
    return of([...MOCK_PRODUCTS]).pipe(delay(800));
  }
}
