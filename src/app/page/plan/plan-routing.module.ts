import {RouterModule, Routes} from '@angular/router';
import {PlanManagementComponent} from './plan-management.component';
import {PlanListComponent} from './plan-list/plan-list.component';
import {PlanFormComponent} from './plan-form/plan-form.component';
import {PlanPreviewComponent} from './plan-preview/plan-preview.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: 'plans',
    component: PlanManagementComponent,
    children: [
      {path: '', component: PlanListComponent},
      {path: 'edit/:id', component: PlanFormComponent},
      {path: 'add', component: PlanFormComponent},
      {path: 'preview/:id', component: PlanPreviewComponent}
    ]
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanRoutingModule {

}
