import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { SharedHeaderOnlyModule } from '../shared-module/sharedHeaderOnly-module.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule, SharedHeaderOnlyModule],
})
export class LoginModule {}
