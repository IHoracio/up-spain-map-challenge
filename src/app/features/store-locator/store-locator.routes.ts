import { Routes, type UrlMatcher } from '@angular/router';
import { StoreLocatorPage } from './pages/store-locator-page/store-locator-page';

// Match both URLs with one route config so selecting a store preserves the page instance.
const storeLocatorMatcher: UrlMatcher = (segments) => {
  if (segments.length > 1) {
    return null;
  }

  const storeId = segments[0];
  return {
    consumed: segments,
    posParams: storeId ? { storeId } : undefined,
  };
};

export const STORE_LOCATOR_ROUTES: Routes = [
  { matcher: storeLocatorMatcher, component: StoreLocatorPage },
];
