import {Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {TourService} from '../../../data/service/tour.service';
import {Place} from '../../../data/model/api/place';
import {Tour} from '../../../data/model/api/tour';
import {MapService} from '../../../data/service/map.service';
import {Plan} from '../../../data/model/api/plan';
import {NbCalendarHeaderComponent, NbDialogService, NbStepperComponent} from '@nebular/theme';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material';
import {VTextEncodePipe} from '../../../data/pipe/vtext-encode.pipe';
import {NbDatepickerComponent} from '@nebular/theme/components/datepicker/datepicker.component';
import {ConfirmDialogComponent} from '../../../layout/dialog/confirm-dialog.component';
import {Logger} from '../../../data/util/logger';

@Component({
  selector: 'travel-plan-form',
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

  // plan
  plan: Plan;

  // selected date from datepicker
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
    choosePlace: FormGroup
  };

  constructor(private tourService: TourService,
              private mapService: MapService,
              private dialogService: NbDialogService,
              private route: ActivatedRoute,
              private router: Router,
              private vtextPipe: VTextEncodePipe,
              private fb: FormBuilder,
              @Inject(LOCALE_ID) protected localeId: string) {

    Logger.info('PLAN FORM: locale_id = %d', localeId);

    // init variables
    this.provinces = [];
    this.selectedPlaces = [];
    this.plan = new Plan();
    this.INSERT_MODE = true;
    this.startDate = new Date();
    this.complete = {title: '', message: '', textType: '', icon: ''};
    this.stepperForm = {
      chooseTour: this.fb.group({
        tour: ['', Validators.required]
      }),
      commonInfo: this.fb.group({
        title: ['', Validators.required],
        url: ['', Validators.required],
      }),
      time: this.fb.group({
        time: [new Date(), Validators.required]
      }),
      priceAndTicket: this.fb.group({
        adultPrice: [0, [Validators.min(1000000), Validators.required]],
        childPrice: [0, [Validators.min(1000000), Validators.required]],
        reversedSlot: [0, [Validators.min(0), Validators.required]],
        totalSlot: [0, [Validators.min(20), Validators.required]]
      }),
      choosePlace: this.fb.group({
        places: [[], Validators.required]
      })
    };
  }

  ngOnInit() {
    // get plan id from url
    const {id} = this.route.snapshot.params;
    const url = this.route.snapshot.url.join('/');
    this.planId = Number(id);

    // load all place
    this.mapService.getPlaces().subscribe((places: Place) => this.provinces = places.content);

    // check valid this page for  edit/add
    if (url.indexOf('edit') !== -1) {
      // for add a new plan
      if (Number.isNaN(this.planId)) this.router.navigate(['/management/plans', 'add']);
      else { // for edit plan
        this.tourService.getPlanById(this.planId, ['tour', 'places']).subscribe((plan: Plan) => {
          this.plan = plan;

          this.chooseTour(plan.tour);
          this.submitCommonInfo();
          this.submitChooseDate();
          this.submitPriceAndTicket();
          this.submitChoosePlaces();
        });
        this.INSERT_MODE = false;
      }
    } else if (url.indexOf('add') !== -1) this.INSERT_MODE = true;

    Logger.info('PLAN FORM: mode =', (this.INSERT_MODE) ? 'INSERT' : 'EDIT');

    // handle event input
    this.filteredProvinces = this.inputPlace.valueChanges.pipe(
        startWith(''),
        map((input: string | Place | null) => input ? this.filterStates(input) : this.provinces.slice())
    );
  }

  stepController = {
    step1: (tour: Tour) => {
      this.chooseTour(tour);
      this.planStepper.next();
      Logger.success('complete step 1:\n%o', tour);
    },
    step2: () => {
      this.submitCommonInfo();
      this.planStepper.next();
      Logger.success('complete step 2:\n%o', this.stepperForm.commonInfo.value);
    },
    step3: () => {
      this.submitChooseDate();
      this.planStepper.next();
      Logger.success('complete step 3:\n%o', this.stepperForm.time.value);
    },
    step4: () => {
      this.submitPriceAndTicket();
      this.planStepper.next();
      Logger.success('complete step 4:\n%o', this.stepperForm.priceAndTicket.value);
    },
    step5: () => {
      this.submitChoosePlaces();
      this.planStepper.next();
      Logger.success('complete step 5:\n%o', this.stepperForm.choosePlace.value);
    },
    step6: () => {
      const dialog = this.dialogService.open(ConfirmDialogComponent);
      dialog.componentRef.instance.config = {
        title: (this.INSERT_MODE) ? 'Thêm plan' : 'Sửa plan',
        message: (this.INSERT_MODE) ? 'Lưu plan mới?' : `Lưu thay đổi Plan#${this.planId}?`,
        leftButton: {status: 'secondary', label: 'Hủy', return: false},
        rightButton: {status: 'primary', label: 'Lưu', return: true}
      };
      Logger.info('Open dialog:\n %o', dialog.componentRef.instance.config);
      dialog.onClose.subscribe(value => {
        Logger.info('Close dialog:\n %o', value);
        if (value) this.submitPlanForm();
      });
    }
  };

  /**
   * complete STEP 1 - choose a tour in list or click button
   * @param tour
   * @param isOldTour
   */
  private chooseTour(tour: Tour) {
    // set selected tour
    this.stepperForm.chooseTour.setValue({tour: tour});

    // preparing next step
    this.stepperForm.commonInfo.setValue({
      title: tour.name, url: this.vtextPipe.transform(tour.name)
    });

    this.stepperForm.commonInfo.get('title').valueChanges.subscribe(value => {
      this.stepperForm.commonInfo.get('url').setValue(this.vtextPipe.transform(value));
    });
  }

  /**
   * complete STEP 2
   */
  private submitCommonInfo() {
    // preparing next step
    if (this.INSERT_MODE) {
      const tomorrow = Date.now() + 24 * 60 * 60 * 1000;// timestamp
      this.startDate = new Date(tomorrow);
    } else
      this.startDate = new Date(this.plan.startTime);

    this.startDatePicker.value = this.startDate;
    this.stepperForm.time.setValue({time: this.startDate});
  }

  /**
   * complete STEP3
   */
  private submitChooseDate() {
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
  }

  /**
   * complete STEP4
   */
  private submitPriceAndTicket() {
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
  }

  /**
   * complete STEP 5
   */
  private submitChoosePlaces() {
    // set selected places
    this.stepperForm.choosePlace.setValue({places: this.selectedPlaces});

    // prepare for last step
    this.plan = new Plan();
    this.plan.id = this.planId;
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

    // this.stepperForm.confirm.setValue({'confirm': 'OK'});
  }

  /**
   * complete STEP 6 - submit to complete stepper
   */
  private submitPlanForm() {
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

  /**
   * get form control in stepperForm
   * @param {string} group
   * @param {string} control
   * @returns {any}
   */
  getControl(group: string, control: string) {
    return this.stepperForm[group].get(control);
  }

  /**
   * =========== =========== =========== ===========
   *  functions of matchips and matautocomplete
   * =========== =========== =========== ===========
   */

  /**
   * move a place from selectedPlaces array to provinces array
   * @param p
   */
  remove(p: Place) {
    this.provinces.push(p);
    const index = this.selectedPlaces.indexOf(p);
    if (index >= 0) {
      this.selectedPlaces.splice(index, 1);
    }
    this.stepperForm.choosePlace.setValue({places: this.selectedPlaces});
  }

  /**
   * move a place from provinces array to selectedPlaces array
   * @param p
   */
  add(p: Place) {
    this.selectedPlaces.push(p);
    const index = this.provinces.indexOf(p);
    if (index >= 0) {
      this.provinces.splice(index, 1);
    }
    this.stepperForm.choosePlace.setValue({places: this.selectedPlaces});
  }

  /**
   * handle event click option in selection
   * @param event
   */
  selectItem(event: MatAutocompleteSelectedEvent) {
    this.add(event.option.value);

    // reset input
    this.placeInput.nativeElement.value = '';
    this.inputPlace.setValue(null);
  }

  /**
   * filtering places by a name/place to make options
   * @param value
   */
  private filterStates(value: string | Place): Place[] {
    if (typeof value === 'string') {
      // optimize search
      const searchValue = this.vtextPipe.transform(value);
      return this.provinces.filter(p => this.vtextPipe.transform(p.name).includes(searchValue));

    } else return this.provinces.filter(p => p.id === value.id);
  }

}
