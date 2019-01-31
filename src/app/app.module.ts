import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NbSidebarService} from '@nebular/theme';
import {NbTokenLocalStorage, NbTokenStorage} from '@nebular/auth';
import {HttpClientModule} from '@angular/common/http';
import {APP_BASE_HREF, registerLocaleData} from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import {ThemeModule} from './theme.module';
import {CoreModule} from './core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,


    ThemeModule.forRoot(),
    CoreModule.forRoot()
  ],
  providers: [
    {provide: NbTokenStorage, useClass: NbTokenLocalStorage},
    {provide: LOCALE_ID, useValue: 'vi'},
    { provide: APP_BASE_HREF, useValue: '/' },
    // {provide: OverlayContainer, useClass: FullscreenOverlayContainer}

  ],
  bootstrap: [AppComponent],
})
export class AppModule {

  constructor() {
    registerLocaleData(localeVi, 'vi');
  }
}
