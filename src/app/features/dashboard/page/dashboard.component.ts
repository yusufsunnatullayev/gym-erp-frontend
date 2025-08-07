import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  imports: [FormsModule, InputMaskModule, DatePickerModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
})
export class DashboardComponent implements OnInit {
  value = '';
  date = '';
  ngOnInit(): void {}
}
