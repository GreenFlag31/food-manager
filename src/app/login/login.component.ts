import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { selfPic } from '../shared/animations';
import { AuthResponseData } from '../shared/IfoodObject';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [selfPic],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error = false;
  loginObservable!: Observable<AuthResponseData>;

  ErrorResponseMessage!: string;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm, choice: HTMLInputElement) {
    this.isLoading = true;
    const formValues = form.form.value;
    const { email, password } = formValues;

    if (choice.checked) {
      this.loginObservable = this.authService.signUp(email, password);
    } else {
      this.loginObservable = this.authService.signIn(email, password);
    }

    this.loginObservable.subscribe({
      next: () => {
        this.error = false;
        this.router.navigate(['/my-list']);
      },
      error: (errorResponse) => {
        this.error = true;
        this.ErrorResponseMessage = errorResponse;
      },
      complete: () => {
        form.reset();
        this.isLoading = false;
      },
    });
  }

  toggleLogin(choice: HTMLInputElement, text: HTMLParagraphElement) {
    if (choice.checked) {
      // new user
      text.textContent = 'Sign Up';
    } else {
      // existing user
      text.textContent = 'Sign In';
    }
  }
}
