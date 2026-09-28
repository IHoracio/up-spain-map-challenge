import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MOCK_STORES } from '../../../../core/data/mock-stores';
import { isValidCoordinates } from '../../../../core/utils/store-coordinates';
import {
  createLeafletTestDouble,
  makeStore,
  type LeafletTestDouble,
} from '../../../../../testing/store-locator-test-helpers';
import { StoreMapComponent } from './store-map';

describe('StoreMapComponent', () => {
  let leaflet: LeafletTestDouble;

  beforeEach(async () => {
    leaflet = createLeafletTestDouble();
    await TestBed.configureTestingModule({
      imports: [StoreMapComponent],
      providers: [leaflet.provider],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('creates one selectable marker for every fixture store with valid coordinates', () => {
    const fixture = TestBed.createComponent(StoreMapComponent);
    fixture.componentRef.setInput('stores', MOCK_STORES);
    fixture.detectChanges();

    const expected = MOCK_STORES.filter((store) =>
      isValidCoordinates(store.latitude, store.longitude),
    );
    expect(leaflet.markerDetails.map((marker) => marker.position)).toEqual(
      expected.map((store) => [store.latitude, store.longitude]),
    );
    expect(leaflet.markerDetails.map((marker) => marker.options.alt)).toEqual(
      expected.map((store) => store.name),
    );
  });

  it('omits stores with invalid coordinates from map markers', () => {
    const fixture = TestBed.createComponent(StoreMapComponent);
    fixture.componentRef.setInput('stores', [
      makeStore({ latitude: 91 }),
      makeStore({ id: 9002, longitude: Number.NaN }),
    ]);
    fixture.detectChanges();

    expect(leaflet.markers).toHaveLength(0);
  });

  it('emits the matching store when a marker is selected', () => {
    const fixture = TestBed.createComponent(StoreMapComponent);
    fixture.componentRef.setInput('stores', MOCK_STORES);
    fixture.detectChanges();
    const selected: number[] = [];
    fixture.componentInstance.storeSelected.subscribe((store) =>
      selected.push(store.id),
    );

    leaflet.selectMarker(1);

    expect(selected).toEqual([2]);
  });

  it('exposes labelled keyboard-operable zoom controls', () => {
    const fixture = TestBed.createComponent(StoreMapComponent);
    fixture.componentRef.setInput('stores', MOCK_STORES);
    fixture.detectChanges();

    const map = fixture.nativeElement.querySelector(
      '[role="application"][tabindex="0"]',
    );
    const zoomIn = fixture.nativeElement.querySelector(
      'button[aria-label="Zoom in"]',
    );
    const zoomOut = fixture.nativeElement.querySelector(
      'button[aria-label="Zoom out"]',
    );
    expect(map).not.toBeNull();
    expect(zoomIn).not.toBeNull();
    expect(zoomOut).not.toBeNull();
  });

  it('shows a tile error warning without removing map controls', () => {
    const fixture = TestBed.createComponent(StoreMapComponent);
    fixture.componentRef.setInput('stores', MOCK_STORES);
    fixture.detectChanges();

    leaflet.failTiles();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Map tiles could not be loaded.',
    );
    expect(
      fixture.nativeElement.querySelector('button[aria-label="Zoom in"]'),
    ).not.toBeNull();
  });

  it('does not create a marker when a required coordinate is missing at runtime', () => {
    const fixture = TestBed.createComponent(StoreMapComponent);
    fixture.componentRef.setInput('stores', [
      makeStore({ latitude: undefined as unknown as number }),
    ]);
    fixture.detectChanges();

    expect(leaflet.markers).toHaveLength(0);
  });
});
