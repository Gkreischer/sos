import { Injectable, inject, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from './../config/app.config';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

(window as any).Pusher = Pusher;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  appConfig = inject(APP_CONFIG);
  http = inject(HttpClient);
  private echo: Echo<'reverb' | 'pusher'>;

  constructor() {
    this.echo = new Echo({
      broadcaster: 'reverb',

      key: this.appConfig.reverbKey,

      wsHost: this.appConfig.wsHost,
      wsPort: 8080,

      forceTLS: this.appConfig.wsScheme === 'wss',

      enabledTransports: this.appConfig.wsScheme === 'wss' ? ['wss'] : ['ws'],

      authEndpoint: this.appConfig.authEndpoint,

      withCredentials: true,

      disableStats: true,

      cluster: '',

      authorizer: (channel) => {
        return {
          authorize: (socketId, callback) => {
            this.http
              .post(
                this.appConfig.authEndpoint,
                {
                  socket_id: socketId,
                  channel_name: channel.name,
                },
                {
                  withCredentials: true,
                },
              )
              .subscribe({
                next: (response) => {
                  callback(null, response as any);
                },
                error: (error) => {
                  callback(error, null);
                },
              });
          },
        };
      },
    });
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

  leavePrivate(channel: string) {
    this.echo.leave(`private-${channel}`);
  }
}
