import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  imports: [CommonModule, LucideAngularModule],
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  standalone: true,
})
export class PaginationComponent {
  page = model<number>(1);

  totalPages = input<number>(1);
  perPage = input<number>(10);

  LeftIcon = ChevronLeft;
  RightIcon = ChevronRight;

  goToPage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages()) return;
    this.page.set(newPage);
  }

  prevPage() {
    this.goToPage(this.page() - 1);
  }

  nextPage() {
    this.goToPage(this.page() + 1);
  }
}
