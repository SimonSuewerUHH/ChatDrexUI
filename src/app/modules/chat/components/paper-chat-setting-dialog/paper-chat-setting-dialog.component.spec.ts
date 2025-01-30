import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperChatSettingDialogComponent } from './paper-chat-setting-dialog.component';

describe('PaperChatSettingDialogComponent', () => {
  let component: PaperChatSettingDialogComponent;
  let fixture: ComponentFixture<PaperChatSettingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperChatSettingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperChatSettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
