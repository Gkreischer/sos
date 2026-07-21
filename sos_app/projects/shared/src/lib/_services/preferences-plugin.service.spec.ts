import { TestBed } from '@angular/core/testing';

import { PreferencesPluginService } from './preferences-plugin.service';

describe('PreferencesPluginService', () => {
  let service: PreferencesPluginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreferencesPluginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
