import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _spinner = inject(NgxSpinnerService);
  private requestCount = 0;
  private readonly spinnerName = 'globalSpinner';

  start() {
    this.requestCount++;
    if (this.requestCount === 1) {
      this._spinner.show(this.spinnerName);
    }
  }

  stop() {
    this.requestCount--;

    if (this.requestCount <= 0) {
      this.requestCount = 0;

      setTimeout(() => {
        this._spinner.hide(this.spinnerName);
      }, 500);
    }
  }
}
