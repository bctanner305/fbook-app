import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
import { FriendsComponent } from './friends/friends.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { SettingComponent } from './setting/setting.component';
import { ProfileSettingComponent } from './profilesetting/profilesetting.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { NetworkComponent } from './network/network.component';
import { HomeComponent } from './home/home.component';
import { FbookcommonComponent } from './fbookcommon/fbookcommon.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertComponent } from './alert/alert.component'
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [ 
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    FriendsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SettingComponent,
    ProfileSettingComponent,
    ChangePasswordComponent,
    NetworkComponent,
    HomeComponent,
    FbookcommonComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    DatePipe

    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
