import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalUserComponent } from './approval-user.component';

describe('ApprovalUserComponent', () => {
  let component: ApprovalUserComponent;
  let fixture: ComponentFixture<ApprovalUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
