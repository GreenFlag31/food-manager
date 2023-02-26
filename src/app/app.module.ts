import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { SharedMainModule } from './shared-module/shared-module.module';
import { SharedHeaderOnlyModule } from './shared-module/sharedHeaderOnly-module.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedMainModule,
    SharedHeaderOnlyModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
