import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionManagementComponent } from './promotion-management.component';

describe('PromotionManagementComponent', () => {
  let component: PromotionManagementComponent;
  let fixture: ComponentFixture<PromotionManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionManagementComponent]
    });
    fixture = TestBed.createComponent(PromotionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
