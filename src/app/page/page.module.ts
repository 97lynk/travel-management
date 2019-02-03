import {NgModule} from '@angular/core';

import {PageRoutingModule} from './page-routing.module';
import {PageComponent} from './page.component';
import {ThemeModule} from '../theme.module';
import {TourListComponent} from './tour/tour-list/tour-list.component';

const PAGE_COMPONENTS = [
  PageComponent
];

@NgModule({
  imports: [ThemeModule, PageRoutingModule],
  exports: [ TourListComponent],
  declarations: [...PAGE_COMPONENTS]
})
export class PageModule {
}
