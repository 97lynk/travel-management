import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NbMenuItem} from '@nebular/theme';

@Component({
  selector: 'app-root',
  template: `
      <nb-layout windowMode>
          <!--HEADER-->
          <nb-layout-header fixed>
              <app-header></app-header>
          </nb-layout-header>

          <!--SIDEBAR-->
          <nb-sidebar tag="menu">
              <nb-menu [items]="MENU_ITEMS" autoCollapse="false">
              </nb-menu>
          </nb-sidebar>

          <!--MAIN PANEL-->
          <nb-layout-column>
              <router-outlet></router-outlet>
          </nb-layout-column>

          <!--FOOTER-->
          <!--<nb-layout-footer fixed>-->
          <!--<app-footer></app-footer>-->
          <!--</nb-layout-footer>-->
      </nb-layout>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  MENU_ITEMS: NbMenuItem[] = [
    {
      title: 'E-commerce',
      icon: 'nb-e-commerce',
      link: '/pages/dashboard',
      home: true,
    },
    {
      title: 'IoT Dashboard',
      icon: 'nb-home',
      link: '/pages/iot-dashboard',
    },
    {
      title: 'FEATURES',
      group: true,
    },
    {
      title: 'Quản lý',
      icon: 'nb-compose',
      expanded: true,
      children: [
        {
          title: 'Plans',
          link: '/management/plans',
        },
        {
          title: 'Tour',
          link: '',
        },
      ],
    },
    {
      title: 'Tài khoản',
      icon: 'nb-person',
      expanded: true,
      children: [
        {
          title: 'Đăng nhập',
          link: '/auth/login',
        },
        {
          title: 'Đăng kí',
          link: '/auth/register',
        },
        {
          title: 'Request Password',
          link: '/auth/request-password',
        },
        {
          title: 'Reset Password',
          link: '/auth/reset-password',
        },
      ],
    },
  ];


}
