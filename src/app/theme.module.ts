import {
  NbAccordionModule,
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCalendarKitModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbChatModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbPopoverModule,
  NbProgressBarModule,
  NbRadioModule,
  NbRouteTabsetModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbStepperModule,
  NbTabsetModule,
  NbThemeModule,
  NbToastrModule,
  NbTooltipModule,
  NbUserModule,
  NbWindowModule
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
import {ConfirmDialogComponent} from './layout/dialog/confirm-dialog.component';
import {VTextEncodePipe} from './data/pipe/vtext-encode.pipe';
import {VDateTimePipe} from './data/pipe/vdate-time.pipe';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatStepperModule
} from '@angular/material';
import {NgxPaginationModule} from 'ngx-pagination';
import {TourListComponent} from './page/tour/tour-list/tour-list.component';
// import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {CKEditorModule} from 'ngx-ckeditor';

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
  NbCalendarKitModule
];

const MAT_MODULES = [
  MatChipsModule,
  MatInputModule,
  MatFormFieldModule,
  MatStepperModule,
  MatIconModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatMenuModule
];

const OTHER_MODULES = [NgxPaginationModule, CKEditorModule];

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  HomeComponent,
  LoginComponent,

  TourListComponent,
  ConfirmDialogComponent
];

const ENTRY_COMPONENTS = [
  ConfirmDialogComponent
];

const PIPES = [
  VTextEncodePipe,
  VDateTimePipe
];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
      {name: 'corporate'},
      [CORPORATE_THEME]
  ).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
  ...NbDatepickerModule.forRoot().providers,
  ...NbDialogModule.forRoot().providers,
  ...NbWindowModule.forRoot().providers,
  ...NbToastrModule.forRoot().providers
  // ...NbChatModule.forRoot({
  //   messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
  // }).providers,
];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES, ...MAT_MODULES, ...OTHER_MODULES],
  exports: [...BASE_MODULES, ...NB_MODULES, ...MAT_MODULES, ...OTHER_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [...ENTRY_COMPONENTS]
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [...NB_THEME_PROVIDERS]
    };
  }
}