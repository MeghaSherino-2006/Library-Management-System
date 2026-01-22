import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member } from '../../shared/models/member.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class MemberService extends ApiBaseService<Member> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/members');
  }
}
