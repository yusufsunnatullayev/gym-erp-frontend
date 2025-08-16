import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  imports: [
    Dialog,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    DatePickerModule,
  ],
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  standalone: true,
})
export class AddMemberComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}
}
