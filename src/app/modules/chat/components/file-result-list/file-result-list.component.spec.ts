import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileResultListComponent } from './file-result-list.component';

describe('FileResultListComponent', () => {
  let component: FileResultListComponent;
  let fixture: ComponentFixture<FileResultListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileResultListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
