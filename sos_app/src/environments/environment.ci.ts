export const environment = {
  production: false,
  baseUrl: '/api/v1',
  storageUrl: '/storage',
  cepUrl: 'https://viacep.com.br/ws',

  authEndpoint: '/broadcasting/auth',

  reverbKey: 'CHANGEYOURKEY',

  wsHost: window.location.hostname,
  wsPort: 9003,
  wsScheme: window.location.protocol === 'https:' ? 'wss' : 'ws',
};
