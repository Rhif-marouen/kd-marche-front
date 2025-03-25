import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStripeComponent } from './test-stripe.component';

describe('TestStripeComponent', () => {
  let component: TestStripeComponent;
  let fixture: ComponentFixture<TestStripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestStripeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
