import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopViewComponent } from './barbershop-view.component';

describe('BarbershopViewComponent', () => {
  let component: BarbershopViewComponent;
  let fixture: ComponentFixture<BarbershopViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarbershopViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
