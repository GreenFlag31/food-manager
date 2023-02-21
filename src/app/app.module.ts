import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DataComponent } from './data/data.component';
import { ItemComponent } from './item/item.component';
import { ItemViewComponent } from './item-view/item-view.component';
import { ChangeItemComponent } from './change-item/change-item.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppCreateComponentComponent } from './app-create-component/app-create-component.component';
import { TipsComponent } from './tips/tips.component';
import { DatePipe } from '@angular/common';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { PaginationComponent } from './pagination/pagination.component';
import { PageNotFoundComponent } from './page-not-found-component/page-not-found-component';
import { KeyDownDirective } from './key-down.directive';
import { SafeHTMLPipe } from './safe-html.pipe';
import { ContactComponent } from './contact/contact.component';
import { GeneralOverviewComponent } from './general-overview/general-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DataComponent,
    ItemComponent,
    ItemViewComponent,
    ChangeItemComponent,
    AppCreateComponentComponent,
    TipsComponent,
    GettingStartedComponent,
    LoginComponent,
    PaginationComponent,
    PageNotFoundComponent,
    KeyDownDirective,
    SafeHTMLPipe,
    ContactComponent,
    GeneralOverviewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [DatePipe, SafeHTMLPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
