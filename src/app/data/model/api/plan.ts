import {Tour} from './tour';
import {Place} from './place';
import {ResponseResource} from '../extra/response-resource';

export class Plan extends ResponseResource<Plan> {

  constructor(public id: number = 0,
              public name: string = '',
              public url: string = '',
              public startTime: number = Date.now(),
              public numberOfSlot: number = 0,
              public numberOfReservedSlot: number = 0,
              public adultPrice: number = 0,
              public childPrice: number = 0,
              public tour: Tour = new Tour(),
              public places: Place[] = [],
              public placeIds: number[] = []
  ) {
    super();
  }
}

