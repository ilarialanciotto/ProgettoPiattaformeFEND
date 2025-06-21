import {UtenteDTO} from '../../../models/utente.model';
import {Component, OnInit} from '@angular/core';
import {UtenteService} from '../../../services/utenteService/utente.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit{

  utente: UtenteDTO = { nome: '', email: '', password: '', codiceDocente: '' };
  success = '';
  error = '';

  constructor(private utenteService: UtenteService) {}

  onSubmit() {

    if (this.utente.codiceDocente?.trim() === '') {
      this.utente.codiceDocente = null;
    }

    this.utenteService.registrazione(this.utente).subscribe({
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
