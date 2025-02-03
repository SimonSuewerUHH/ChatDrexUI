import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugstOneNetworkComponent } from './drugst-one-network.component';

describe('DrugstOneNetworkComponent', () => {
  let component: DrugstOneNetworkComponent;
  let fixture: ComponentFixture<DrugstOneNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugstOneNetworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugstOneNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
