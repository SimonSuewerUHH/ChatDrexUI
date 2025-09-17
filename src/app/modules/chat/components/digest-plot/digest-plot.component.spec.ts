import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigestPlotComponent } from './digest-plot.component';

describe('DigestPlotComponent', () => {
  let component: DigestPlotComponent;
  let fixture: ComponentFixture<DigestPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigestPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigestPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
