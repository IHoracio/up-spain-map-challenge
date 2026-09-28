import { Routes } from '@angular/router';
import { StoreLocatorPage } from './pages/store-locator-page/store-locator-page';

export const STORE_LOCATOR_ROUTES: Routes = [
  { path: '', component: StoreLocatorPage },
  { path: ':storeId', component: StoreLocatorPage },
];
