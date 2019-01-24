import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './page/home/home.component';
import {NbAuthComponent, NbLogoutComponent, NbRegisterComponent, NbRequestPasswordComponent, NbResetPasswordComponent} from '@nebular/auth';
import {LoginComponent} from './page/login/login.component';
import {PlanListComponent} from './page/plan/plan-list/plan-list.component';
import {PlanFormComponent} from './page/plan/plan-form/plan-form.component';
import {PlanManagementComponent} from './page/plan/plan-management.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'management/plans', component: PlanManagementComponent,
    children: [
      {path: '', component: PlanListComponent},
      {path: 'edit/:id', component: PlanFormComponent},
      {path: 'add', component: PlanFormComponent}
    ]
  },
  {
    path: 'auth', component: NbAuthComponent,
    children: [
      {path: '', component: LoginComponent},
      {path: 'login', component: LoginComponent},
      {path: 'register', component: NbRegisterComponent},
      {path: 'logout', component: NbLogoutComponent},
      {path: 'request-password', component: NbRequestPasswordComponent},
      {path: 'reset-password', component: NbResetPasswordComponent},
    ],
  },
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
