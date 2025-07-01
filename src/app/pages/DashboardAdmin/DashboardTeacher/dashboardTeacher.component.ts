import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { ClassroomDTO } from "../../../models/classroom.model";
import { LoggedInUser } from "../../../models/loggedUser.model";
import { Subscription } from "rxjs";
import { BookingDTO } from '../../../models/booking.model';
import {AdminService} from '../../../services/teacher-adminService/admin.service';
import {TeacherService} from '../../../services/teacher-adminService/teacher.service';

@Component({
  selector: 'app-dashboardDocente',
  templateUrl: './dashboardTeacher.component.html',
  standalone: false,
  styleUrls: ['./dashboardTeacher.component.css']
})
export class DashboardTeacher implements OnInit, OnDestroy {

  constructor(
    private teacherService: TeacherService,
    private toastr: ToastrService,
  ) { }

  @Input() selectedAula: ClassroomDTO | null = null;
  @Input() headers: HttpHeaders | undefined;
  @Input() currentUser: LoggedInUser | null = null;
  @Input() userSubscription: Subscription | undefined;
  @Input() guideStep: number = 0;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  adminClassroom : ClassroomDTO[] = []
  drawerOpen: boolean = false;
  selectedClassrooms: ClassroomDTO[] = [];

  CloseDrawer() {
    this.drawerOpen = false;
    if(this.selectedClassrooms.length>0)
        this.selectedClassrooms.forEach((classroom: ClassroomDTO) => {
          this.personInCharge(classroom);
        });
  }

  personInCharge(classroom: ClassroomDTO): void {
    if (!this.headers) return;
    this.teacherService.assignResponsible(classroom.id, this.headers)
      .subscribe({
        next: (response: string) => {
          this.toastr.info(response, "PersonInCharge");
        },
        error: (error: { error: string }) => {
          this.toastr.error(error.error, 'PersonInCharge');
        }
      });
  }

  toggleClassroom(classroom: ClassroomDTO) {
    const index = this.selectedClassrooms.findIndex(c => c.id === classroom.id);
    if (index > -1) {
      this.selectedClassrooms.splice(index, 1);
    } else {
      this.selectedClassrooms.push(classroom);
    }
  }

  classroomListAdmin(){
    if(this.headers==null) return
    this.teacherService.getAdminLaboratory(this.headers)
      .subscribe({
        next:(response : ClassroomDTO[])=>{
          this.adminClassroom= response;
          this.drawerOpen = true;
        },
        error: (error: { error: string }) => {
          this.toastr.error(error.error, 'Laboratory');
          this.drawerOpen = false;
        }
      });
    }

}
