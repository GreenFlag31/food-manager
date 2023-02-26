import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';

import { SharedHeaderOnlyModule } from '../shared-module/sharedHeaderOnly-module.module';

@NgModule({
  declarations: [ContactComponent],
  imports: [CommonModule, ContactRoutingModule, SharedHeaderOnlyModule],
})
export class ContactModule {}
