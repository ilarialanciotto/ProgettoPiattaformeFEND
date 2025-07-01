import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ClassroomDTO} from '../../models/classroom.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private teacherApiPath = `http://localhost:8080/FreeClassroom/home/Admin/Teacher`;

  constructor(private http: HttpClient) { }

  assignResponsible(classroomID: number, headers: HttpHeaders): Observable<string> {
    const url = `${this.teacherApiPath}/personInCharge`;
    return this.http.post(url, classroomID, { headers: headers, responseType: 'text' });
  }

  getAdminLaboratory(headers: HttpHeaders): Observable<ClassroomDTO[]> {
    const url = `${this.teacherApiPath}/getLaboratory`;
    return this.http.get<ClassroomDTO[]>(url, { headers: headers });
  }

}
