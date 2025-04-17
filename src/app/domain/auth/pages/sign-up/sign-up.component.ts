import { Component } from '@angular/core';
import { SignUpFormComponent } from '../../components/sign-up-form/sign-up-form.component';

const COMPONENTS = [SignUpFormComponent];
@Component({
  selector: 'app-sign-up',
  imports: [SignUpFormComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {}
