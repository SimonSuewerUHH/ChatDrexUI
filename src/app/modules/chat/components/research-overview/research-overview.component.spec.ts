import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchOverviewComponent } from './research-overview.component';

describe('ResearchOverviewComponent', () => {
  let component: ResearchOverviewComponent;
  let fixture: ComponentFixture<ResearchOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearchOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
