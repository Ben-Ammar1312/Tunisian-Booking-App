import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropNavbarComponent } from './prop-navbar.component';

describe('PropNavbarComponent', () => {
  let component: PropNavbarComponent;
  let fixture: ComponentFixture<PropNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
