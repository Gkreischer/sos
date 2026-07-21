import { Injectable, inject, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from './../config/app.config';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { PreferencesPluginService } from './preferences-plugin.service';
(window as any).Pusher = Pusher;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  appConfig = inject(APP_CONFIG);
  preferenceService = inject(PreferencesPluginService);

  private echo: Echo<'reverb' | 'pusher'>;

  constructor() {
    this.echo = new Echo({
      broadcaster: 'pusher',

      key: this.appConfig.reverbKey,

      wsHost: this.appConfig.wsHost,
      wsPort: 8080,
      forceTLS: this.appConfig.wsScheme === 'wss',

      enabledTransports: this.appConfig.wsScheme === 'wss' ? ['wss'] : ['ws'],

      authEndpoint: this.appConfig.authEndpoint,

      disableStats: true,

      cluster: '',

      authorizer: (channel) => {
        return {
          authorize: async (socketId, callback) => {
            try {
              const token = await this.getToken();

              const response = await fetch(this.appConfig.authEndpoint, {
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
              });

              const data = await response.json();

              callback(null, data);
            } catch (err) {
              callback(err as any, null);
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
