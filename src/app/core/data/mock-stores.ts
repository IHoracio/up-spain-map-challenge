import type { Store } from '../models/store.model';

export const MOCK_STORES: Store[] = [
  { id: 1, name: 'UP Madrid Centro', latitude: 40.4168, longitude: -3.7038 },
  { id: 2, name: 'UP Barcelona Rambla', latitude: 41.3874, longitude: 2.1686 },
  { id: 3, name: 'UP Valencia Mercado', latitude: 39.4699, longitude: -0.3763 },
  { id: 4, name: 'UP Sevilla Alameda', latitude: 37.3891, longitude: -5.9845 },
  { id: 5, name: 'UP Bilbao Abando', latitude: 43.263, longitude: -2.935 },
  { id: 6, name: 'UP Malaga Puerto', latitude: 36.7213, longitude: -4.4214 },
  { id: 7, name: 'UP Zaragoza Centro', latitude: 41.6488, longitude: -0.8891 },
  { id: 8, name: 'UP Lugo (location pending)', latitude: Number.NaN, longitude: Number.NaN },
];
