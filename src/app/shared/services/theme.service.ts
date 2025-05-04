import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

const LOCAL_STORAGE_KEY = 'DPA:THEME';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _document = inject(DOCUMENT);

  constructor() {
    this._document.documentElement.classList.remove('dark');
    this._document.documentElement.setAttribute('data-theme', 'light');
  }
}
