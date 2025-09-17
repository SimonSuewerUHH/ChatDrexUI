import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NedrexInfoDialogComponent } from './nedrex-info-dialog.component';

describe('NedrexInfoDialogComponent', () => {
  let component: NedrexInfoDialogComponent;
  let fixture: ComponentFixture<NedrexInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NedrexInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NedrexInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
