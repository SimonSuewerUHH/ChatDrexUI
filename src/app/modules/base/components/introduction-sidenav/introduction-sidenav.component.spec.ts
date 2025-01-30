import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionSidenavComponent } from './introduction-sidenav.component';

describe('IntroductionSidenavComponent', () => {
  let component: IntroductionSidenavComponent;
  let fixture: ComponentFixture<IntroductionSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroductionSidenavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroductionSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
