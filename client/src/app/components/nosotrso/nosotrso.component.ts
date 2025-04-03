import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-nosotrso',
  standalone: false,
  templateUrl: './nosotrso.component.html',
  styleUrl: './nosotrso.component.css'
})
export class NosotrsoComponent implements OnInit {
  showNavigationButtons = false;
  scrollThreshold = 200;

  ngOnInit() {
    this.checkScrollPosition();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScrollPosition();
  }

  checkScrollPosition() {
    this.showNavigationButtons = window.pageYOffset > this.scrollThreshold;
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
