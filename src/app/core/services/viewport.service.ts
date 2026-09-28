import { DOCUMENT, Service, inject } from '@angular/core';

const RESPONSIVE_VIEWPORT_QUERY = '(max-width: 760px)';

@Service()
export class ViewportService {
  private readonly document = inject(DOCUMENT);
  private readonly responsiveViewport =
    this.document.defaultView?.matchMedia?.(RESPONSIVE_VIEWPORT_QUERY);

  isMobile(): boolean {
    return this.responsiveViewport?.matches ?? false;
  }
}
