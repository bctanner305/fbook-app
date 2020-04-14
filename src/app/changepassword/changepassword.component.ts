import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';

import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../_validators/must-match.validator';

@Component({
  selector: 'app-/changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangePasswordComponent implements OnInit {
  currentUser: User;
  changepasswordForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
     private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService) {
      
  }

  ngOnInit() {
    this.changepasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: MustMatch('password', 'confirmpassword')
    }
    );
	
    // Obtain Local Storage (currentUser)  
    this.currentUser = JSON.parse( localStorage.getItem('currentUser'));

  }

  get f() { return this.changepasswordForm.controls; }

  onSubmit() {
    var currentUser;
    this.submitted = true;
    this.alertService.clear();
    if (this.changepasswordForm.invalid) {
      return;
    }

    this.loading = true;

    var updateUserRequest = {
      "password": this.f.password.value
    }

	// Call the userService to update the User (currentUser) with it's 
	// new password.
    this.userService.updateUser(this.currentUser._id, updateUserRequest)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Your changes have been saved. ', true);
		  this.loading = false;

        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}




