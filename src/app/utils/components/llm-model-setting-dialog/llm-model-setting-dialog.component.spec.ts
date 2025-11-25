import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmModelSettingDialogComponent } from './llm-model-setting-dialog.component';

describe('LlmModelSettingDialogComponent', () => {
  let component: LlmModelSettingDialogComponent;
  let fixture: ComponentFixture<LlmModelSettingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlmModelSettingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlmModelSettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
