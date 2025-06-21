import { Component } from '@angular/core';
import { UtenteDTO } from '../../../models/utente.model';
import { JwtResponse } from '../../../models/jwt-response.model';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {UtenteService} from '../../../services/utenteService/utente.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrl: './login.component.css'
})

export class LoginComponent {

  utente: UtenteDTO = { email: '', password: ''};
  jwtResponse: JwtResponse | null = null;

  constructor(private utenteService: UtenteService, private router: Router,private toastr: ToastrService) {}

  onLogin() {
    this.utenteService.login(this.utente).subscribe({
      next: res => {
        this.jwtResponse = res;
        this.router.navigate(['/dashboard']);
      },
      error: (err: { error: string | undefined; }) => {
        this.toastr.error(err.error, 'login');
        this.jwtResponse = null;
      }
    });
  }
}
