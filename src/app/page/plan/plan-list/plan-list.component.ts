import {Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, take, tap} from 'rxjs/operators';
import {
  NB_WINDOW,
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbLayoutScrollService,
  NbListItemComponent,
  NbToastrService
} from '@nebular/theme';
import {getElementHeight} from '@nebular/theme/components/helpers';
import {TourService} from '../../../data/service/tour.service';
import {Plan} from '../../../data/model/api/plan';
import {Page} from '../../../data/model/extra/page';
import {ConfirmDialogComponent} from '../../../layout/dialog/confirm-dialog.component';
import {Logger} from '../../../data/util/logger';

const TOASTR_CONFIG = {
  destroyByClick: true,
  hasIcon: true,
  position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
  duration: 3500
};

@Component({
  selector: 'travel-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit, OnDestroy {

  // list plans
  plans: Plan[];
  // list place holder show when loading
  placeholders: any[];

  // current page infomation
  page: Page;

  startPage: number;

  // pointer
  pageToLoadNext: number;
  pageToLoadPrev: number;

  // flag
  loadingNext: boolean;
  loadingPrevious: boolean;

  // flag load complate page
  completePage: boolean[];

  loadError: boolean;

  initialScrollRestoration: ScrollRestoration;

  @ViewChildren(NbListItemComponent, {read: ElementRef}) listItems: QueryList<ElementRef<Element>>;

  constructor(
      private tourService: TourService,
      private router: Router,
      private route: ActivatedRoute,
      private scrollService: NbLayoutScrollService,
      private dialogService: NbDialogService,
      private toastrService: NbToastrService,
      @Inject(PLATFORM_ID) private platformId,
      @Inject(NB_WINDOW) private window
  ) {

    this.plans = [];
    this.placeholders = [];

    this.page = {size: 10, totalElements: 209, totalPages: 3, number: 0};

    this.startPage = 1;

    this.pageToLoadNext = this.startPage - 1;
    this.pageToLoadPrev = this.pageToLoadNext - 1;

    this.loadingNext = false;
    this.loadingPrevious = false;

    this.completePage = new Array(this.page.totalPages);
    this.completePage.fill(false);

    this.loadError = false;


    if (isPlatformBrowser(this.platformId) && this.window.history.scrollRestoration) {
      // Prevent browsers from scrolling down to last scroll position, when navigating back to this page.
      // It doesn't make sense here, since list is dynamic and we handle last user position ourselves,
      // by storing page number in URL. So for this component, we disable scroll restoration.
      // Don't forget to re-enable it in 'OnDestroy', since this configuration preserved for the whole session
      // and it will not be reset after page reload.
      this.initialScrollRestoration = window.history.scrollRestoration;
      history.scrollRestoration = 'manual';
    }
  }

  ngOnInit() {
    this.initIndex();
    this.route.url.subscribe(value => {
      this.loadPrevious();
      this.loadNext();
    });

  }

  ngOnDestroy() {
    if (this.initialScrollRestoration) {
      this.window.history.scrollRestoration = this.initialScrollRestoration;
    }
  }

  /**
   * init startpage, pageToLoadNext and pageToLoadPrev
   */
  initIndex = () => {
    const {page} = this.route.snapshot.queryParams;
    this.startPage = page ? Number.parseInt(page, 10) : 1;
    this.pageToLoadNext = this.startPage - 1;
    this.pageToLoadPrev = this.pageToLoadNext - 1;
  };

  /**
   * show dialog confirm delete plan
   * @param {TemplateRef<any>} dialog
   * @param {number} planId
   */
  confirmDeletePlan = (planId: number) => {
    const dialog = this.dialogService.open(ConfirmDialogComponent);
    dialog.componentRef.instance.config = {
      title: 'Xóa plan', message: `Bạn có muốn xóa Plan#${planId}?`,
      leftButton: {status: 'primary', label: 'Hủy', return: false},
      rightButton: {status: 'danger', label: 'Xóa', return: true}
    };
    Logger.info('Open dialog:\n %o', dialog.componentRef.instance.config);
    dialog.onClose.subscribe(value => {
      Logger.info('Close dialog:\n %o', value);
      if (!value) return;
      this.tourService.deletePlanById(planId).pipe(
          tap((plan: Plan) => {
            // reload data in page
            this.plans = [];
            this.completePage = [];
            this.initIndex();
            this.loadPrevious();
            this.loadNext();
          }))
          .subscribe((plan: Plan) => {
            this.toastrService.success(`Plan#${plan.id} đã được xóa thành công!`, 'Xóa plan', TOASTR_CONFIG);
          }, error => {
            this.toastrService.warning(`Plan#${planId} chưa được xóa`, 'Xóa plan', TOASTR_CONFIG);
          });
    });
  };

  /**
   * change page parameter in url
   * @param {number} page
   * @param {string} from
   */
  updateUrl = (page: number, from = 'code') => {
    this.router.navigate(['.'], {
      queryParams: {page},
      replaceUrl: true,
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  };

  /**
   * load previous page if this page isn't the first page
   */
  loadPrevious = () => {
    if (this.loadingPrevious || this.pageToLoadPrev < 0 || this.completePage[this.pageToLoadPrev]) return;

    // set flag prevent multiple request in the same page
    this.completePage[this.pageToLoadPrev] = true;
    // set flag prevent multiple loading previous pages
    this.loadingPrevious = true;
    // flag error loading
    this.loadError = false;

    this.tourService.getPlans(this.pageToLoadPrev, this.page.size, ['tour'])
        .pipe(tap((plans: Plan) => {
          // update page
          this.page = plans.page;
          this.refreshCompletePage(plans.page);
        }))
        .subscribe((plans: Plan) => {
          // push data to head array
          this.plans.unshift(...plans.content);
          // scroll to the first element of the start page
          this._restoreScrollPosition();

          this.pageToLoadPrev--;
          if (this.startPage != 1) this.startPage--;

          this.loadingPrevious = false;
          this.loadError = false;
        }, error => {
          this.loadingPrevious = false;
          this.loadError = true;
        });
  };

  /**
   * load next page if this page isn't the last page
   */
  loadNext = () => {
    if (this.loadingNext || this.pageToLoadNext >= this.page.totalPages || this.completePage[this.pageToLoadNext]) return;

    // set flag prevent multiple request in the same page
    this.completePage[this.pageToLoadNext] = true;
    // set flag prevent multiple loading next pages
    this.loadingNext = true;
    // flag error loading
    this.loadError = false;

    // make place holder items
    this.placeholders = new Array(this.page.size);
    this.tourService.getPlans(this.pageToLoadNext, this.page.size, ['tour'])
        .pipe(tap((plans: Plan) => {
          // update page
          this.page = plans.page;
          this.refreshCompletePage(plans.page);
        }))
        .subscribe((plans: Plan) => {
          // push data to tail array
          this.plans.push(...plans.content);

          this.pageToLoadNext++;
          this.placeholders = [];

          this.loadingNext = false;
          this.loadError = false;
        }, error => {
          this.placeholders = [];
          this.loadingNext = false;
          this.loadError = true;
        });
  };

  /**
   * refresh completePage
   */
  refreshCompletePage = (page: Page) => {
    if (this.completePage.length < this.page.totalPages) {
      const tempArray = new Array(this.page.totalPages - this.completePage.length);
      tempArray.fill(false);
      this.completePage.push(...tempArray);
    } else {
      this.completePage = this.completePage.slice(0, this.page.totalPages);
    }
  };

  /**
   * restore element previous
   */
  private _restoreScrollPosition = () => {
    const previousFirstItem = this.listItems.length > 0 ? this.listItems.first.nativeElement : null;

    this.listItems.changes
        .pipe(
            map(() => this.listItems.first.nativeElement),
            filter(newFirstItem => newFirstItem !== previousFirstItem),
            take(1),
        )
        .subscribe(() => {
          let heightOfAddedItems = 0;
          for (const {nativeElement} of this.listItems.toArray()) {
            if (nativeElement === previousFirstItem) {
              break;
            }
            heightOfAddedItems += getElementHeight(nativeElement);
          }
          this.scrollService.scrollTo(null, heightOfAddedItems + 50);
        });
  };

}
