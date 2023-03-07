import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-formpreview',
  templateUrl: './formpreview.component.html',
  styleUrls: ['./formpreview.component.scss'],
})
export class FormpreviewComponent implements OnInit {
  constructor(
    private formService: FormService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  formData: any;
  form!: FormGroup;
  fields: any[] = [];
  selectedCheckBox: any[] = [];
  id = this.route.snapshot.paramMap.get('id') || '';
  ngOnInit() {
    this.form = this.formBuilder.group({});
    this.formData = this.formService.getItemById(this.id, 'Forms');
    if (!this.formData) {
      this.router.navigate(['/']);
    }
    this.generateForm();
  }

  generateForm() {
    this.formData?.questions.forEach((que: any, index: number) => {
      this.form.addControl(
        que.question + index,
        new FormControl(
          '',
          que.validations.length ? this.getValidators(que) : []
        )
      );
    });
  }

  getValidators(question: any) {
    let validators: any[] = [];
    question.validations.forEach((res: any) => {
      if (res === 'required') {
        validators.push(Validators.required);
      }
      if (question.type === 'number') {
        validators.push(Validators.pattern(/^[0-9]+$/));
      }
      if (res === 'minLength') {
        validators.push(Validators.minLength(question.minLength));
      }
      if (res === 'maxLength') {
        validators.push(Validators.maxLength(question.maxLength));
      }
      if (res === 'min') {
        validators.push(Validators.min(question.min));
      }
      if (res === 'max') {
        validators.push(Validators.max(question.max));
      }
    });
    return validators;
  }

  saveForm() {
    console.log(this.form);
  }

  checkToggle(item: { id: string }) {
    this.selectedCheckBox.push(item);
    console.log('this.selectedCheckBox: ', this.selectedCheckBox);
  }
}
