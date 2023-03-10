import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/services/form.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-form-details',
  templateUrl: './form-details.component.html',
  styleUrls: ['./form-details.component.scss'],
})
export class FormDetailsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private route: ActivatedRoute
  ) {}
  formName = '';
  id = '';
  selectionForm = false;
  dynamicForm!: FormGroup;
  questionsType = [
    'text',
    'number',
    'textArea',
    'date',
    'dropdown',
    'radio',
    'checkbox',
    'multi-select',
  ];
  questions: any[] = [];
  radioContainer = false;
  checkBoxContainer = false;
  optionControlType!: 'dropdown' | 'radio' | 'checkbox' | 'multi-select';
  validations: string[] = [];
  isMin = false;
  isMinLength = false;
  isMax = false;
  isMaxLength = false;

  ngOnInit() {
    this.formName = this.route.snapshot.paramMap.get('name') || '';
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.createForm();
    this.getQuestions();
  }

  createForm() {
    this.dynamicForm = this.fb.group({
      formId: [this.id],
      questionId: [''],
      formName: [this.formName, Validators.required],
      question: ['', Validators.required],
      type: ['', Validators.required],
      optionControl: this.fb.array([]),
      validations: [''],
      min: ['', Validators.pattern(/^[0-9]+$/)],
      max: ['', Validators.pattern(/^[0-9]+$/)],
      minLength: ['', Validators.pattern(/^[0-9]+$/)],
      maxLength: ['', Validators.pattern(/^[0-9]+$/)],
      isRequired: [false],
    });
  }

  getQuestions() {
    const formData = this.formService.getItem('Forms');
    const form = formData.find((form: any) => form.formId === this.id);
    this.questions = form?.questions || [];
  }

  get optionControlArray() {
    return this.dynamicForm.get('optionControl') as FormArray;
  }

  optionControlGroup() {
    return this.fb.group({
      option: ['', Validators.required],
    });
  }

  addQuestions() {
    if (this.dynamicForm.valid) {
      if (this.dynamicForm.value.questionId) {
        const index = this.questions.findIndex(
          (q) => q.questionId === this.dynamicForm.value.questionId
        );
        this.questions[index] = this.dynamicForm.value;
        this.formService.openSnackBar(
          'Question Updated Successfully !',
          'Close'
        );
      } else {
        this.dynamicForm.controls['questionId'].setValue(uuidv4());
        this.questions.push(this.dynamicForm.value);
        this.formService.openSnackBar('Question Added Successfully !', 'Close');
      }
      this.dynamicForm.reset();

      this.dynamicForm.patchValue({
        formId: this.id,
        formName: this.formName,
      });
      this.addToLocalStorage();
      this.showHideValidation();
      this.optionControlArray.clear();
    }
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
    this.addToLocalStorage();
    this.dynamicForm.get('questions')?.reset();
    this.formService.openSnackBar('Question Deleted Successfully !', 'Close');
  }

  onTypeSelect(event: any) {
    this.validations = [];
    this.dynamicForm.get('validations')?.setValue('');
    this.validations.push('required');
    this.optionControlArray.clear();
    switch (event.value) {
      case 'radio':
        this.optionControlType = 'radio';
        this.optionControlArray.push(this.optionControlGroup());
        this.optionControlArray.push(this.optionControlGroup());
        this.showHideValidation();

        break;
      case 'checkbox':
      case 'dropdown':
      case 'multi-select':
        this.optionControlType = event.value;
        this.optionControlArray.push(this.optionControlGroup());
        this.showHideValidation();
        this.validations.push('min');
        this.validations.push('max');

        break;
      case 'text':
      case 'textArea':
        this.validations.push('minLength');
        this.validations.push('maxLength');
        break;
      case 'number':
        this.validations.push('min');
        this.validations.push('max');
        break;
    }
  }

  onValidatoinSelect(event: any) {
    let valid = event.value;
    this.isMaxLength = valid.includes('maxLength') ? true : false;
    this.isMinLength = valid.includes('minLength') ? true : false;
    this.isMax = valid.includes('max') ? true : false;
    this.isMin = valid.includes('min') ? true : false;
    valid.includes('required')
      ? this.dynamicForm.patchValue({
          isRequired: true,
        })
      : this.dynamicForm.patchValue({
          isRequired: false,
        });
    this.checkValidationValue();
  }

  checkValidationValue() {
    if (!this.isMax) this.setControlValue('max');
    if (!this.isMin) this.setControlValue('min');
    if (!this.isMaxLength) this.setControlValue('maxLength');
    if (!this.isMinLength) this.setControlValue('minLenght');
  }

  setControlValue(control: any) {
    this.dynamicForm.get(control)?.setValue(null);
    this.dynamicForm.get(control)?.setValidators([]);
    this.dynamicForm.get(control)?.updateValueAndValidity();
  }

  addOptions() {
    if (this.optionControlArray.valid) {
      this.optionControlArray.push(this.optionControlGroup());
    }
  }

  removeOption(index: number) {
    this.optionControlArray.removeAt(index);
  }

  editQuestion(data: any) {
    this.validations = data.validations ? data.validations : [];
    this.onTypeSelect({ value: data.type });
    this.onValidatoinSelect({ value: data.validations });
    this.optionControlArray.clear();
    this.optionControlType = data.type;
    data.optionControl.forEach((element: any) => {
      this.optionControlArray.push(this.optionControlGroup());
    });
    this.dynamicForm.patchValue(data);
  }

  addToLocalStorage() {
    const form = {
      formId: this.id,
      formName: this.formName,
      questions: this.questions,
    };
    let formData = this.formService.getItem('Forms');
    const index = formData.findIndex((form: any) => form.formId === this.id);
    if (index >= 0) {
      formData[index] = form;
    } else {
      formData.push(form);
    }
    this.formService.setItem('Forms', formData);
  }

  showHideValidation() {
    this.isMin = false;
    this.isMinLength = false;
    this.isMax = false;
    this.isMaxLength = false;
  }
}
