import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageComponent} from './page.component';

const routes: Routes = [{
  path: '',
  component: PageComponent,
  children: [
    {path: 'plans', loadChildren: './plan/plan.module#PlanModule'},
    {path: 'tours', loadChildren: './tour/tour.module#TourModule'},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule {
}
