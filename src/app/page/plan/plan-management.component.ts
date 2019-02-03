import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'travel-plan-management',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./plan-management.component.scss']
})
export class PlanManagementComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
