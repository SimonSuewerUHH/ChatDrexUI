import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorListDialogComponent } from './error-list-dialog.component';

describe('ErrorListDialogComponent', () => {
  let component: ErrorListDialogComponent;
  let fixture: ComponentFixture<ErrorListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorListDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
