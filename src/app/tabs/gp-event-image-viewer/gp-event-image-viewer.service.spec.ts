import { TestBed } from '@angular/core/testing';

import { GpEventImageViewerService } from './gp-event-image-viewer.service';

describe('GpEventImageViewerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GpEventImageViewerService = TestBed.get(GpEventImageViewerService);
    expect(service).toBeTruthy();
  });
});
