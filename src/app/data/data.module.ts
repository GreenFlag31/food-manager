import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataRoutingModule } from './data-routing.module';
import { DataComponent } from './data.component';

import { SharedMainModule } from '../shared/shared-module.module';

@NgModule({
  declarations: [DataComponent],
  imports: [CommonModule, DataRoutingModule, SharedMainModule],
})
export class DataModule {}
