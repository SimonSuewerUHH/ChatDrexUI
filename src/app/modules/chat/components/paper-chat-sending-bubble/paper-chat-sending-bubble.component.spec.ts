import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperChatSendingBubbleComponent } from './paper-chat-sending-bubble.component';

describe('PaperChatSendingBubbleComponent', () => {
  let component: PaperChatSendingBubbleComponent;
  let fixture: ComponentFixture<PaperChatSendingBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperChatSendingBubbleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperChatSendingBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
