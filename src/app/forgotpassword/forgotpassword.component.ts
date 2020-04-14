import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../_services/user.service'
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service'
import { User } from '../_models/user';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-/forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotpasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  user: User;
  fetcheduser: User;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.forgotpasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      dob: ['', [Validators.required]]
    });

  }

  get f() { return this.forgotpasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.forgotpasswordForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.finduserbyemail(this.f.email.value)
      .then(() => {
        this.fetcheduser = this.authenticationService.founduser;
        this.loading = false;
        if (!this.fetcheduser) {
          this.alertService.error("Sorry, cannot find this Email address. Please try again!");
        } else
          if (!this.fetcheduser.isActive) {
            this.alertService.error("Sorry, this Email Address is no longer Active. Please try again!");
          } else
          if (this.datePipe.transform(this.f.dob.value, 'dd/MM/yyyy') != this.datePipe.transform(this.fetcheduser.dob, 'dd/MM/yyyy')) {
            this.alertService.error("Sorry, the Date of Birth does NOT match the Date of Birth on record. Please try again!");
          } else {
            // Validation passed....have the user Reset their Password.	
            localStorage.setItem('currentUser', JSON.stringify(this.fetcheduser));
            this.authenticationService.currentUserSubject.next(this.fetcheduser);
            this.router.navigate(['./resetpassword']);
          }
      });
  }

}
