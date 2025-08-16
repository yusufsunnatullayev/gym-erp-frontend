import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionInfo, Column } from './table.model';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, CurrencyPipe } from '@angular/common';

import {
  LucideAngularModule,
  Pencil,
  Trash2,
  ArrowRight,
} from 'lucide-angular';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [
    TableModule,
    PaginatorModule,
    InputTextModule,
    CommonModule,
    LucideAngularModule,
    CurrencyPipe,
  ],
})
export class TableComponent {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() rows: number = 10;
  @Input() hasDetailPage: boolean = false;
  @Output() rowButtonClick = new EventEmitter<ActionInfo>();
  Pencil = Pencil;
  Trash = Trash2;
  ArrowRight = ArrowRight;

  onButtonClick(actionInfo: ActionInfo) {
    this.rowButtonClick.emit(actionInfo);
  }
}
