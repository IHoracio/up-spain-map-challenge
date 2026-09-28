import type { Product } from '../models/product.model';

export const MOCK_PRODUCTS: Product[] = [
  { id: 101, storeId: 1, name: 'Aceite de oliva virgen extra', price: 12.5, stock: 18 },
  { id: 102, storeId: 1, name: 'Cafe de Colombia molido', price: 7.25, stock: 0 },
  { id: 103, storeId: 2, name: 'Chocolate negro 70%', price: 3.8, stock: 24 },
  { id: 104, storeId: 3, name: 'Arroz bomba valenciano', price: 5.4, stock: 12 },
  { id: 105, storeId: 3, name: 'Azafran en hebras', price: 9.9, stock: 4 },
  { id: 106, storeId: 4, name: 'Naranjas de mesa', price: 4.2, stock: 15 },
  { id: 107, storeId: 5, name: 'Queso Idiazabal', price: 11.75, stock: 6 },
  { id: 108, storeId: 6, name: 'Miel de romero', price: 6.3, stock: 9 },
];
