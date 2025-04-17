import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

const COMPONENTS = [LoginFormComponent];

@Component({
  selector: 'app-login',
  imports: [...COMPONENTS],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}
