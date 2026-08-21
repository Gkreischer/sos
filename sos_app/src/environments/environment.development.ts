export const environment = {
  production: false,
  baseUrl: '/api/v1',
  storageUrl: '/storage',
  cepUrl: 'https://viacep.com.br/ws',

  authEndpoint: '/broadcasting/auth',

  reverbKey: 'WFBts8xvsdwQRDY2',

  wsHost: window.location.hostname,
  wsPort: 8080,
  wsScheme: window.location.protocol === 'https:' ? 'wss' : 'ws',
};
