import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionToolsComponent } from './introduction-tools.component';

describe('IntroductionToolsComponent', () => {
  let component: IntroductionToolsComponent;
  let fixture: ComponentFixture<IntroductionToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroductionToolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroductionToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
