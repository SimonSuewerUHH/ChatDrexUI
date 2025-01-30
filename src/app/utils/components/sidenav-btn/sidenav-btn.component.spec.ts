import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavBtnComponent } from './sidenav-btn.component';

describe('SidenavBtnComponent', () => {
  let component: SidenavBtnComponent;
  let fixture: ComponentFixture<SidenavBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
