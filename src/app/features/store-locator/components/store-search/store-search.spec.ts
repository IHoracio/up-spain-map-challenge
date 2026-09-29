import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MOCK_STORES } from '../../../../core/data/mock-stores';
import { StoreSearchComponent } from './store-search';

describe('StoreSearchComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreSearchComponent],
    }).compileComponents();
  });

  it('provides a visible label and updates normalized full and partial matches', () => {
    const fixture = TestBed.createComponent(StoreSearchComponent);
    fixture.componentRef.setInput('stores', MOCK_STORES);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label')?.textContent).toContain(
      'Search stores',
    );

    const input = fixture.nativeElement.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement;
    input.value = '  uP mADrid  ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.results().map((store) => store.id)).toEqual([1]);

    input.value = '  bArCeLoNa ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.results().map((store) => store.id)).toEqual([2]);
  });

  it('shows a no-results message and clears the query back to the full collection', () => {
    const fixture = TestBed.createComponent(StoreSearchComponent);
    fixture.componentRef.setInput('stores', MOCK_STORES);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement;
    input.value = 'nowhere';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.results()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain(
      'No stores match your search.',
    );

    fixture.nativeElement
      .querySelector('button[aria-label="Clear store search"]')
      .click();
    fixture.detectChanges();
    expect(fixture.componentInstance.query()).toBe('');
    expect(fixture.componentInstance.results()).toHaveLength(MOCK_STORES.length);
  });

  it('selects the sole search result when the user presses Enter', () => {
    const fixture = TestBed.createComponent(StoreSearchComponent);
    fixture.componentRef.setInput('stores', MOCK_STORES);
    fixture.detectChanges();
    const selected: number[] = [];
    fixture.componentInstance.storeSelected.subscribe((store) =>
      selected.push(store.id),
    );

    const input = fixture.nativeElement.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement;
    input.value = 'valencia';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(selected).toEqual([3]);
  });
});
