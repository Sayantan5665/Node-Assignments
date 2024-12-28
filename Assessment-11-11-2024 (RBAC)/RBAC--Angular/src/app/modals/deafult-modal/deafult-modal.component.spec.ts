import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeafultModalComponent } from './deafult-modal.component';

describe('DeafultModalComponent', () => {
  let component: DeafultModalComponent;
  let fixture: ComponentFixture<DeafultModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeafultModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeafultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
