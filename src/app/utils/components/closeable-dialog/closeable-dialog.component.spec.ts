import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseableDialogComponent } from './closeable-dialog.component';

describe('CloseableDialogComponent', () => {
  let component: CloseableDialogComponent;
  let fixture: ComponentFixture<CloseableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseableDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
