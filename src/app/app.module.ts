import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatStepperModule
} from '@angular/material';
import {
  NbAccordionModule,
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCalendarModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbSidebarModule,
  NbSidebarService,
  NbSpinnerModule,
  NbStepperModule,
  NbThemeModule,
  NbToastrModule,
  NbUserModule
} from '@nebular/theme';
import {HomeComponent} from './page/home/home.component';
import {HeaderComponent} from './layout/header/header.component';
import {FooterComponent} from './layout/footer/footer.component';
import {LoginComponent} from './page/login/login.component';
import {
  NbAuthModule,
  NbAuthOAuth2JWTToken,
  NbOAuth2AuthStrategy,
  NbOAuth2ClientAuthMethod,
  NbOAuth2GrantType,
  NbTokenLocalStorage,
  NbTokenStorage
} from '@nebular/auth';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PlanListComponent} from './page/plan/plan-list/plan-list.component';
import {PlanFormComponent} from './page/plan/plan-form/plan-form.component';
import {PlanManagementComponent} from './page/plan/plan-management.component';
import {VTextEncodePipe} from './data/pipe/vtext-encode.pipe';
import {VDateTimePipe} from './data/pipe/vdate-time.pipe';
import {registerLocaleData} from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import {PlanPreviewComponent} from './page/plan/plan-preview/plan-preview.component';
import {ConfirmDialogComponent} from './layout/dialog/confirm-dialog.component';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,

    PlanManagementComponent,
    PlanListComponent,
    PlanFormComponent,

    VTextEncodePipe,
    VDateTimePipe,
    PlanPreviewComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,//.withConfig({warnOnNgModelWithFormControl: 'never'}),
    BrowserAnimationsModule,
    HttpClientModule,
    NbLayoutModule,

    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatIconModule,
    MatAutocompleteModule,

    NgxPaginationModule,

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbCardModule,
    NbActionsModule,
    NbUserModule,
    NbContextMenuModule,
    NbAlertModule,
    NbCheckboxModule,
    NbInputModule,
    NbListModule,
    NbSpinnerModule,
    NbButtonModule,
    NbStepperModule,
    NbAccordionModule,
    NbCalendarModule,
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbToastrModule.forRoot(),
    NbAuthModule.forRoot({

      strategies: [
        // NbPasswordAuthStrategy.setup({
        //   name: 'userpass',
        //   baseEndpoint: 'http://localhost:8080',
        //   token:{
        //
        //   },
        //   login: {
        //     method: 'post',
        //     endpoint: '/oauth/token'
        //   }
        // }),
        NbOAuth2AuthStrategy.setup({
          name: 'userpass',
          baseEndpoint: environment.apiHost,
          clientId: 'clientIdPassword',
          clientSecret: '123',
          clientAuthMethod: NbOAuth2ClientAuthMethod.BASIC,
          token: {
            endpoint: '/oauth/token',
            grantType: NbOAuth2GrantType.PASSWORD,
            class: NbAuthOAuth2JWTToken,
            scope: '',
            requireValidToken: true,
          },
        })
      ],
      forms: {
        login: {
          redirectDelay: 0, // delay before redirect after a successful login, while success message is shown to the user
          strategy: 'userpass',  // strategy id key.
          rememberMe: true,   // whether to show or not the `rememberMe` checkbox
          showMessages: {     // show/not show success/error messages
            success: true,
            error: true,
          },
        },
      },
    }),
    NbThemeModule.forRoot({name: 'corporate'}),
  ],
  providers: [
    NbSidebarService,
    {provide: NbTokenStorage, useClass: NbTokenLocalStorage},
    {provide: LOCALE_ID, useValue: 'vi'},
    // {provide: OverlayContainer, useClass: FullscreenOverlayContainer}

  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent]
})
export class AppModule {

  constructor() {
    registerLocaleData(localeVi, 'vi');
  }
}
