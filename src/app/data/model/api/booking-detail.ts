import {ResponseResource} from '../extra/response-resource';
import {TicketType} from '../extra/ticket-type';

export class BookingDetail extends ResponseResource<BookingDetail> {

    id: number = 0;
    fullName: string = '';
    gender: boolean = true;
    identification: string = '';
    birthDate: number = Date.now();
    ticketType: TicketType;
    bookingId: number = 0;

}