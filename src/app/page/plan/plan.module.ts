import {PlanManagementComponent} from './plan-management.component';
import {ThemeModule} from '../../theme.module';
import {NgModule} from '@angular/core';
import {PlanRoutingModule} from './plan-routing.module';

const PLANS_COMPONENTS = [
  PlanManagementComponent
];

@NgModule({
  imports: [
    ThemeModule,
    PlanRoutingModule
  ],
  declarations: [
    ...PLANS_COMPONENTS,
  ],
})
export class PlanModule {

}