import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-buttons',
  standalone: false,
  templateUrl: './scroll-buttons.component.html',
  styleUrls: ['./scroll-buttons.component.css']
})
export class ScrollButtonsComponent {
  showScrollUp = false;
  showScrollDown = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollUp = window.scrollY > 200;
    this.showScrollDown = window.scrollY < (document.body.scrollHeight - window.innerHeight - 200);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }
}