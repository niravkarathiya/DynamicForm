import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsComponent } from './components/forms/forms.component';
import { AddformComponent } from './components/addform/addform.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './modules/material/shared.module';
import { FormDetailsComponent } from './components/form-details/form-details.component';
import { FormpreviewComponent } from './components/formpreview/formpreview.component';

@NgModule({
  declarations: [
    AppComponent,
    FormsComponent,
    AddformComponent,
    FormDetailsComponent,
    FormpreviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
