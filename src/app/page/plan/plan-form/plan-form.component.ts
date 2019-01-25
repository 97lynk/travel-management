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
import {NbDatepickerComponent} from '@nebular/theme/components/datepicker/datepicker.component';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss'],
  entryComponents: [NbCalendarHeaderComponent],
  providers: [VTextEncodePipe]
})
export class PlanFormComponent implements OnInit {

  // combine matchips with matautocomplete
  @ViewChild('placeInput') placeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  inputPlace = new FormControl();

  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredProvinces: Observable<Place[]>;

  // contains all places expect places in  selectedPlaces
  provinces: Place[];

  // constains selected places
  selectedPlaces: Place[] = [];

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
  @ViewChild('startDatePicker') startDatePicker: NbDatepickerComponent<any>;

  // reactive form control
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
    this.selectedPlaces = [];
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
        this.tourService.getPlanById(this.planId, ['tour', 'places']).subscribe((plan: Plan) => this.plan = plan);
        this.INSERT_MODE = false;
      }

    } else if (url.indexOf('add') !== -1) this.INSERT_MODE = true;

    console.log('PLAN FORM: mode =', (this.INSERT_MODE) ? 'INSERT' : 'EDIT');

    // handle event input
    this.filteredProvinces = this.inputPlace.valueChanges.pipe(
        startWith(''),
        map((input: string | Place | null) => input ? this._filterStates(input) : this.provinces.slice())
    );

    // if (this.INSERT_MODE)
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
        adultPrice: [1000000, [Validators.min(1000000), Validators.required]],
        childPrice: [1000000, [Validators.min(1000000), Validators.required]],
        reversedSlot: [0, [Validators.min(0), Validators.required]],
        totalSlot: [20, [Validators.min(20), Validators.required]]
      }),
      choosePlace: this.fb.group({
        places: [[], Validators.required]
      })
    };
    // else
    //   this.stepperForm = {
    //     chooseTour: this.fb.group({tour: ['']}),
    //     commonInfo: this.fb.group({title: [''], url: [''],}),
    //     time: this.fb.group({time: ['']}),
    //     priceAndTicket: this.fb.group({
    //       adultPrice: [0], childPrice: [0],
    //       reversedSlot: [0], totalSlot: [0]
    //     }),
    //     choosePlace: this.fb.group({places: [[]]})
    //   };
  }

  /**
   * choose a tour in list or click button
   * @param tour
   * @param isOldTour
   */
  chooseTour(tour: Tour, isOldTour) {
    // set selected tour
    this.stepperForm.chooseTour.setValue({tour: tour});

    // preparing next step
    this.stepperForm.commonInfo.setValue({
      title: tour.name, url: this.vtextPipe.transform(tour.name)
    });

    this.stepperForm.commonInfo.get('title').valueChanges.subscribe(value => {
      this.stepperForm.commonInfo.get('url').setValue(this.vtextPipe.transform(value));
    });

    this.planStepper.next();
    console.log('complete step 1: ', JSON.stringify(tour, null, 2));
  }

  submitCommonInfo = () => {
    // preparing next step
    // this.startDatePicker.min = new Date(); // min is today

    if (this.INSERT_MODE) {
      const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
      this.startDate = new Date(tomorrow);
    } else {
      this.startDate = new Date(this.plan.startTime);
    }

    this.startDatePicker.value = this.startDate;
    this.stepperForm.time.setValue({time: this.startDate});

    this.planStepper.next();
    console.log('complete step 2: ', this.stepperForm.commonInfo.value);
  };

  submitChooseDate = () => {
    // set selected date
    this.stepperForm.time.setValue({time: this.startDate});

    // preparing next step
    if (this.INSERT_MODE) {
      this.stepperForm.priceAndTicket.setValue({
        adultPrice: 1000000,
        childPrice: 1000000,
        reversedSlot: 0,
        totalSlot: 20
      });
    } else {
      this.stepperForm.priceAndTicket.setValue({
        adultPrice: this.plan.adultPrice,
        childPrice: this.plan.childPrice,
        reversedSlot: this.plan.numberOfReservedSlot,
        totalSlot: this.plan.numberOfSlot
      });
    }

    this.planStepper.next();
    console.log('complete step 3: ', this.stepperForm.time.value);
  };

  /**
   * submit price and ticket
   */
  submitPriceAndTicket = () => {
    // prepare next step
    if (!this.INSERT_MODE) {
      // push places in response data to seclected list
      this.selectedPlaces.push(...this.plan.places);
      // make response empty
      this.plan.places = [];
      // remove places in provinces already in selectedPlaces
      this.provinces = this.provinces.filter(p => !this.plan.placeIds.includes(p.id));

      this.stepperForm.choosePlace.setValue({places: this.selectedPlaces});
    }

    this.planStepper.next();
    console.log('complete step 4: ', this.stepperForm.priceAndTicket.value);
  };

  submitChoosePlaces = () => {
    // set selected places
    this.stepperForm.choosePlace.setValue({places: this.selectedPlaces});

    // prepare for last step
    this.plan = new Plan();
    this.plan.id = 0;
    this.plan.tour = this.getControl('chooseTour', 'tour').value;
    this.plan.name = this.getControl('commonInfo', 'title').value;
    this.plan.url = this.getControl('commonInfo', 'url').value;
    this.plan.startTime = this.getControl('time', 'time').value;
    this.plan.adultPrice = this.getControl('priceAndTicket', 'adultPrice').value;
    this.plan.childPrice = this.getControl('priceAndTicket', 'childPrice').value;
    this.plan.numberOfSlot = this.getControl('priceAndTicket', 'totalSlot').value;
    this.plan.numberOfReservedSlot = this.getControl('priceAndTicket', 'reversedSlot').value;
    this.plan['tourId'] = this.plan.tour.id;
    this.plan.placeIds = this.getControl('choosePlace', 'places').value.map(p => p.id);

    this.planStepper.next();
    console.log('complete step 5: ', this.stepperForm.choosePlace.value);
  };

  /**
   * submit to complete stepper
   */
  submitPlanForm() {

    if (this.INSERT_MODE)
      this.tourService.addNewPlan(this.plan)
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
                  message: `Plan chưa được thêm.`,
                  textType: 'text-danger',
                  icon: 'eva eva-alert-circle'
                };
                this.planStepper.next();
              });
    else
      this.tourService.updatePlanById(this.planId, this.plan)
          .subscribe(
              (plan: Plan) => {
                this.complete = {
                  title: 'Thành công',
                  message: `Plan#${this.planId} đã được chỉnh sửa thành công!`,
                  textType: 'text-success',
                  icon: 'eva eva-done-all-outline'
                };
                this.planStepper.next();
              },
              error => {
                this.complete = {
                  title: 'Đã xảy ra lỗi',
                  message: `Plan#${this.planId} chưa được chỉnh sửa.`,
                  textType: 'text-danger',
                  icon: 'eva eva-alert-circle'
                };
                this.planStepper.next();
              });
  }

  getControl = (group: string, control: string) => this.stepperForm[group].get(control);

  /**
   * =========== =========== =========== ===========
   *  functions of matchips and matautocomplete
   * =========== =========== =========== ===========
   */

  /**
   * move a place from selectedPlaces array to provinces array
   * @param p
   */
  remove = (p: Place) => {
    this.provinces.push(p);
    const index = this.selectedPlaces.indexOf(p);
    if (index >= 0) {
      this.selectedPlaces.splice(index, 1);
    }
    this.stepperForm.choosePlace.setValue({places: this.selectedPlaces});
  };

  /**
   * move a place from provinces array to selectedPlaces array
   * @param p
   */
  add = (p: Place) => {
    this.selectedPlaces.push(p);
    const index = this.provinces.indexOf(p);
    if (index >= 0) {
      this.provinces.splice(index, 1);
    }
    this.stepperForm.choosePlace.setValue({places: this.selectedPlaces});
  };

  /**
   * handle event click option in selection
   * @param event
   */
  selectItem = (event: MatAutocompleteSelectedEvent) => {
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

}
