import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable, of} from 'rxjs';
import {TourService} from '../../../data/service/tour.service';
import {map, tap} from 'rxjs/operators';
import {PaginationInstance} from 'ngx-pagination';
import {Tour} from '../../../data/model/api/tour';
import {NbDialogService} from '@nebular/theme';
import {ConfirmDialogComponent} from '../../../layout/dialog/confirm-dialog.component';
import {Logger} from '../../../data/util/logger';
import {Router} from '@angular/router';

@Component({
  selector: 'travel-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit {

  // list tours
  tours: Observable<Tour[]>;
  // current page info
  pagerConfig: PaginationInstance;
  // loading flag
  loading: boolean;

  @Input() showMenu: boolean = true;
  @Output() clickTour = new EventEmitter<Tour>();

  constructor(private tourService: TourService,
              private dialogService: NbDialogService,
              private router: Router) {
    this.pagerConfig = {id: 'tour-pager', itemsPerPage: 10, currentPage: 1, totalItems: 0};
  }

  ngOnInit() {
    this.tours = this.loadTour(0);
  }

  loadTour(page: number) {
    this.loading = true;
    this.tours = of([]);
    return this.tourService.getTours(page, 10)
        .pipe(tap((tours: Tour) => {
          this.pagerConfig.itemsPerPage = tours.page.size;
          this.pagerConfig.currentPage = tours.page.number + 1;
          this.pagerConfig.totalItems = tours.page.totalElements;
          this.loading = false;
        }), map((tours: Tour) => tours.content));
  };

  clickPreview(tour: Tour) {

  };

  clickEdit(tour: Tour) {
    this.router.navigate(['/management/tours', 'edit', tour.id]);
  };

  clickDelete(tour: Tour) {
    const dialog = this.dialogService.open(ConfirmDialogComponent);
    dialog.componentRef.instance.config = {
      title: 'Xóa tour',
      message: `Xóa Tour#${tour.id}?`,
      leftButton: {status: 'secondary', label: 'Hủy', return: false},
      rightButton: {status: 'danger', label: 'Xóa', return: true}
    };
    Logger.info('Open dialog:\n %o', dialog.componentRef.instance.config);
    dialog.onClose.subscribe(value => {
      Logger.info('Close dialog:\n %o', value);
    });
  };
}
