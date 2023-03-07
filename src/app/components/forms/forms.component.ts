import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {
  constructor(private formService: FormService, private route: Router) {}
  forms: any[] = [];
  ngOnInit() {
    this.forms = this.formService.getItem('Forms');
  }

  formDetails(id: string, name: string) {
    this.route.navigate(['/form-details', { id: id, name: name }]);
  }

  formPreview(id: string) {
    this.route.navigate(['/form-preview', { id: id }]);
  }

  removeForm(index: number) {
    this.forms.splice(index, 1);
    this.formService.setItem('Forms', this.forms);
  }
}
