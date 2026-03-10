import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../../shared/models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://localhost:3000/members';

  constructor(private http: HttpClient) {}

  getMemberById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }
  getMembers() {
  return this.http.get<Member[]>(this.apiUrl);
}
addMember(member: Member) {
  return this.http.post<Member>(this.apiUrl, member);
}

deleteMember(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}


}
