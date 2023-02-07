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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [DatePipe],

  bootstrap: [AppComponent],
})
export class AppModule {}
