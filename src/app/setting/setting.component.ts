import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import {UserService} from '../_services/user.service'
import {  AuthenticationService } from '../_services/authentication.service';
import {AlertService} from '../_services/alert.service'

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  settingForm: FormGroup;
  loading = false;
  submitted = false;
  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private route: ActivatedRoute) {

     }

  ngOnInit() {
    this.settingForm = this.formBuilder.group({
  });

  // Proceed initially to the "Profile Settings" Tab
  this.router.navigate(["./profilesetting"], {relativeTo: this.route});
  }

  get f() { return this.settingForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.settingForm.invalid) {
      return;
  }

  this.loading = true;

}

  


}
