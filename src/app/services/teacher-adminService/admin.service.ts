import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BookingDTO} from '../../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminApiPath = `http://localhost:8080/FreeClassroom/home/Admin`;

  constructor(private http: HttpClient) { }

  getBookingToAccept(headers: HttpHeaders): Observable<BookingDTO[]> {
    const url = `${this.adminApiPath}/getList`;
    return this.http.get<BookingDTO[]>(url, { headers: headers });
  }

  approveBooking(bookingID: number, headers: HttpHeaders): Observable<string> {
    const url = `${this.adminApiPath}/approveBooking`;
    return this.http.post(url, bookingID, { headers: headers, responseType: 'text' });
  }
}
