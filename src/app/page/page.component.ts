import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'travel-page',
  template: `
    <p>Page component</p>
    <div>
      <a routerLink="plans">Plan Management</a> | 
      <a routerLink="tours">Tour Management</a> 
    </div>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
