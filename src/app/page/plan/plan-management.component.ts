import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-plan-management',
  template: `
    <!--<p>-->
      <!--plan works!-->
    <!--</p>-->
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
