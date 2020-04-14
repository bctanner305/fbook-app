import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service'
import { AlertService } from '../_services/alert.service'

@Component({
  selector: 'app-/profilesetting',
  templateUrl: './profilesetting.component.html',
  styleUrls: ['./profilesetting.component.css']
})
export class ProfileSettingComponent implements OnInit {
  currentUser: User;
  profilesettingForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService) {

    // Obtain Local Storage (currentUser)  
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

  }

  ngOnInit() {
    this.profilesettingForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
    });

  }

  get f() { return this.profilesettingForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.profilesettingForm.invalid) {
      return;
    }

    // Clear the Alert Message.
    this.alertService.clear();

    this.loading = true;

    this.userService.updateUser(this.currentUser._id, this.profilesettingForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Your changes have been saved. ', true);
          this.loading = false;
          //this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
