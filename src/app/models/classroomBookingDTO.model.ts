import {Time} from '@angular/common';

export interface classroomBookingDTO {
  id : number;
  bookingDate : Date;
  bookingTime : Time;
  duration : Time;
}
