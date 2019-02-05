import {Component, OnInit} from '@angular/core';
import {Plan} from '../../../data/model/api/plan';
import {TourService} from '../../../data/service/tour.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'travel-plan-preview',
  template: `
    <nb-card>
      <nb-card-header class="border-bottom">
        <div>Xem trước Plan#{{plan.d}}</div>
      </nb-card-header>
      <nb-card-body>
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <div class="row">
              <div><h2>{{ plan.name }}</h2>
                <div class="aspect" style="position: relative;">
                  <img class="img-fluid" [src]="(plan?.tour?.imageUrl == null) ? defaultImage: plan.tour.imageUrl">
                </div>
              </div>
              <div class="row text-center p-3 w-100"
                   style="position: absolute; bottom: 0; background: rgba(255, 255, 255, 0.9)">
                <div class="col border-only-right">
                  <h6 class="mb-0"> {{ plan?.tour?.numberOfDate}} ngày {{ plan?.tour?.numberOfNight }} đêm</h6>
                  <small>
                    <mat-icon inline="true">date_range</mat-icon>
                    Thời gian
                  </small>
                </div>
                <div class="col border-only-right">
                  <h6 class="mb-0"> {{ plan?.startTime | vdatetime }}</h6>
                  <small>
                    <mat-icon inline="true">flight_takeoff</mat-icon>
                    Khởi hành
                  </small>
                </div>
                <div class="col">
                  <h6 class="mb-0"> {{ plan?.adultPrice | number: '1.2-2' }} VNĐ</h6>
                  <small>
                    <mat-icon inline="true">attach_money</mat-icon>
                    Giá từ
                  </small>
                </div>
              </div>
            </div>

            <div class="row">
              <h2 class="font-main">Mô tả</h2>
              <pre>{{ plan.tour.description }}</pre>
            </div>

            <div class="row">
              <h2 class="font-main"> Lịch trình</h2>
              <div [innerHTML]="content"></div>
            </div>
          </div>
        </div>

      </nb-card-body>
    </nb-card>
  `,
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
