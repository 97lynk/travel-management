import {Component, OnInit} from '@angular/core';
import {Plan} from '../../../data/model/api/plan';
import {TourService} from '../../../data/service/tour.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-plan-preview',
  templateUrl: './plan-preview.component.html',
  styleUrls: ['./plan-preview.component.scss']
})
export class PlanPreviewComponent implements OnInit {

  plan: Plan;

  content: string;

  constructor(private tourService: TourService,
              private route: ActivatedRoute,
              private router: Router) {
    this.plan = new Plan();
    this.content = '';
  }

  ngOnInit() {
    // get plan id from url
    const {id} = this.route.snapshot.params;
    const planId = Number(id);
    if (Number.isNaN(planId)) this.router.navigate(['/management/plans']);
    else {
      this.tourService.getPlanById(planId, ['tour', 'places']).subscribe((plan: Plan) => {
        this.plan = plan;
        this.tourService.loadContentPostOfTour(plan.tour.fileContentUrl).subscribe(html => this.content = html);
      });
    }

  }

}
