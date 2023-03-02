import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.css'],
})
export class GettingStartedComponent implements OnInit {
  userIsConnected = false;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.userIsConnected = this.auth.user['_value'] !== null;
  }
}
