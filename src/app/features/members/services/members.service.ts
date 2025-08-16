import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { MemberModel } from '../model/member.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private members$?: Observable<MemberModel[]>;

  getMembers(): Observable<MemberModel[]> {
    if (!this.members$) {
      this.members$ = this.http
        .get<MemberModel[]>(`${this.apiUrl}/members`)
        .pipe(shareReplay(1));
    }
    return this.members$;
  }

  addMember(member: MemberModel): Observable<MemberModel> {
    return this.http
      .post<MemberModel>(`${this.apiUrl}/members`, member)
      .pipe(tap(() => this.refreshMembers()));
  }

  updateMember(id: string, member: MemberModel): Observable<MemberModel> {
    return this.http
      .put<MemberModel>(`${this.apiUrl}/members/${id}`, member)
      .pipe(tap(() => this.refreshMembers()));
  }

  deleteMember(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/members/${id}`)
      .pipe(tap(() => this.refreshMembers()));
  }

  refreshMembers(): void {
    this.members$ = this.http
      .get<MemberModel[]>(`${this.apiUrl}/members`)
      .pipe(shareReplay(1));
  }
}
