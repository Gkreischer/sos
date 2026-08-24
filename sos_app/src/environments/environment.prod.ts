const protocol = window.location.protocol;
const hostname = window.location.hostname;

export const environment = {
  production: true,

  baseUrl: '/api/v1',
  storageUrl: '/storage',
  authEndpoint: '/broadcasting/auth',

  reverbKey: 'CHANGE_YOUR_KEY',

  wsHost: hostname,
  wsPort: 9003,
  wsScheme: protocol === 'https:' ? 'wss' : 'ws',

  cepUrl: 'https://viacep.com.br/ws',
};
