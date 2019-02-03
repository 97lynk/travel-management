import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TourManagementComponent} from './tour-management.component';
import {TourListComponent} from './tour-list/tour-list.component';
import {TourFormComponent} from './tour-form/tour-form.component';

const routes: Routes = [{
  path: '', component: TourManagementComponent,
  children: [
    {path: '', component: TourListComponent},
    {path: 'edit/:id', component: TourFormComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourRoutingModule {
}
