import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-category-bar',
  standalone: false,
  templateUrl: './category-bar.component.html',
  styleUrl: './category-bar.component.css'
})
export class CategoryBarComponent {

  @Output() categorySelected: EventEmitter<string> = new EventEmitter<string>();

  categories = [
    { name: 'Playa', icon: '🏖️' },
    { name: 'Montaña', icon: '⛰️' },
    { name: 'Bosque', icon: '🌲' },
    { name: 'Rural', icon: '🏡' },
    { name: 'Pueblo Mágico', icon: '✨' },
    { name: 'Ecoturismo', icon: '🌿' },
    { name: 'Aventura', icon: '🎒' },
  ];

  onCategoryClick(category: string) {
    this.categorySelected.emit(category);
  }
}
