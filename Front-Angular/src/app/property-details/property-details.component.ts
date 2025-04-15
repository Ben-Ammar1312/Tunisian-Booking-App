import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FooterComponent} from '../shared/footer/footer.component';
import {ClientNavbarComponent} from '../shared/client-navbar/client-navbar.component';
import {PropNavbarComponent} from '../shared/prop-navbar/prop-navbar.component';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, FooterComponent, ClientNavbarComponent, PropNavbarComponent, FormsModule],
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})

export class PropertyDetailsComponent implements OnInit {
  role: string | null = null;
  property: any;
  numberOfNights: number = 1;
  totalPrice: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.role = localStorage.getItem("role");



    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`https://localhost:7130/api/property/${id}`).subscribe((data) => {

      this.property = data;

      this.updateTotal()
    });



  }

  updateTotal() {
    if (this.property && this.property.pricePerNight) {
      this.totalPrice = this.property.pricePerNight * this.numberOfNights;
    }
  }
}
