import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewchatBtnComponent } from './newchat-btn.component';

describe('NewchatBtnComponent', () => {
  let component: NewchatBtnComponent;
  let fixture: ComponentFixture<NewchatBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewchatBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewchatBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
