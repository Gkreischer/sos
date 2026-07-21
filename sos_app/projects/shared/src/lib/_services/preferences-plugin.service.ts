import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root',
})
export class PreferencesPluginService {
  constructor() {}

  async set(key: string, value: any) {
    return await Preferences.set({ key, value });
  }

  async get(key: string) {
    return await Preferences.get({ key });
  }

  async remove(key: string) {
    return await Preferences.remove({ key });
  }
}
