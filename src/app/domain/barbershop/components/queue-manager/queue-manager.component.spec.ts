import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueManagerComponent } from './queue-manager.component';

describe('QueueManagerComponent', () => {
  let component: QueueManagerComponent;
  let fixture: ComponentFixture<QueueManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
