import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import {
  catchError,
  concatMap,
  delay,
  finalize,
  map,
  Observable,
  of,
  ReplaySubject,
  Subject,
  tap,
} from 'rxjs';
import type { Store } from '../models/store.model';
import { isValidCoordinates } from '../utils/store-coordinates';

interface NominatimReverseResponse {
  address?: {
    cycleway?: string;
    footway?: string;
    house_number?: string;
    path?: string;
    pedestrian?: string;
    residential?: string;
    road?: string;
  };
  display_name?: string;
}

interface AddressRequest {
  key: string;
  latitude: number;
  longitude: number;
  result: ReplaySubject<string>;
}

@Service()
export class StoreAddressService {
  private readonly http = inject(HttpClient);
  private readonly addresses = new Map<string, Observable<string>>();
  private readonly requests = new Subject<AddressRequest>();
  private readonly unavailableAddress = of('Address unavailable');
  private readonly storageKey = 'up-spain-map:store-addresses';

  constructor() {
    this.requests
      .pipe(
        concatMap(({ key, latitude, longitude, result }) =>
          this.http
            .get<NominatimReverseResponse>('https://nominatim.openstreetmap.org/reverse', {
              params: new HttpParams()
                .set('format', 'jsonv2')
                .set('lat', latitude)
                .set('lon', longitude)
                .set('zoom', '18')
                .set('addressdetails', '1')
                .set('accept-language', 'es'),
            })
            .pipe(
              map((response) => this.formatAddress(response)),
              catchError(() => of(null)),
              map((address) => address ?? 'Address unavailable'),
              tap((address) => {
                if (address === 'Address unavailable') {
                  this.addresses.delete(key);
                } else {
                  this.persistAddress(key, address);
                }
                result.next(address);
              }),
              concatMap((address) => of(address).pipe(delay(1000))),
              finalize(() => result.complete()),
            ),
        ),
      )
      .subscribe();
  }

  getAddress(store: Pick<Store, 'latitude' | 'longitude'>): Observable<string> {
    if (!isValidCoordinates(store.latitude, store.longitude)) {
      return this.unavailableAddress;
    }

    const { latitude, longitude } = store;
    const key = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
    const cachedAddress = this.addresses.get(key);

    if (cachedAddress) {
      return cachedAddress;
    }

    const storedAddress = this.readStoredAddress(key);
    if (storedAddress) {
      const address = of(storedAddress);
      this.addresses.set(key, address);
      return address;
    }

    const result = new ReplaySubject<string>(1);
    const address = result.asObservable();
    this.addresses.set(key, address);
    this.requests.next({ key, latitude, longitude, result });

    return address;
  }

  private formatAddress(response: NominatimReverseResponse): string | null {
    const address = response.address;
    const street =
      address?.road ??
      address?.pedestrian ??
      address?.footway ??
      address?.path ??
      address?.cycleway ??
      address?.residential;

    if (street) {
      return address?.house_number ? `${street}, ${address.house_number}` : street;
    }

    return response.display_name ?? null;
  }

  private readStoredAddress(key: string): string | null {
    try {
      const storedAddresses: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? '{}');

      if (
        typeof storedAddresses === 'object' &&
        storedAddresses !== null &&
        key in storedAddresses
      ) {
        const address: unknown = (storedAddresses as Record<string, unknown>)[key];
        return typeof address === 'string' ? address : null;
      }
    } catch {
      return null;
    }

    return null;
  }

  private persistAddress(key: string, address: string): void {
    try {
      const storedAddresses: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? '{}');
      const cache =
        typeof storedAddresses === 'object' && storedAddresses !== null
          ? (storedAddresses as Record<string, unknown>)
          : {};

      localStorage.setItem(this.storageKey, JSON.stringify({ ...cache, [key]: address }));
    } catch {
      // The in-memory cache still works when browser storage is unavailable.
    }
  }
}
