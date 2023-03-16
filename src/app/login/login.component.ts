import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { downConfirmPassword } from '../shared/animations';
import { AuthResponseData } from '../shared/IfoodObject';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [downConfirmPassword],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  isLoading = false;
  error = false;
  loginObservable!: Observable<AuthResponseData>;
  @ViewChild('choice') choice!: ElementRef;
  @ViewChild('choiceText') choiceText!: ElementRef;
  ErrorResponseMessage!: string;
  expanded = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {}

  onSubmit(choice: HTMLInputElement) {
    this.isLoading = true;
    const formValues = this.loginForm.value;

    if (this.expanded) {
      if (formValues.password !== formValues.confirmPassword) {
        this.ErrorResponseMessage = 'Entered Passwords does not match';
        this.isLoading = false;
        this.error = true;
        return;
      }
    }

    this.error = false;
    const { email, password } = formValues;

    if (choice.checked) {
      this.loginObservable = this.authService.signUp(email!, password!);
    } else {
      this.loginObservable = this.authService.signIn(email!, password!);
    }

    this.loginObservable.subscribe({
      next: () => {
        this.error = false;
        this.isLoading = false;
        this.router.navigate(['/my-list']);
      },
      error: (errorResponse) => {
        this.error = true;
        this.ErrorResponseMessage = errorResponse;
        this.isLoading = false;
        this.ref.markForCheck();
      },
    });
  }

  textToggleLogin() {
    this.choice.nativeElement.checked = !this.choice.nativeElement.checked;
    this.toggleLogin();
  }

  toggleLogin() {
    if (this.choice.nativeElement.checked) {
      // new user
      this.expanded = true;
    } else {
      // existing user
      this.expanded = false;
    }
    this.error = false;
    this.ref.markForCheck();
  }
}
