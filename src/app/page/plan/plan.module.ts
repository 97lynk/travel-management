import {NgModule} from '@angular/core';
import {PlanRoutingModule} from './plan-routing.module';
import {PlanManagementComponent} from './plan-management.component';
import {PlanListComponent} from './plan-list/plan-list.component';
import {PlanFormComponent} from './plan-form/plan-form.component';
import {PlanPreviewComponent} from './plan-preview/plan-preview.component';
import {ThemeModule} from '../../theme.module';

const PLANS_COMPONENTS = [
  PlanManagementComponent,
  PlanListComponent,
  PlanFormComponent,
  PlanPreviewComponent
];

@NgModule({
  imports: [ThemeModule, PlanRoutingModule],
  declarations: [...PLANS_COMPONENTS]
})
export class PlanModule {
}