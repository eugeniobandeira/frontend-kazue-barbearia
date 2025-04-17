import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStatusFormComponent } from './manage-status-form.component';

describe('ManageStatusFormComponent', () => {
  let component: ManageStatusFormComponent;
  let fixture: ComponentFixture<ManageStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStatusFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
