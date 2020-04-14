import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../_services/user.service'
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service'
import { User } from '../_models/user';
import { MustMatch } from '../_validators/must-match.validator';

@Component({
  selector: 'app-/resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetpasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  user: User;
  currentUser: User;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService) {
   
    // Obtain Local Storage (currentUser)  
    this.currentUser = JSON.parse( localStorage.getItem('currentUser'));

  }

  ngOnInit() {
    this.resetpasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: MustMatch('password', 'confirmpassword')
    }
    );

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.resetpasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.resetpasswordForm.invalid) {
      return;
    }

    this.loading = true;

    var updateUserRequest = {
      "password": this.f.password.value
    }

    this.userService.updateUser(this.currentUser._id, updateUserRequest)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Your Password changes have been saved. Please login', true);
          this.authenticationService.logout();
          this.router.navigate(['./login']);
          this.loading = false;

        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

  }


}
