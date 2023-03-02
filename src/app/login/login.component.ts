import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { first, Observable } from 'rxjs';
import { selfPic } from '../shared/animations';
import { AuthResponseData } from '../shared/IfoodObject';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [selfPic],
})
export class LoginComponent implements AfterViewInit {
  isLoading = false;
  error = false;
  loginObservable!: Observable<AuthResponseData>;
  @ViewChild('choice') choice!: ElementRef;
  ErrorResponseMessage!: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit() {
    const firstVisit = localStorage.getItem('alreadyVisited');
    if (!firstVisit) {
      this.choice.nativeElement.checked = true;
    } else {
      this.choice.nativeElement.checked = false;
    }
  }

  onSubmit(form: NgForm, choice: HTMLInputElement) {
    this.isLoading = true;
    this.error = false;
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
        localStorage.setItem('alreadyVisited', 'true');
        this.router.navigate(['/my-list']);
      },
      error: (errorResponse) => {
        this.error = true;
        this.ErrorResponseMessage = errorResponse;
      },
      complete: () => {
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
