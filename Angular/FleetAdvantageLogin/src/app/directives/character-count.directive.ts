import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { NG_VALIDATORS, ValidationErrors, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[characterCount]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: CharacterCountValidator, multi: true }]
})

export class CharacterCountValidator implements Validator, OnInit {

  @Input()
  private characterCount: number;

  private control: FormControl;
  private error: string;


  constructor(public el: ElementRef) {

  }

  public ngOnInit() {
    this.error = 'This Field cannot exceed ' + this.characterCount + ' characters.';
  }

  // This method is the one required by the Validator interface
  validate(c: FormControl): ValidationErrors | null {
    this.control = c;
    if (this.control.value && this.control.value !== '' && this.control.value.length > this.characterCount) {
      return {characterCount : this.error};

    } else {
      return null;
    }

  }
}
