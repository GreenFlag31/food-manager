import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GeneralOverviewComponent } from '../general-overview/general-overview.component';
import { TipsComponent } from '../tips/tips.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ItemComponent } from '../item/item.component';
import { ItemViewComponent } from '../item-view/item-view.component';
import { ChangeItemComponent } from '../change-item/change-item.component';
import { AppCreateComponent } from '../app-create-component/app-create-component.component';
import { FormsModule } from '@angular/forms';
import { SafeHTMLPipe } from '../safe-html.pipe';
import { RouterModule } from '@angular/router';
import { SharedHeaderOnlyModule } from './sharedHeaderOnly-module.module';
import { KeyDownDirective } from '../key-down.directive';

@NgModule({
  declarations: [
    GeneralOverviewComponent,
    TipsComponent,
    ItemComponent,
    PaginationComponent,
    ItemViewComponent,
    ChangeItemComponent,
    AppCreateComponent,
    SafeHTMLPipe,
    KeyDownDirective,
  ],

  imports: [CommonModule, FormsModule, RouterModule, SharedHeaderOnlyModule],
  exports: [
    GeneralOverviewComponent,
    TipsComponent,
    ItemComponent,
    PaginationComponent,
    ItemViewComponent,
    ChangeItemComponent,
    AppCreateComponent,
    FormsModule,
    SharedHeaderOnlyModule,
  ],
  providers: [SafeHTMLPipe, DatePipe],
})
export class SharedMainModule {}
