import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
import { FriendsComponent } from './friends/friends.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { SettingComponent } from './setting/setting.component';
import { ProfileSettingComponent } from './profilesetting/profilesetting.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { NetworkComponent } from './network/network.component';
import { HomeComponent } from './home/home.component'
import { AuthGuard } from './_helpers/auth.guard'
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home',component: HomeComponent, canActivate: [AuthGuard]  },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'setting', component: SettingComponent, canActivate: [AuthGuard], children : 
  [{ path: 'profilesetting', component: ProfileSettingComponent, canActivate: [AuthGuard] },
  { path: 'changepassword', component: ChangePasswordComponent, canActivate: [AuthGuard] }] },
  { path: 'network', component: NetworkComponent, canActivate: [AuthGuard] },
  { path: 'friends', component: FriendsComponent, canActivate: [AuthGuard] },
  { path: 'forgotpassword', component: ForgotPasswordComponent},
  { path: 'resetpassword', component: ResetPasswordComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
