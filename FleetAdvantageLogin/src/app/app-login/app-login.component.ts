import { Component, OnInit, ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss']
})
export class AppLoginComponent implements OnInit {

  private _LoginVm: LoginVm;
  private readonly RequiredErrorMsg: string = 'This Field Is Required.';
  private readonly MaxErrorMsg: string = 'Character Count Cannot Exceed 56.';
  private readonly DOBErrorMsg: string = 'Date Cannot Be later than today';

  @ViewChild("LoginForm")
  private _LoginForm: NgForm;

  constructor() {
    this._LoginVm = new LoginVm();
   }

  ngOnInit() {
  }

  private ValidateForm():void {
    if (this._LoginForm.valid){
      alert('Login Form Is Valid');
    } else {
      for (let index in this._LoginForm.controls){
          this._LoginForm.controls[index].markAsTouched();
      }
    //   for (let i in this._LoginForm.controls) {
    //     this._LoginForm.get(i).markAsTouched();
    // }
    }
  }
}

// LoginVm used to bind form
export class LoginVm {
  constructor() {
    this.FirstName = '';
    this.LastName = '';
  }

  public FirstName: string;
  public LastName: string;
  public Birthday: Date;
}
