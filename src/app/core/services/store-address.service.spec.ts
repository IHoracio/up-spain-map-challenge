import { provideHttpClient } from '@angular/common/http';
import type { HttpRequest } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StoreAddressService } from './store-address.service';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
const STORAGE_KEY = 'up-spain-map:store-addresses';
const MADRID_STORE = { latitude: 40.4168, longitude: -3.7038 };
const isNominatimRequest = (request: HttpRequest<unknown>) => request.url === NOMINATIM_URL;

const streetCases = [
  {
    response: { address: { road: 'Calle Mayor', house_number: '5' } },
    expected: 'Calle Mayor, 5',
  },
  { response: { address: { pedestrian: 'Paseo Peatonal' } }, expected: 'Paseo Peatonal' },
  { response: { address: { footway: 'Pasaje del Parque' } }, expected: 'Pasaje del Parque' },
  { response: { address: { path: 'Camino del Río' } }, expected: 'Camino del Río' },
  { response: { address: { cycleway: 'Carril bici' } }, expected: 'Carril bici' },
  { response: { address: { residential: 'Vía residencial' } }, expected: 'Vía residencial' },
  {
    response: { address: {}, display_name: 'Plaza Mayor, Madrid, España' },
    expected: 'Plaza Mayor, Madrid, España',
  },
  { response: { address: {} }, expected: 'Address unavailable' },
] as const;

describe('StoreAddressService', () => {
  let http: HttpTestingController;
  let service: StoreAddressService;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(StoreAddressService);
  });

  afterEach(() => {
    http.verify();
    vi.runOnlyPendingTimers();
    vi.restoreAllMocks();
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('requests a Spanish reverse geocode and formats the street with its number', () => {
    const addresses: string[] = [];
    service.getAddress(MADRID_STORE).subscribe((address) => addresses.push(address));

    const request = http.expectOne(isNominatimRequest);
    expect(request.request.params.get('format')).toBe('jsonv2');
    expect(request.request.params.get('lat')).toBe('40.4168');
    expect(request.request.params.get('lon')).toBe('-3.7038');
    expect(request.request.params.get('zoom')).toBe('18');
    expect(request.request.params.get('addressdetails')).toBe('1');
    expect(request.request.params.get('accept-language')).toBe('es');

    request.flush({ address: { road: 'Calle Mayor', house_number: '5' } });

    expect(addresses).toEqual(['Calle Mayor, 5']);
    expect(localStorage.getItem(STORAGE_KEY)).toContain('Calle Mayor, 5');
  });

  it.each(streetCases)('formats a street address result', ({ response, expected }) => {
    const addresses: string[] = [];
    service.getAddress(MADRID_STORE).subscribe((address) => addresses.push(address));
    http.expectOne(isNominatimRequest).flush(response);

    expect(addresses).toEqual([expected]);
  });

  it('returns the same cached observable to list and details and sends one request', () => {
    const listAddress$ = service.getAddress(MADRID_STORE);
    const detailsAddress$ = service.getAddress({ ...MADRID_STORE });
    const listAddresses: string[] = [];
    const detailsAddresses: string[] = [];

    expect(detailsAddress$).toBe(listAddress$);
    listAddress$.subscribe((address) => listAddresses.push(address));
    detailsAddress$.subscribe((address) => detailsAddresses.push(address));
    http.expectOne(isNominatimRequest).flush({ address: { road: 'Calle Atocha' } });

    expect(listAddresses).toEqual(['Calle Atocha']);
    expect(detailsAddresses).toEqual(['Calle Atocha']);
    expect(http.match(isNominatimRequest)).toHaveLength(0);
  });

  it('uses the browser storage cache without requesting Nominatim again', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ '40.41680,-3.70380': 'Calle de Alcalá' }));
    const addresses: string[] = [];

    service.getAddress(MADRID_STORE).subscribe((address) => addresses.push(address));

    expect(addresses).toEqual(['Calle de Alcalá']);
    expect(http.match(isNominatimRequest)).toHaveLength(0);
  });

  it('keeps working if the browser cache contains invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid');
    const addresses: string[] = [];
    service.getAddress(MADRID_STORE).subscribe((address) => addresses.push(address));
    http.expectOne(isNominatimRequest).flush({ address: { road: 'Calle Serrano' } });

    expect(addresses).toEqual(['Calle Serrano']);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{invalid');
  });

  it('returns an unavailable label for invalid coordinates without making a request', () => {
    const addresses: string[] = [];
    service
      .getAddress({ latitude: Number.NaN, longitude: -3.7038 })
      .subscribe((address) => addresses.push(address));

    expect(addresses).toEqual(['Address unavailable']);
    expect(http.match(isNominatimRequest)).toHaveLength(0);
  });

  it('reports API errors and allows a later retry', async () => {
    const addresses: string[] = [];
    service.getAddress(MADRID_STORE).subscribe((address) => addresses.push(address));
    http.expectOne(isNominatimRequest).error(new ProgressEvent('network error'));

    expect(addresses).toEqual(['Address unavailable']);

    await vi.advanceTimersByTimeAsync(1000);
    service.getAddress(MADRID_STORE).subscribe((address) => addresses.push(address));
    http.expectOne(isNominatimRequest).flush({ address: { road: 'Calle de Atocha' } });

    expect(addresses).toEqual(['Address unavailable', 'Calle de Atocha']);
  });

  it('serializes distinct lookups with at least one second between requests', async () => {
    const secondStore = { latitude: 41.3874, longitude: 2.1686 };
    const firstAddresses: string[] = [];
    const secondAddresses: string[] = [];
    service.getAddress(MADRID_STORE).subscribe((address) => firstAddresses.push(address));
    service.getAddress(secondStore).subscribe((address) => secondAddresses.push(address));

    http
      .expectOne(
        (request) => request.url === NOMINATIM_URL && request.params.get('lat') === '40.4168',
      )
      .flush({ address: { road: 'Calle Mayor' } });
    expect(http.match(isNominatimRequest)).toHaveLength(0);

    await vi.advanceTimersByTimeAsync(999);
    expect(http.match(isNominatimRequest)).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1);

    http
      .expectOne(
        (request) => request.url === NOMINATIM_URL && request.params.get('lat') === '41.3874',
      )
      .flush({ address: { road: 'La Rambla' } });

    expect(firstAddresses).toEqual(['Calle Mayor']);
    expect(secondAddresses).toEqual(['La Rambla']);
  });
});
