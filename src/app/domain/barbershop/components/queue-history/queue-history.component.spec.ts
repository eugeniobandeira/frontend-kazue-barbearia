import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueHistoryComponent } from './queue-history.component';

describe('QueueHistoryComponent', () => {
  let component: QueueHistoryComponent;
  let fixture: ComponentFixture<QueueHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
