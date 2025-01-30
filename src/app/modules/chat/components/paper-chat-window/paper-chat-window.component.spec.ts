import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperChatWindowComponent } from './paper-chat-window.component';

describe('PaperChatWindowComponent', () => {
  let component: PaperChatWindowComponent;
  let fixture: ComponentFixture<PaperChatWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperChatWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperChatWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
