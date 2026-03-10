import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MemberService } from '../../../core/services/member.service';

@Component({
  selector: 'app-member-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './member-add.html',
  styleUrl: './member-add.scss'
})
export class MemberAdd {
  form!: ReturnType<FormBuilder['group']>;


  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private router: Router
  ) {
    this.form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    active: [true]
  });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.memberService.addMember({
      id: Date.now(),
      name: this.form.value.name!,
      email: this.form.value.email!,
      active: true
    }).subscribe({
      next: () => {
        alert(' Member registered!');
        this.router.navigate(['/members']);
      }
    });
  }
}
