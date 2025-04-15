import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardNavbarComponent } from './standard-navbar.component';

describe('StandardNavbarComponent', () => {
  let component: StandardNavbarComponent;
  let fixture: ComponentFixture<StandardNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
