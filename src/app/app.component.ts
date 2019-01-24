import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NbMenuItem} from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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
