import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { provideIonicAngular } from '@ionic/angular/standalone';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideIonicAngular()],
    });
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
