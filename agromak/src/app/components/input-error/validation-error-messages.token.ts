import {InjectionToken} from "@angular/core";

export const ERROR_MESSAGES: { [key: string]: string } = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minlength: 'This field must be at least 8 characters',
  maxlength: 'This field must be less than 25 characters',
  pattern: 'Wrong format',
}

export const VALIDATION_ERROR_MESSAGES = new InjectionToken('Validation Messages', {
  providedIn: 'root',
  factory: () => ERROR_MESSAGES
});
