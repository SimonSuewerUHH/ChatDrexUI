import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchPaperDialogComponent } from './research-paper-dialog.component';

describe('ResearchPaperDialogComponent', () => {
  let component: ResearchPaperDialogComponent;
  let fixture: ComponentFixture<ResearchPaperDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchPaperDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearchPaperDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
