import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GettingStartedRoutingModule } from './getting-started-routing.module';
import { GettingStartedComponent } from './getting-started.component';
import { SharedHeaderOnlyModule } from '../shared-module/sharedHeaderOnly-module.module';

@NgModule({
  declarations: [GettingStartedComponent],
  imports: [CommonModule, GettingStartedRoutingModule, SharedHeaderOnlyModule],
})
export class GettingStartedModule {}
