import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailWrapperComponent } from './project-detail-wrapper.component';

describe('ProjectDetailWrapperComponent', () => {
  let component: ProjectDetailWrapperComponent;
  let fixture: ComponentFixture<ProjectDetailWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
