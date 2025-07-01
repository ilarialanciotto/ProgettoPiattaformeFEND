import {Time} from '@angular/common';

export interface BookingDTO {

  id : number;
  bookingDate: Date | null ;
  duration: Time | null ;
  code: number ;
  userID: number | null ;
  laboratoryID: number | null ;
}
