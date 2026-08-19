import { InjectionToken } from '@angular/core';

export interface AppConfig {
  baseUrl: string;

  reverbKey: string;
  wsPort: number;
  wsHost: string;
  wsScheme: string;
  authEndpoint: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
