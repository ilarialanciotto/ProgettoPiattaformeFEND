import {UserDTO} from '../../../models/user.model';
import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/userService/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit{

  user: UserDTO = { name: '', email: '', password: '', teacherCode: '' };
  success = '';
  error = '';

  constructor(private utenteService: UserService) {}

  onSubmit() {

    if (this.user.teacherCode?.trim() === '') {
      this.user.teacherCode = null;
    }

    this.utenteService.register(this.user).subscribe({
      next: res => {
        this.success = res;
        this.error = '';
      },
      error: err => {
        this.error = err.error;
        this.success = '';
      }
    });
  }

  ngOnInit(): void {
  }
}
