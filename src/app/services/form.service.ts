import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

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
}
