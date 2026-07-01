import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.orcex',
  appName: 'orcex',
  webDir: 'www/browser',
  server: {
    androidScheme: 'http',
  },
};

export default config;
