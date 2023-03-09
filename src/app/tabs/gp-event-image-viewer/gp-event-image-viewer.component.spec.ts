import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpEventImageViewerComponent } from './gp-event-image-viewer.component';

describe('GpEventImageViewerComponent', () => {
  let component: GpEventImageViewerComponent;
  let fixture: ComponentFixture<GpEventImageViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpEventImageViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpEventImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
