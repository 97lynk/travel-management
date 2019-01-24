import {Tour} from './tour';
import {Place} from './place';
import {ResponseResource} from '../extra/response-resource';

export class Plan extends ResponseResource<Plan> {

    id: number = 0;
    name: string = '';
    url: string = '';
    startTime: number = Date.now();
    numberOfSlot: number = 0;
    numberOfReservedSlot: number = 0;
    adultPrice: number = 0;
    childPrice: number = 0;
    tour: Tour = new Tour();
    places: Place[];
    placeIds: number[];

}

