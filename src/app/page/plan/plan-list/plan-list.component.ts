import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, take} from 'rxjs/operators';
import {NB_WINDOW, NbLayoutScrollService, NbListItemComponent, NbWindowService} from '@nebular/theme';
import {getElementHeight} from '@nebular/theme/components/helpers';
import {TourService} from '../../../data/service/tour.service';
import {Plan} from '../../../data/model/api/plan';
import {Page} from '../../../data/model/extra/page';


@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit, OnDestroy {

  @HostBinding('attr.aria-label')

  plans: Plan[];
  placeholders: any[];

  page: Page;

  startPage: number;

  pageToLoadNext: number;
  pageToLoadPrev: number;

  loadingNext = false;
  loadingPrevious = false;

  completePage = [false, false, false];

  loadError: boolean;

  showStepper: boolean;

  initialScrollRestoration: ScrollRestoration;

  @ViewChildren(NbListItemComponent, {read: ElementRef}) listItems: QueryList<ElementRef<Element>>;

  constructor(
      private tourService: TourService,
      private router: Router,
      private route: ActivatedRoute,
      private scrollService: NbLayoutScrollService,
      @Inject(PLATFORM_ID) private platformId,
      @Inject(NB_WINDOW) private window
  ) {
    this.showStepper = false;

    this.plans = [];
    this.placeholders = [];

    this.page = {
      size: 10,
      totalElements: 209,
      totalPages: 3,
      number: 0
    };

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
    const {page} = this.route.snapshot.queryParams;
    this.startPage = page ? Number.parseInt(page, 10) : 1;
    this.pageToLoadNext = this.startPage - 1;
    this.pageToLoadPrev = this.pageToLoadNext - 1;

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

  updateUrl(page, from = 'code') {
    this.router.navigate(['.'], {
      queryParams: {page},
      replaceUrl: true,
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }

  loadPrevious() {
    if (this.loadingPrevious || this.pageToLoadPrev < 0 || this.completePage[this.pageToLoadPrev]) return;

    // set flag prevent multiple request in the same page
    this.completePage[this.pageToLoadPrev] = true;
    // set flag prevent multiple loading previous pages
    this.loadingPrevious = true;
    // flag error loading
    this.loadError = false;

    this.tourService.getPlans(this.pageToLoadPrev, this.page.size, ['tour'])
        .subscribe((plans: Plan) => {
          // update page
          this.page = plans.page;
          // push data to head array
          this.plans.unshift(...plans.content);
          // scroll to the first element of the start page
          this.restoreScrollPosition();

          this.pageToLoadPrev--;
          if (this.startPage != 1) this.startPage--;

          this.loadingPrevious = false;
          this.loadError = false;
        }, error => {
          this.loadingPrevious = false;
          this.loadError = true;
        });
  }

  loadNext() {
    if (this.loadingNext || this.pageToLoadNext >= 3 || this.completePage[this.pageToLoadNext]) return;

    // set flag prevent multiple request in the same page
    this.completePage[this.pageToLoadNext] = true;
    // set flag prevent multiple loading next pages
    this.loadingNext = true;
    // flag error loading
    this.loadError = false;

    // make place holder items
    this.placeholders = new Array(this.page.size);
    this.tourService.getPlans(this.pageToLoadNext, this.page.size, ['tour'])
        .subscribe((plans: Plan) => {
          // update page
          this.page = plans.page;
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
  }

  private restoreScrollPosition() {
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
  }

}
