import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MemberModel } from '../model/member.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMembers(): Observable<MemberModel> {
    return this.http.get<MemberModel>(`${this.apiUrl}/members`);
  }
}
