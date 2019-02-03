import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './page/home/home.component';
import {NbAuthComponent, NbLogoutComponent, NbRegisterComponent, NbRequestPasswordComponent, NbResetPasswordComponent} from '@nebular/auth';
import {LoginComponent} from './page/login/login.component';

const routes: Routes = [
  {path: 'management', loadChildren: './page/page.module#PageModule'},
  {path: 'home', component: HomeComponent},
  {
    path: 'auth', component: NbAuthComponent,
    children: [
      {path: '', component: LoginComponent},
      {path: 'login', component: LoginComponent},
      {path: 'register', component: NbRegisterComponent},
      {path: 'logout', component: NbLogoutComponent},
      {path: 'request-password', component: NbRequestPasswordComponent},
      {path: 'reset-password', component: NbResetPasswordComponent},
    ]
  },
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: ''}
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
