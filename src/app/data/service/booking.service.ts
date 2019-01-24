import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Booking} from '../model/api/booking';
import {environment} from '../../../environments/environment';
import {ItemPlan} from '../model/extra/item-plan';
import {ProcessType} from '../model/extra/process-type';
import {BookingDetail} from '../model/api/booking-detail';
import {TicketType} from '../model/extra/ticket-type';


@Injectable({
    providedIn: 'root'
})
export class BookingService {


    BOOKING_API_URL = `${environment.apiHost}/api/v1/bookings`;

    constructor(private  http: HttpClient) {
    }

    getBookings = (): Observable<Booking> => this.http.get<Booking>(this.BOOKING_API_URL);

    addBooking = (item: ItemPlan): Observable<Booking> => {
        // convert item plan to booking
        let booking = new Booking();
        booking.planId = item.plan.id;
        booking.processType = ProcessType.IN_CART;
        booking.fullName = '';
        booking.gender = true;
        booking.email = '';
        booking.phoneNumber = '';
        booking.bankAccount = '';
        booking.bookingTime = item.item.updateTime;
        booking.totalOfTicket = item.item.noTicketAdult + item.item.noTicketChild;
        booking.grandTotal = item.item.noTicketAdult * item.plan.adultPrice + item.item.noTicketChild * item.plan.childPrice;
        booking.details = [];

        // create detail by number of ticket
        for (let i = 0; i < item.item.noTicketAdult; i++) {
            let detail = new BookingDetail();
            detail.fullName = '';
            detail.gender = true;
            detail.identification = '';
            detail.birthDate = Date.now();
            detail.ticketType = TicketType.ADULT;

            booking.details.push(detail);
        }

        for (let i = 0; i < item.item.noTicketChild; i++) {
            let detail = new BookingDetail();
            detail.fullName = '';
            detail.gender = true;
            detail.identification = '';
            detail.birthDate = Date.now();
            detail.ticketType = TicketType.CHILD;

            booking.details.push(detail);
        }

        return this.http.post<Booking>(this.BOOKING_API_URL, booking);
    };

    deleteBooking = (id: number | string): Observable<Booking> => this.http.delete<Booking>(`${this.BOOKING_API_URL}/${id}`);

    getBooking = (id: number | string): Observable<Booking> =>
        this.http.get<Booking>(`${this.BOOKING_API_URL}/${id}`);

    followLink = <T>(link: string): Observable<T> => this.http.get<T>(link);

}
