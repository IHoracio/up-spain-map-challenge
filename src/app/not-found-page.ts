import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-not-found-page',
  template: `
    <main class="not-found-page" aria-labelledby="not-found-page__title">
      <h1 class="not-found-page__title" id="not-found-page__title">
        Page not found
      </h1>
      <p class="not-found-page__message">
        This address does not match a page in the store finder.
      </p>
      <a class="not-found-page__link" routerLink="/stores">
        Return to the store finder
      </a>
    </main>
  `,
  styleUrl: './not-found-page.scss',
})
export class NotFoundPage {}
