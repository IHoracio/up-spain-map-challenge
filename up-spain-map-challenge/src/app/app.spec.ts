import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MOCK_PRODUCTS } from './core/data/mock-products';
import { MOCK_STORES } from './core/data/mock-stores';
import {
  createLeafletTestDouble,
  provideProductResponse,
  provideStoreResponse,
} from '../testing/store-locator-test-helpers';
import { App } from './app';
import { routes } from './app.routes';

describe('App routes', () => {
  let fixture: ComponentFixture<App>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    const leaflet = createLeafletTestDouble();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        provideLocationMocks(),
        provideStoreResponse(MOCK_STORES),
        provideProductResponse(MOCK_PRODUCTS),
        leaflet.provider,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  afterEach(() => TestBed.resetTestingModule());

  async function open(url: string): Promise<void> {
    await router.navigateByUrl(url);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('provides the routed application shell', async () => {
    await open('/stores');
    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });

  it('restores a selected-store view when opened directly', async () => {
    await open('/stores/2');

    expect(router.url).toBe('/stores/2');
    expect(fixture.nativeElement.textContent).toContain('UP Barcelona Rambla');
  });

  it('shows a not-found page for an unknown application path', async () => {
    await open('/this/path/does/not/exist');

    expect(fixture.nativeElement.textContent).toContain('Page not found');
    expect(
      fixture.nativeElement.querySelector('a[href="/stores"]'),
    ).not.toBeNull();
  });

  it('restores route selection when browser history moves back', async () => {
    router.setUpLocationChangeListener();
    await open('/stores/1');
    await open('/stores/2');

    const backNavigation = firstValueFrom(
      router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      ),
    );
    location.back();
    await backNavigation;
    fixture.detectChanges();

    expect(router.url).toBe('/stores/1');
    expect(fixture.nativeElement.textContent).toContain('UP Madrid Centro');

    const forwardNavigation = firstValueFrom(
      router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      ),
    );
    location.forward();
    await forwardNavigation;
    fixture.detectChanges();

    expect(router.url).toBe('/stores/2');
    expect(fixture.nativeElement.textContent).toContain('UP Barcelona Rambla');
  });
});
