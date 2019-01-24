import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NbDialogService, NbSidebarService, NbWindowService} from '@nebular/theme';
import {NbAuthOAuth2JWTToken, NbAuthService} from '@nebular/auth';
import {LoginComponent} from '../../page/login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  items = [{title: 'Profile'}, {title: 'Log out'}];

  account = {
    username: 'full-stack developer',
    fullname: 'Nikita Poltoratsky'
  };

  // @ViewChild('templateLoginDialog') templateLoginDialog: TemplateRef<any>;

  constructor(private sidebarService: NbSidebarService,
              private authService: NbAuthService,
              private dialogService: NbDialogService) {
  }

  ngOnInit() {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthOAuth2JWTToken) => {
        if (token.isValid()) {
          const account = token.getPayload()['account'];
          this.account = {
            fullname: account.fullName,
            username: account.userName
          };
        }
      });
  }

  toggle() {
    this.sidebarService.toggle(true, 'menu');
    return false;
  }

  login(dialog: TemplateRef<any>){
    this.dialogService.open(dialog, {
      hasBackdrop: true
    })
  }
}
