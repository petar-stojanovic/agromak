import {InjectionToken} from "@angular/core";

export const ERROR_MESSAGES: { [key: string]: (args?: any) => string } = {
  required: () => `This field is required`,
  email: () => `Please enter a valid email address`,
  minlength: ({requiredLength}) => `This field must be at least ${requiredLength} characters`,
  maxlength: ({requiredLength}) => `This field must be less than ${requiredLength} characters`,
  pattern: () => `Wrong format`
}

export const VALIDATION_ERROR_MESSAGES = new InjectionToken('Validation Messages', {
  providedIn: 'root',
  factory: () => ERROR_MESSAGES
});
