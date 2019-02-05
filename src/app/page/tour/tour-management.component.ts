import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'travel-tour-management',
  template: `
    <p>Tour management</p>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./tour-management.component.scss']
})
export class TourManagementComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
