const protocol = window.location.protocol;
const hostname = window.location.hostname;
const port = window.location.port || (protocol === 'https:' ? '443' : '80');

export const environment = {
  production: true,

  baseUrl: '/api/v1',
  storageUrl: '/storage',
  authEndpoint: '/broadcasting/auth',

  reverbKey: 'WFBts8xvsdwQRDY2',

  wsHost: hostname,
  wsPort: Number(port),
  wsScheme: protocol === 'https:' ? 'wss' : 'ws',

  cepUrl: 'https://viacep.com.br/ws',
};
