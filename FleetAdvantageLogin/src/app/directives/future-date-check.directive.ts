import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { NG_VALIDATORS, ValidationErrors, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[futureDateCheck]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: FutureDateCheckValidator, multi: true }]
})

// FutureDateCheck ensures that we check for proper date format and if the date is in the futre
export class FutureDateCheckValidator implements Validator, OnInit {

  private futureError: string;
  private formatError: string;
  private control: FormControl;
  private FormatRegex: RegExp;

  constructor() {}

  public ngOnInit() {
    this.FormatRegex = new RegExp(/^(((0)[0-9])|((1)[0-2]))(\/)([0-2][0-9]|(3)[0-1])(\/)\d{4}$/i);
    this.futureError = 'Date cannot be in the future';
    this.formatError = 'Date is not in MM/DD/YYYY';
  }

  validate(c: FormControl): ValidationErrors | null {
    this.control = c;
    if (this.control.value && this.control.value !== '') {
      if (this.FormatRegex.test(this.control.value)){
        let today: Date = new Date();
        let dob: Date = new Date(this.control.value);
        if (dob > today){
          return {futureDateCheck : this.futureError};
        } else {
          return null;
        }
      } else {
        return {futureDateCheck : this.formatError}
      }

    } else {
      return null;
    }
  }
}
