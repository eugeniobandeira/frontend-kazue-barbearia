import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingApprovalComponent } from './waiting-approval.component';

describe('WaitingApprovalComponent', () => {
  let component: WaitingApprovalComponent;
  let fixture: ComponentFixture<WaitingApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
