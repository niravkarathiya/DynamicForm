import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from 'src/app/services/form.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-addform',
  templateUrl: './addform.component.html',
  styleUrls: ['./addform.component.scss'],
})
export class AddformComponent {
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private formService: FormService
  ) {}

  isQuestionsVisible = false;
  name = 'Add';
  dynamicForm = this.fb.group({
    formId: [uuidv4()],
    formName: ['', Validators.required],
  });

  saveForm() {
    if (this.dynamicForm.valid) {
      this.route.navigate([
        '/form-details',
        {
          id: this.dynamicForm.controls.formId.value,
          name: this.dynamicForm.controls.formName.value,
        },
      ]);
    } else {
      return;
    }
  }
}
