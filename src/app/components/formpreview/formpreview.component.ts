import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-formpreview',
  templateUrl: './formpreview.component.html',
  styleUrls: ['./formpreview.component.scss'],
})
export class FormpreviewComponent implements OnInit {
  formValues: any;
  selectedQue: any;
  constructor(
    private formService: FormService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  formData: any;
  form!: FormGroup;
  fields: any[] = [];
  checkBox: any[] = [];
  id = this.route.snapshot.paramMap.get('id') || '';
  checkBoxData: any[] = [];
  numChecked: number = 0;

  ngOnInit() {
    this.form = this.formBuilder.group({
      formId: [this.id],
    });

    this.formData = this.formService.getItemById(this.id, 'Forms');
    if (!this.formData) {
      this.router.navigate(['/']);
    }
    this.generateForm();
    this.populateForm();
    this.formData?.questions.forEach((que: any, index: number) => {
      if (que.type === 'checkbox') {
        // console.log('this.currentQuestion: ', this.currentQuestion);
        que.checkBoxData = que.optionControl;
        que.index = index;
        this.checkBoxData = que.optionControl;
        this.addCheckBox(que);
      }
    });
    // console.log(this.currentQuestion);
  }

  generateForm() {
    this.formData?.questions.forEach((que: any, index: number) => {
      this.form.addControl(
        que.question + index,
        que.type === 'checkbox'
          ? new FormArray([])
          : new FormControl(
              '',
              que.validations.length ? this.getValidators(que) : []
            )
      );
    });
  }

  getcheckBoxArray(question: any, index: number) {
    return this.form.controls[question + index] as FormArray;
  }

  addCheckBox(currentQuestion: any) {
    let checkBoxalue = this.formValues
      ? this.formValues[currentQuestion.question + currentQuestion.index]
      : [];
    if (checkBoxalue?.length) {
      currentQuestion.checkBoxData.forEach((data: any, index: any) => {
        this.getcheckBoxArray(
          currentQuestion.question,
          currentQuestion.index
        ).push(
          new FormControl(
            checkBoxalue ? checkBoxalue[index] : false,
            Validators.compose([
              currentQuestion.validations.includes('required')
                ? Validators.required
                : null,
              this.checkBoxValidation(currentQuestion),
            ])
          )
        );
      });
    } else {
      currentQuestion.checkBoxData.forEach((data: any, index: any) => {
        this.getcheckBoxArray(
          currentQuestion.question,
          currentQuestion.index
        ).push(new FormControl(false));
      });
    }
  }

  checkBoxValidation(currentQuestion: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      this.form
        .get(currentQuestion.question + currentQuestion.index)
        ?.valueChanges.subscribe((res) => {
          const count = res.filter((res: any) => res === true);
          let min,
            max = null;
          if (currentQuestion.min)
            min = count?.length < currentQuestion.min ? true : null;
          if (currentQuestion.max)
            max = count?.length > currentQuestion.max ? true : null;

          if (min || max) {
            this.form
              .get(currentQuestion.question + currentQuestion.index)
              ?.setErrors({ min, max });
          }
        });
      return null;
    };
  }

  populateForm() {
    this.formValues = this.formService.getItemById(this.id, 'PopulatedForm');
    if (this.formValues) {
      this.form.patchValue(this.formValues);
    }
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
    console.log('this.form: ', this.form);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
    if (this.form.valid) {
      let allForms = this.formService.getItem('PopulatedForm');
      let index = allForms.findIndex(
        (res: any) => res.formId === this.form.controls['formId'].value
      );
      if (index >= 0) {
        allForms[index] = this.form.value;
        this.formService.openSnackBar('Form Updated Successfully !', 'Close');
      } else {
        this.form.patchValue({
          formId: this.id,
        });
        allForms.push(this.form.value);
      }
      this.formService.setItem('PopulatedForm', allForms);
      this.formService.openSnackBar('Form Saved Successfully !', 'Close');
    }
  }

  checkToggle(event: any) {
    let checkboxControl = {
      checked: false,
      name: event.source.name,
    };
    if (event.checked) {
      checkboxControl = {
        checked: true,
        name: event.source.name,
      };
    }
    this.checkBox.push(checkboxControl);
  }

  checkValidation(ctrl: any) {
    // console.log('this.form.get(ctrl)?.value: ', this.form.get(ctrl)?.value);

    let value = this.form.get(ctrl)?.value.filter((res: any) => res);
    return value.length ? false : true;
  }
}
