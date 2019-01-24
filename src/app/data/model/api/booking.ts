import {BookingDetail} from './booking-detail';
import {ResponseResource} from '../extra/response-resource';
import {Plan} from './plan';
import {ProcessType} from '../extra/process-type';

export class Booking extends ResponseResource<Booking> {

    id: number | string = '';
    fullName: string = '';
    gender: boolean = true;
    email: string = '';
    phoneNumber: string = '';
    bankAccount: string = '';
    bookingTime: number = Date.now();
    totalOfTicket: number = 0;
    grandTotal: number = 0.0;
    planId: number;
    plan: Plan;
    processType: ProcessType;
    details: BookingDetail[] = [];

}