import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperOverlayComponent } from './paper-overlay.component';

describe('PaperOverlayComponent', () => {
  let component: PaperOverlayComponent;
  let fixture: ComponentFixture<PaperOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
