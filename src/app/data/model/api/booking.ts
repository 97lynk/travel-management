import {BookingDetail} from './booking-detail';
import {ResponseResource} from '../extra/response-resource';
import {Plan} from './plan';
import {ProcessType} from '../extra/process-type';

export class Booking extends ResponseResource<Booking> {

  constructor(public id: number | string = '',
              public fullName: string = '',
              public gender: boolean = true,
              public email: string = '',
              public phoneNumber: string = '',
              public bankAccount: string = '',
              public bookingTime: number = Date.now(),
              public totalOfTicket: number = 0,
              public grandTotal: number = 0.0,
              public planId: number = 0,
              public plan: Plan = new Plan(),
              public processType: ProcessType = null,
              public details: BookingDetail[] = []) {
    super();
  }

}