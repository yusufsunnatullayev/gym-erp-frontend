import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { LucideAngularModule, Search, Plus } from 'lucide-angular';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { MembersService } from '../services/members.service';
import { TableComponent } from '@app/shared/ui/table/table.component';
import { ActionInfo, Column } from '@app/shared/ui/table/table.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MemberModel } from '../model/member.model';
import { LoadingService } from '@app/core/services/loading.service';
import { AsyncPipe } from '@angular/common';
import { LoaderComponent } from '@app/shared/ui/loader/loader.component';
import { AddMemberComponent } from '../components/add-member/add-member.component';

@Component({
  imports: [
    Select,
    FormsModule,
    ButtonModule,
    InputGroupAddonModule,
    LucideAngularModule,
    InputIconModule,
    IconFieldModule,
    TableComponent,
    AsyncPipe,
    LoaderComponent,
    AddMemberComponent,
  ],
  selector: 'app-members',
  templateUrl: './members.component.html',
  standalone: true,
})
export class MembersComponent implements OnInit {
  private membersService = inject(MembersService);
  public loadingService = inject(LoadingService);
  data: Signal<MemberModel[]> = toSignal(this.membersService.getMembers(), {
    initialValue: [],
  });
  statusOptions = [
    { name: 'Paid', code: 'PAID' },
    { name: 'Unpaid', code: 'UNPAID' },
  ];
  dialogVisible = false;
  status = '';
  searchQuery = '';
  searchIcon = Search;
  Plus = Plus;

  columns: Column[] = [
    { id: 1, field: 'fullName', header: 'Full name' },
    { id: 2, field: 'phoneNumber', header: 'Phone number' },
    { id: 3, field: 'startDate', header: 'Start date' },
    { id: 4, field: 'status', header: 'Status' },
  ];

  ngOnInit(): void {}

  handleRowClick(actionInfo: ActionInfo) {
    console.log('Clicked row action info:', actionInfo);
  }

  showDialog() {
    this.dialogVisible = true;
  }
}
