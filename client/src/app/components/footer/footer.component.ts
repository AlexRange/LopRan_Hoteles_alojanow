import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  isLoggedIn: boolean = false;
  isClient: boolean = false;
  userType: string | null = null;

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.userType = user.tipo;
        this.isClient = user.tipo === 'cliente';
      } else {
        this.userType = null;
        this.isClient = false;
      }
    });
  }

  shouldShowFullFooter(): boolean {
    // Show full footer if not logged in or if logged in as client
    return !this.isLoggedIn || this.isClient;
  }
}