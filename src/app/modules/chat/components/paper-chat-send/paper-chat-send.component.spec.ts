import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperChatSendComponent } from './paper-chat-send.component';

describe('PaperChatSendComponent', () => {
  let component: PaperChatSendComponent;
  let fixture: ComponentFixture<PaperChatSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperChatSendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperChatSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
