import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import type { Product } from '../../../../core/models/product.model';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.scss',
})
export class ProductCatalogComponent {
  readonly products = input<Product[]>([]);
  readonly state = input<'idle' | 'loading' | 'success' | 'error'>('success');
  readonly retry = output<void>();

  protected productName(product: Product): string {
    return typeof product.name === 'string' && product.name.trim()
      ? product.name
      : 'Product name unavailable';
  }

  protected hasPrice(product: Product): boolean {
    return Number.isFinite(product.price) && product.price >= 0;
  }

  protected hasStock(product: Product): boolean {
    return Number.isFinite(product.stock) && product.stock >= 0;
  }
}
