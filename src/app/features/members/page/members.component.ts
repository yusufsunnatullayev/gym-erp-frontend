import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { LucideAngularModule, Search } from 'lucide-angular';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { MembersService } from '../services/members.service';

@Component({
  imports: [
    Select,
    FormsModule,
    ButtonModule,
    InputGroupAddonModule,
    LucideAngularModule,
    InputIconModule,
    IconFieldModule,
  ],
  selector: 'app-members',
  templateUrl: './members.component.html',
  standalone: true,
})
export class MembersComponent implements OnInit {
  private membersService = inject(MembersService);
  statusOptions = [
    { name: 'Paid', code: 'PAID' },
    { name: 'Unpaid', code: 'UNPAID' },
  ];
  status = '';
  searchQuery = '';
  searchIcon = Search;

  ngOnInit(): void {
    this.membersService.getMembers().subscribe((data) => {
      console.log(data);
    });
  }
}
