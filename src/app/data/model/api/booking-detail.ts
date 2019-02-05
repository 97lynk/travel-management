import {ResponseResource} from '../extra/response-resource';
import {TicketType} from '../extra/ticket-type';

export class BookingDetail extends ResponseResource<BookingDetail> {


  constructor(public id: number = 0,
              public fullName: string = '',
              public gender: boolean = true,
              public identification: string = '',
              public birthDate: number = Date.now(),
              public ticketType: TicketType = null,
              public bookingId: number = 0) {
    super();
  }

}