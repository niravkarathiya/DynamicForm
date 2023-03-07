export interface DynamicForm {
    formName: string;
    formId: number;
    questions: Questions[];
}

export interface Questions {
    question: string;
    questionId: number;
    type: string;
    name: string;
    label: string;
    isMultiSelect: boolean;
    selectionControl: Controls[];
    validation: Validations[];
}

export interface Validations {
    isRequired: boolean;
    min: number;
    max: number;
}

export interface Controls {
    label: string;
    value: boolean;
}

