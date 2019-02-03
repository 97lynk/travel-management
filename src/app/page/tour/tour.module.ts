import {NgModule} from '@angular/core';

import {TourRoutingModule} from './tour-routing.module';
import {TourManagementComponent} from './tour-management.component';
import {ThemeModule} from '../../theme.module';
import {TourFormComponent} from './tour-form/tour-form.component';

const TOUR_COMPONENTS = [
  TourManagementComponent,
  TourFormComponent
];

@NgModule({
  imports: [ThemeModule, TourRoutingModule],
  declarations: [...TOUR_COMPONENTS]
})
export class TourModule {
}
