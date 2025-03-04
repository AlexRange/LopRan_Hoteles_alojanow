import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'client';
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Suscribirse directamente al observable user$
    // this.authService.user$.subscribe((user: any) => {
    //   if (user && user['roles'] && user['roles'].includes('admin')) {
    //     this.isAdmin = true;
    //   } else {
    //     this.isAdmin = false;
    //   }
    // });
  }
}