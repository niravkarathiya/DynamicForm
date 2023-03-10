import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private _snackBar: MatSnackBar) {}

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string) {
    const data = localStorage.getItem(key);
    const item = data ? JSON.parse(data) : [];
    return item;
  }

  getItemById(formId: string, key: string) {
    const data = localStorage.getItem(key);
    const item: any[] = data ? JSON.parse(data) : [];
    return item.find((res: any) => res.formId === formId);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 2000,
    });
  }
}
