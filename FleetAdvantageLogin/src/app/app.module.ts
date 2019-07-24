import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppLoginComponent } from './app-login/app-login.component';
import { CharacterCountValidator } from './directives/character-count.directive';
import { FutureDateCheckValidator } from './directives/future-date-check.directive';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppLoginComponent,
    CharacterCountValidator,
    FutureDateCheckValidator
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
