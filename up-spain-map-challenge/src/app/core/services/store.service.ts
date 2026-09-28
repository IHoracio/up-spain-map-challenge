import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { MOCK_STORES } from '../data/mock-stores';
import type { Store } from '../models/store.model';

@Injectable({ providedIn: 'root' })
export class StoreService {
  getStores(): Observable<Store[]> {
    return of([...MOCK_STORES]).pipe(delay(800));
  }
}
