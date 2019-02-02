import {RouterModule, Routes} from '@angular/router';
import {PlanManagementComponent} from './plan-management.component';
import {PlanFormComponent} from './plan-form/plan-form.component';
import {PlanPreviewComponent} from './plan-preview/plan-preview.component';
import {NgModule} from '@angular/core';
import {PlanListComponent} from './plan-list/plan-list.component';

const routes: Routes = [
  {
    path: '',
    component: PlanManagementComponent,
    children: [
      {path: '', component: PlanListComponent},
      {path: 'edit/:id', component: PlanFormComponent},
      {path: 'add', component: PlanFormComponent},
      {path: 'preview/:id', component: PlanPreviewComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanRoutingModule {

}
