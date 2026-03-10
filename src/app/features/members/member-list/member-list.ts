import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Member } from '../../../shared/models/member.model';
import { MemberService } from '../../../core/services/member.service';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './member-list.html',
  styleUrl: './member-list.scss'
})
export class MemberList implements OnInit {
  members: Member[] = [];

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.memberService.getMembers().subscribe({
      next: (data) => (this.members = data)
    });
  }
}
