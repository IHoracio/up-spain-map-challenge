import { Routes } from '@angular/router';
import { NotFoundPage } from './not-found-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'stores',
  },
  {
    path: 'stores',
    loadChildren: () =>
      import('./features/store-locator/store-locator.routes').then(
        (feature) => feature.STORE_LOCATOR_ROUTES,
      ),
  },
  {
    path: '**',
    component: NotFoundPage,
  },
];
