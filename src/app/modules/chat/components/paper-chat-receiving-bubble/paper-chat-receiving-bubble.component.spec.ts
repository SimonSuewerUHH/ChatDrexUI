import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperChatReceivingBubbleComponent } from './paper-chat-receiving-bubble.component';

describe('PaperChatRecivingBubbleComponent', () => {
  let component: PaperChatReceivingBubbleComponent;
  let fixture: ComponentFixture<PaperChatReceivingBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperChatReceivingBubbleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperChatReceivingBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
