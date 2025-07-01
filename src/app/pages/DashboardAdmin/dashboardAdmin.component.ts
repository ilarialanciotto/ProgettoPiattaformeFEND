import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { ClassroomDTO } from "../../models/classroom.model";
import { LoggedInUser } from "../../models/loggedUser.model";
import { Subscription } from "rxjs";
import { BookingDTO } from '../../models/booking.model';
import {AdminService} from '../../services/teacher-adminService/admin.service';

@Component({
  selector: 'app-dashboardAdmin',
  templateUrl: './dashboardAdmin.component.html',
  standalone: false,
  styleUrls: ['./dashboardAdmin.component.css']
})
export class DashboardAdmin implements OnInit, OnDestroy {

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
  ) { }

  @Input() selectedAula: ClassroomDTO | null = null;
  @Input() headers: HttpHeaders | undefined;
  @Input() currentUser: LoggedInUser | null = null;
  @Input() userSubscription: Subscription | undefined;
  @Input() guideStep: number = 0;
  @Input() toAccept: BookingDTO[] = [];

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  bookingCheck() {
    if (!this.headers) {
      return;
    }
    this.adminService.getBookingToAccept(this.headers)
      .subscribe({
        next: (response: BookingDTO[]) => {
          this.toAccept = response;
        },
        error: (error: { error: string }) => {
          this.toastr.error(error.error, 'Booking');
        }
      });
  }

  accept(id: number) {
    if (!this.headers) {
      return;
    }
    this.adminService.approveBooking(id, this.headers)
      .subscribe({
        next: (response: string | undefined) => {
          this.bookingCheck();
          this.toastr.info(response, "Booking");
        },
        error: (error: { error: string | undefined; }) => {
          this.toastr.error(error.error, 'Booking');
        }
      });
  }
}
