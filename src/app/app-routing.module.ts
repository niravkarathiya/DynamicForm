import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddformComponent } from './components/addform/addform.component';
import { FormDetailsComponent } from './components/form-details/form-details.component';
import { FormpreviewComponent } from './components/formpreview/formpreview.component';
import { FormsComponent } from './components/forms/forms.component';

const routes: Routes = [
  { path: '', component: FormsComponent },
  { path: 'add-form', component: AddformComponent },
  { path: 'form-details', component: FormDetailsComponent },
  { path: 'form-preview', component: FormpreviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
