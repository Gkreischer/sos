import { EnvironmentProviders, Provider } from '@angular/core';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { APP_CONFIG } from 'shared';
import { environment } from 'src/environments/environment';

export const testProviders: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(),
  provideHttpClientTesting(),

  {
    provide: APP_CONFIG,
    useValue: {
      baseUrl: environment.baseUrl,
      wsPort: environment.wsPort,
      wsHost: environment.wsHost,
      wsScheme: environment.wsScheme,
      authEndpoint: environment.authEndpoint,
    },
  },
];
