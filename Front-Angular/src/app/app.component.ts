import { Component, OnInit } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { CommonModule }      from '@angular/common';

import { AuthService }       from './Services/auth.service';
import { FooterComponent }   from './shared/footer/footer.component';
import { ChatWidgetComponent } from './chat-widget/chat-widget.component';

@Component({
  selector:    'app-root',
  standalone:  true,
  imports:     [
    RouterOutlet,
    CommonModule,          // gives *ngIf, *ngFor, etc.
    FooterComponent,
    ChatWidgetComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  // keep this boolean if you like, or skip it and just pipe directly
  isLoggedIn = false;

  // ← make auth public if you want to reference auth.isLoggedIn$ in the template
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    // initialize once
    this.isLoggedIn = !!localStorage.getItem('token');

    // subscribe to live changes
    this.auth.isLoggedIn$.subscribe(flag => this.isLoggedIn = flag);
  }
}
