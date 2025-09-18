import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileResultDetailComponent } from './file-result-detail.component';

describe('FileResultDetailComponent', () => {
  let component: FileResultDetailComponent;
  let fixture: ComponentFixture<FileResultDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileResultDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileResultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
