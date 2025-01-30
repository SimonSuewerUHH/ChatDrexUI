import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionStudiesComponent } from './introduction-studies.component';

describe('IntroductionStudiesComponent', () => {
  let component: IntroductionStudiesComponent;
  let fixture: ComponentFixture<IntroductionStudiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroductionStudiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroductionStudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
