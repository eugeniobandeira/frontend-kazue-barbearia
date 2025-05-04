import { APP_INITIALIZER, Provider } from '@angular/core';

export const THEME_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: () => {
    return () => {};
  },
  multi: true,
};
