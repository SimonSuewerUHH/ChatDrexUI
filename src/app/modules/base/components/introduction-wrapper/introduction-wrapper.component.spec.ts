import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionWrapperComponent } from './introduction-wrapper.component';

describe('IntroductionWrapperComponent', () => {
  let component: IntroductionWrapperComponent;
  let fixture: ComponentFixture<IntroductionWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroductionWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroductionWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
