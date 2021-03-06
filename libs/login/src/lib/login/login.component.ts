import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from './login.service';

@Component({
  selector: 'vts-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private _authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<LoginComponent>
    ) { }


  ngOnInit(): void {
    this._authenticationService.signOutUser();
    // this.areYouStillLoggedIn();
    this.createForm();
  }
  private createForm() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public signInEmail() {
    this._authenticationService
      .signInUserEmail(
        this.form.controls['email'].value,
        this.form.controls['password'].value
      )
      .then(results => {
        if (results) {
          this.dialogRef.close();
        }
      });
  }

  public resetPassword() {
    this._authenticationService.resetPassword(
      this.form.controls['email'].value
    );
  }
}
