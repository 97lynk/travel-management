import {Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {TourService} from '../../../data/service/tour.service';
import {Place} from '../../../data/model/api/place';
import {Tour} from '../../../data/model/api/tour';
import {MapService} from '../../../data/service/map.service';
import {Plan} from '../../../data/model/api/plan';
import {NbCalendarHeaderComponent, NbStepperComponent} from '@nebular/theme';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material';
import {VTextEncodePipe} from '../../../data/pipe/vtext-encode.pipe';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss'],
  entryComponents: [NbCalendarHeaderComponent],
  providers: [VTextEncodePipe]
})
export class PlanFormComponent implements OnInit {

  // matchips variales
  @ViewChild('placeInput') placeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  inputPlace = new FormControl();

  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredProvinces: Observable<Place[]>;

  // contains all places expect places in  choosedPlaces
  provinces: Place[];

  // constains choosed places
  choosedPlaces: Place[] = [];

  // tours to planning
  tours: Tour[];

  // plan
  plan: Plan;

  startDate: Date;

  // true: insert, false: edit
  INSERT_MODE: boolean;

  planId: number;

  complete: {
    title: string,
    message: string,
    textType: string,
    icon: string,
  };

  @ViewChild('planStepper') planStepper: NbStepperComponent;

  stepperForm: {
    chooseTour: FormGroup,
    commonInfo: FormGroup,
    time: FormGroup,
    priceAndTicket: FormGroup,
    choosePlace: FormGroup,
    // confirm: FormGroup,
  };

  constructor(private tourService: TourService,
              private mapService: MapService,
              private route: ActivatedRoute,
              private router: Router,
              private vtextPipe: VTextEncodePipe,
              private fb: FormBuilder,
              @Inject(LOCALE_ID) protected localeId: string) {

    console.log('PLAN FORM: locale_id =', localeId);

    // init variables
    this.tours = [];
    this.provinces = [];
    this.choosedPlaces = [];
    this.plan = new Plan();
    this.INSERT_MODE = true;
    this.complete = {
      title: '',
      message: '',
      textType: '',
      icon: ''
    };
  }

  ngOnInit() {
    // get plan id from url
    const {id} = this.route.snapshot.params;
    const url = this.route.snapshot.url.join('/');
    this.planId = Number(id);

    console.log(id, this.planId);

    this.tourService.getTours(0, 10).subscribe((tours: Tour) => this.tours = tours.content);
    this.mapService.getPlaces().subscribe((places: Place) => this.provinces = places.content);

    // check this page for edit/add
    if (url.indexOf('edit') !== -1) {
      // for add a new plan
      if (Number.isNaN(this.planId)) this.router.navigate(['/management/plans', 'add']);
      else { // for edit plan
        this.tourService.getPlanById(this.planId, ['tour', 'places']).subscribe((plan: Plan) => {
          this.plan = plan;
          this.choosedPlaces.push(...plan.places);
        });
        this.INSERT_MODE = false;
      }

    } else if (url.indexOf('add') !== -1) this.INSERT_MODE = true;

    console.log('PLAN FORM: mode =', (this.INSERT_MODE) ? 'INSERT' : 'EDIT');

    // handle event input
    this.filteredProvinces = this.inputPlace.valueChanges
        .pipe(
            startWith(''),
            map((input: string | Place | null) => input ? this._filterStates(input) : this.provinces.slice())
        );

    if (this.INSERT_MODE)
      this.stepperForm = {
        chooseTour: this.fb.group({
          tour: ['', Validators.required]
        }),
        commonInfo: this.fb.group({
          title: ['', Validators.required],
          url: ['', Validators.required],
        }),
        time: this.fb.group({
          time: ['', Validators.required]
        }),
        priceAndTicket: this.fb.group({
          adultPrice: ['', [Validators.required, Validators.min(1000000)]],
          childPrice: ['', [Validators.required, Validators.min(1000000)]],
          reversedSlot: ['', Validators.required],
          totalSlot: ['', [Validators.required, Validators.min(20)]]
        }),
        choosePlace: this.fb.group({
          places: [[], Validators.required]
        }),
        // confirm: this.fb.group({})
      };
    else
      this.stepperForm = {
        chooseTour: this.fb.group({}),
        commonInfo: this.fb.group({}),
        time: this.fb.group({}),
        priceAndTicket: this.fb.group({}),
        choosePlace: this.fb.group({}),
        // confirm: this.fb.group({}),
      };
  }

  /**
   * choose a tour in list or click button
   * @param tour
   * @param isOldTour
   */
  completeChooseTour(tour: Tour, isOldTour) {
    this.plan.tour = tour;
    this.plan.name = tour.name;
    this.plan.url = this.vtextPipe.transform(tour.name);

    if (this.INSERT_MODE) this.startDate = new Date();
    else this.startDate = new Date(this.plan.startTime);

    this.stepperForm.chooseTour.controls['tour'].setValue(tour);
    this.planStepper.next();
  }

  /**
   * check date in datepicker dialog
   * @param date
   */
  submitChooseDate(date) {
    this.startDate = new Date(date);
    this.plan.startTime = this.startDate.getTime();
    this.stepperForm.time.controls['time'].setValue(date);
  }

  /**
   * submit price and ticket
   */
  submitPriceAndTicket = () => {
    // remove places in provinces already in choosedPlaces
    if (this.INSERT_MODE) return;
    this.provinces = this.provinces.filter(p => !this.plan.placeIds.includes(p.id));
    this.stepperForm.choosePlace.controls['places'].setValue(this.choosedPlaces);
  };

  /**
   * move a place from choosedPlaces array to provinces array
   * @param p
   */
  remove = (p: Place) => {
    this.provinces.push(p);
    const index = this.choosedPlaces.indexOf(p);
    if (index >= 0) {
      this.choosedPlaces.splice(index, 1);
    }

    this.stepperForm.choosePlace.controls['places'].setValue(this.choosedPlaces);
  };

  /**
   * move a place from provinces array to choosedPlaces array
   * @param p
   */
  add = (p: Place) => {
    this.choosedPlaces.push(p);
    const index = this.provinces.indexOf(p);
    if (index >= 0) {
      this.provinces.splice(index, 1);
    }
    this.stepperForm.choosePlace.controls['places'].setValue(this.choosedPlaces);
  };

  /**
   * handle event click option in selection
   * @param event
   */
  selected = (event: MatAutocompleteSelectedEvent) => {
    this.add(event.option.value);

    // reset input
    this.placeInput.nativeElement.value = '';
    this.inputPlace.setValue(null);
  };

  /**
   * filtering places by a name/place to make options
   * @param value
   */
  private _filterStates = (value: string | Place): Place[] => {
    if (typeof value === 'string') {
      // optimize search
      const searchValue = this.vtextPipe.transform(value);
      return this.provinces.filter(p => this.vtextPipe.transform(p.name).includes(searchValue));

    } else return this.provinces.filter(p => p.id === value.id);
  };

  /**
   * submit to complete stepper
   */
  submitPlanForm() {
    const newPlan = new Plan();
    newPlan.id = this.plan.id;
    newPlan.name = this.plan.name;
    newPlan.url = this.plan.url;
    newPlan.startTime = this.plan.startTime;
    newPlan.numberOfSlot = this.plan.numberOfSlot;
    newPlan.numberOfReservedSlot = this.plan.numberOfReservedSlot;
    newPlan.adultPrice = this.plan.adultPrice;
    newPlan.childPrice = this.plan.childPrice;
    newPlan['tourId'] = this.plan.tour.id;
    newPlan.placeIds = this.choosedPlaces.map(p => p.id);

    if (this.INSERT_MODE)
      this.tourService.addNewPlan(newPlan)
          .subscribe(
              (plan: Plan) => {
                this.complete = {
                  title: 'Thành công',
                  message: `Plan#${plan.id} đã được thêm thành công!`,
                  textType: 'text-success',
                  icon: 'eva eva-done-all-outline'
                };
                this.planStepper.next();
              },
              error => {
                this.complete = {
                  title: 'Đã xảy ra lỗi',
                  message: `Plan#${newPlan.id} chưa được thêm.`,
                  textType: 'text-danger',
                  icon: 'eva eva-alert-circle'
                };
                this.planStepper.next();
              });
    else
      this.tourService.updatePlanById(newPlan.id, newPlan)
          .subscribe(
              (plan: Plan) => {
                this.complete = {
                  title: 'Thành công',
                  message: `Plan#${newPlan.id} đã được chỉnh sửa thành công!`,
                  textType: 'text-success',
                  icon: 'eva eva-done-all-outline'
                };
                this.planStepper.next();
              },
              error => {
                this.complete = {
                  title: 'Đã xảy ra lỗi',
                  message: `Plan#${newPlan.id} chưa được chỉnh sửa.`,
                  textType: 'text-danger',
                  icon: 'eva eva-alert-circle'
                };
                this.planStepper.next();
              });
  }
}
