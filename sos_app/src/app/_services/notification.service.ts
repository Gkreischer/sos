import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { PreferencesPluginService } from './preferences-plugin.service';
(window as any).Pusher = Pusher;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  preferenceService = inject(PreferencesPluginService);

  private echo: Echo<'reverb'>;

  constructor() {
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: environment.reverbKey,
      wsHost: environment.reverbHost,
      wsPort: environment.reverbPort,
      forceTLS: false,
      enabledTransports: ['ws'],
      // bearerToken: 'jwt', // Pode remover esta linha se for usar a estrutura abaixo

      // ALTERAÇÃO AQUI: Passamos uma função customizada de autorização
      authorizer: (channel, options) => {
        return {
          authorize: async (socketId, callback) => {
            try {
              // Aguarda o token real ser recuperado do storage
              const token = await this.getToken();

              // Faz a requisição manualmente via fetch ou deixa o Echo tratar
              // Mas o jeito mais limpo usando a API nativa do Echo/Pusher é:
              const response = await fetch(
                `${environment.baseUrl.replace(/\/api$/, '')}/broadcasting/auth`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token.value,
                    Accept: 'application/json',
                  },
                  body: JSON.stringify({
                    socket_id: socketId,
                    channel_name: channel.name,
                  }),
                },
              );

              if (!response.ok) {
                throw new Error('Falha na autenticação do canal');
              }

              const data = await response.json();
              callback(null, data); // Sucesso!
            } catch (error) {
              callback(error as any, null); // Erro!
            }
          },
        };
      },
    });
  }

  async getToken() {
    return await this.preferenceService.get('_t');
  }

  listen<T>(channel: string, event: string, callback: (data: T) => void) {
    this.echo.channel(channel).listen(event, callback);
  }

  listenPrivate<T>(
    channel: string,
    event: string,
    callback: (data: T) => void,
  ) {
    this.echo.private(channel).listen(event, callback);
  }

  leave(channel: string) {
    this.echo.leave(channel);
  }
}
