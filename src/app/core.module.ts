import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NbAuthModule,
  NbAuthOAuth2JWTToken,
  NbOAuth2AuthStrategy,
  NbOAuth2ClientAuthMethod,
  NbOAuth2GrantType
} from '@nebular/auth';
import {throwIfAlreadyLoaded} from './module-import-guard';
import {environment} from '../environments/environment';
import {NbSidebarService} from '@nebular/theme';


export const NB_CORE_PROVIDERS = [
  ...NbAuthModule.forRoot({
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
    }
  }).providers,
  // {
  //   provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  // },
  NbSidebarService
];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule],
  declarations: []

})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}