import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterAnnonceComponent } from './ajouter-annonce.component';

describe('AjouterAnnonceComponent', () => {
  let component: AjouterAnnonceComponent;
  let fixture: ComponentFixture<AjouterAnnonceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterAnnonceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterAnnonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
