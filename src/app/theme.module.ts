import {
  NbAccordionModule,
  NbActionsModule,
  NbAlertModule, NbButtonModule,
  NbCalendarKitModule, NbCalendarModule, NbCalendarRangeModule,
  NbCardModule,
  NbChatModule, NbCheckboxModule, NbContextMenuModule, NbDatepickerModule, NbDialogModule, NbInputModule,
  NbLayoutModule, NbListModule, NbMenuModule, NbPopoverModule, NbProgressBarModule, NbRadioModule,
  NbRouteTabsetModule, NbSearchModule, NbSelectModule, NbSidebarModule, NbSpinnerModule, NbStepperModule,
  NbTabsetModule, NbThemeModule, NbToastrModule,
  NbTooltipModule, NbUserModule, NbWindowModule
} from '@nebular/theme';

import {NbSecurityModule} from '@nebular/security';

import {CORPORATE_THEME} from '@nebular/theme/services/js-themes/corporate.theme';
import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HeaderComponent} from './layout/header/header.component';
import {FooterComponent} from './layout/footer/footer.component';
import {HomeComponent} from './page/home/home.component';
import {LoginComponent} from './page/login/login.component';
import {PlanManagementComponent} from './page/plan/plan-management.component';
import {PlanListComponent} from './page/plan/plan-list/plan-list.component';
import {PlanFormComponent} from './page/plan/plan-form/plan-form.component';
import {PlanPreviewComponent} from './page/plan/plan-preview/plan-preview.component';
import {ConfirmDialogComponent} from './layout/dialog/confirm-dialog.component';
import {VTextEncodePipe} from './data/pipe/vtext-encode.pipe';
import {VDateTimePipe} from './data/pipe/vdate-time.pipe';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

const NB_MODULES = [
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NbSecurityModule, // *nbIsGranted directive,
  NbProgressBarModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbStepperModule,
  NbButtonModule,
  NbListModule,
  NbToastrModule,
  NbInputModule,
  NbAccordionModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbAlertModule,
  NbSpinnerModule,
  NbRadioModule,
  NbSelectModule,
  NbChatModule,
  NbTooltipModule,
  NbCalendarKitModule,
];

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  HomeComponent,
  LoginComponent,

  PlanManagementComponent,
  PlanListComponent,
  PlanFormComponent,

  PlanPreviewComponent,
  ConfirmDialogComponent
];

const ENTRY_COMPONENTS = [
  ConfirmDialogComponent,
];

const PIPES = [
  VTextEncodePipe,
  VDateTimePipe,
];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
      {
        name: 'corporate',
      },
      [ CORPORATE_THEME ],
  ).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
  ...NbDatepickerModule.forRoot().providers,
  ...NbDialogModule.forRoot().providers,
  ...NbWindowModule.forRoot().providers,
  ...NbToastrModule.forRoot().providers,
  // ...NbChatModule.forRoot({
  //   messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
  // }).providers,
];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [...ENTRY_COMPONENTS],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [...NB_THEME_PROVIDERS],
    };
  }
}