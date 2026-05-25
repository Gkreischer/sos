import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { IonicModule } from '@ionic/angular';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
    });
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
