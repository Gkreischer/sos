import { TestBed } from '@angular/core/testing';

import { SpreadSheetService } from './spreadsheet.service';

describe('CsvService', () => {
  let service: SpreadSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpreadSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
