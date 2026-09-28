import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import * as axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MOCK_PRODUCTS } from '../../core/data/mock-products';
import { MOCK_STORES } from '../../core/data/mock-stores';
import {
  createLeafletTestDouble,
  provideProductResponse,
  provideStoreResponse,
} from '../../../testing/store-locator-test-helpers';
import { routes } from '../../app.routes';

@Component({
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
class AccessibilityRouterHost {}

describe('Store locator accessibility', () => {
  let fixture: ComponentFixture<AccessibilityRouterHost>;
  let router: Router;

  beforeEach(async () => {
    const leaflet = createLeafletTestDouble();
    await TestBed.configureTestingModule({
      imports: [AccessibilityRouterHost],
      providers: [
        provideRouter(routes),
        provideStoreResponse(MOCK_STORES),
        provideProductResponse(MOCK_PRODUCTS),
        leaflet.provider,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AccessibilityRouterHost);
    router = TestBed.inject(Router);
  });

  afterEach(() => TestBed.resetTestingModule());

  async function open(url: string): Promise<void> {
    await router.navigateByUrl(url);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('has no axe WCAG A or AA violations on the selected-store route', async () => {
    await open('/stores/1');

    const result = await axe.run(fixture.nativeElement, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    });

    expect(
      result.violations.map((violation) => `${violation.id}: ${violation.help}`),
    ).toEqual([]);
  });

  it('supports a keyboard search and exposes native focusable store controls', async () => {
    await open('/stores');
    const input = fixture.nativeElement.querySelector(
      '.store-search__input',
    ) as HTMLInputElement;
    input.focus();
    input.value = 'valencia';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.activeElement).toBe(
      fixture.nativeElement.querySelector('.store-locator-page__title'),
    );
    expect(router.url).toBe('/stores/3');
    expect(
      fixture.nativeElement.querySelector(
        '.store-list__button[aria-pressed="true"]',
      ),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector(
        '.store-map__canvas[tabindex="0"]',
      ),
    ).not.toBeNull();
  });
});
