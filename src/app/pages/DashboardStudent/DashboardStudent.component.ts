import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ClassroomDTO } from '../../models/classroom.model';
import { ToastrService } from 'ngx-toastr';
import { LoggedInUser } from '../../models/loggedUser.model';
import { Subscription } from 'rxjs';
import {StudentService} from '../../services/studentService/student.service';
import {classroomBookingDTO} from '../../models/classroomBookingDTO.model';

@Component({
  selector: 'app-dashboardStudent',
  templateUrl: './DashboardStudent.component.html',
  standalone: false,
  styleUrls: ['./DashboardStudent.component.css']
})
export class DashboardStudent implements OnInit, OnDestroy {

  constructor(
    private studentService: StudentService,
    private toastr: ToastrService
  ) { }

  @Input() guideStep: number = 0;
  @Input() bookings: classroomBookingDTO[] = [];
  @Input() selectedAula: ClassroomDTO | null = null;
  @Output() selectedAulaChange = new EventEmitter<null>();

  codes: String = '';
  insertCode: number = 0;

  @Input() headers: HttpHeaders | undefined;
  @Input() currentUser: LoggedInUser | null = null;
  @Input() userSubscription: Subscription | undefined;
  protected classroomEntered: number | undefined;

  enterClassroom(): void {
    if (!this.selectedAula) {
      return;
    }
    this.reportEnter(this.selectedAula.id, this.insertCode);
  }

  exitClassroom(): void {
    if (!this.classroomEntered || !this.headers) {
      this.toastr.error("Error in exiting the classroom", 'Exit');
      return;
    }
    this.studentService.exitToClassroom(this.classroomEntered, this.headers)
      .subscribe({
        next: (response: string | undefined) => {
          this.toastr.info(response, 'Exit');
          this.selectedAula = null;
          this.classroomEntered = -1;
          this.selectedAulaChange.emit(null);
        },
        error: (error: { error: string | undefined; }) => {
          this.toastr.error(error.error, 'Exit');
        }
      });
  }

  checkCode() {
    if (!this.headers) return;
    this.codes= "";
    this.studentService.checkCode(this.headers).subscribe({
      next: (response: String) => {
        this.codes = response;
        this.selectedAula = null;
      },
      error: (error: { error: string | undefined; }) => {
        this.toastr.error(error.error, 'Codes');
      }
    });
  }

  reportEnter(classroomID: number, code: number): void {
    if (!this.headers) return;
    this.studentService.reportEnter(classroomID, code, this.headers)
      .subscribe({
        next: (response: string | undefined) => {
          this.toastr.info(response, 'Enter');
          this.classroomEntered = classroomID
        },
        error: (error: { error: string | undefined; }) => {
          this.toastr.error(error.error, 'Enter');
        }
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
