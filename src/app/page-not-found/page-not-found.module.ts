import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageNotFoundRoutingModule } from './page-not-found-routing.module';
import { PageNotFoundComponent } from './page-not-found-component';
import { SharedHeaderOnlyModule } from '../shared/sharedHeaderOnly-module.module';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, PageNotFoundRoutingModule, SharedHeaderOnlyModule],
})
export class PageNotFoundModule {}
