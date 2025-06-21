import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AulaDTO } from '../../models/aula.model';
import { LoggedInUser } from '../../models/loggedUser.model';
import { FeedbackDTO } from '../../models/feedback.model';
import {UtenteService} from '../../services/utenteService/utente.service';
import {StudenteService} from '../../services/studenteService/studente.service';
import {prenotazioneAule} from '../../models/prenotazioneAuleDTO.model';
import {PrenotazioneDTO} from '../../models/prenotazione.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private utenteService: UtenteService,
    private studenteService : StudenteService
  ) { }

  feedback: FeedbackDTO = { feedback: "" };
  isSidebarOpen: boolean = false;
  auleLibere: AulaDTO[] = [];
  prenotazioni: prenotazioneAule[] = [];
  selectedAula: AulaDTO | null = null;
  laboratorio: boolean = false;
  mostraForm: boolean = false;
  durataPrenotazione: any = null;
  dataPrenotazione: any = null;
  headers!: HttpHeaders;
  currentUser: LoggedInUser | null = null;
  userSubscription: Subscription | undefined;
  mostraImpostazione: boolean = false;
  nuovaEmail: string = '';
  nuovaPassword: any;
  confermaPassword: any;
  ruolo: string = "";
  readonly ROLE_STUDENTE: string = "ROLE_STUDENTE";
  readonly ROLE_DOCENTE: string = "ROLE_DOCENTE";
  guidaStep: number = 0;
  miePrenotazioni: PrenotazioneDTO[] = [];
  prenotazioneDaConfermare: number | null = null;
  private confermaTimeout: any;
  vistaAttiva: 'feedback' | 'prenotazioni' = 'feedback';

  ngOnInit(): void {
    const token = this.utenteService.getToken();
    if (token) {
      this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      this.router.navigate(['/login']);
      return;
    }

    this.userSubscription = this.utenteService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        this.ruolo = this.currentUser.ruolo;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  openSidebar(): void { this.isSidebarOpen = true; }
  closeSidebar(): void { this.isSidebarOpen = false; }
  onSettings(): void { this.mostraImpostazione = true; }
  offSettings(): void { this.mostraImpostazione = false; }

  loadAuleLibere(): void {
    this.utenteService.getAuleLibere(this.headers).subscribe({
      next: (data: AulaDTO[]) => {
        this.auleLibere = data;
        this.selectedAula = null;
      },
      error: (err: { error: string | undefined; }) => this.toastr.error(err.error, 'Aule')
    });
  }

  cambiaVista(vista: 'feedback' | 'prenotazioni'): void {
    this.vistaAttiva = vista;
    if (this.vistaAttiva === 'prenotazioni') {
      this.caricaMiePrenotazioni();
    }
  }

  caricaMiePrenotazioni(): void {
    if (!this.headers) return;
    this.utenteService.getPrenotazioni(this.headers).subscribe({
      next: (data) => {
        this.miePrenotazioni = data;
      },
      error: (err) => {
        this.toastr.error('Errore nel caricamento delle tue prenotazioni.', 'Prenotazione');
      }
    });
  }

  private eseguiCancellazione(idDaCancellare: number): void {
    if (!this.headers) return;

    this.utenteService.delete(idDaCancellare, this.headers).subscribe({
      next: (responseMessage) => {
        this.toastr.info(responseMessage, 'Prenotazione');
        this.miePrenotazioni = this.miePrenotazioni.filter(p => p.id !== idDaCancellare);
      },
      error: (err) => {
        this.toastr.error('Impossibile cancellare la prenotazione.', 'Prenotazione');
      }
    });
  }

  onDeletePrenotazione(idPrenotazione: number): void {
    if (this.prenotazioneDaConfermare === idPrenotazione) {
      this.eseguiCancellazione(idPrenotazione);
      this.prenotazioneDaConfermare = null;
      clearTimeout(this.confermaTimeout);
    } else {
      this.prenotazioneDaConfermare = idPrenotazione;
      this.confermaTimeout = setTimeout(() => {
        if (this.prenotazioneDaConfermare === idPrenotazione) {
          this.prenotazioneDaConfermare = null;
        }
      }, 4000); // 4 secondi
    }
  }

  annullaConferma(): void {
    this.prenotazioneDaConfermare = null;
    clearTimeout(this.confermaTimeout);
  }

  loadPrenotazioni(): void {
    if (!this.selectedAula) return;
    this.studenteService.getPrenotazioniPerAula(this.selectedAula.id, this.headers).subscribe({
      next: (data: prenotazioneAule[]) => this.prenotazioni = data,
      error: (err: { error: string | undefined; }) => this.toastr.error(err.error, 'Prenotazioni')
    });
  }

  prenotaConDurata(): void {
    if (!this.selectedAula || !this.durataPrenotazione || !this.dataPrenotazione) return;
    const prenotazioneDTO = {
      idlaboratorio: this.selectedAula.id,
      durata: this.durataPrenotazione,
      dataPrenotazione: this.dataPrenotazione
    };
    this.utenteService.prenotaLaboratorio(prenotazioneDTO, this.headers).subscribe({
      next: (response: string | undefined) => {
        this.toastr.info(response, 'Prenotazione');
        this.mostraForm = false;
      },
      error: (err: { error: string | undefined; }) => this.toastr.error(err.error, 'Prenotazione')
    });
  }

  inserisciFeedback(): void {
    this.utenteService.inviaFeedback(this.feedback, this.headers).subscribe({
      next: (response: string | undefined) => {
        this.toastr.info(response, 'Feedback');
        this.feedback = { feedback: "" };
      },
      error: (err: { error: string | undefined; }) => this.toastr.error(err.error, 'Feedback')
    });
  }

  submit(): void {
    if (this.nuovaPassword !== this.confermaPassword) {
      this.toastr.error("Le password non coincidono", 'Modifica Dati');
      return;
    }

    const datiDaAggiornare = { email: this.nuovaEmail, password: this.nuovaPassword };
    this.utenteService.aggiornaDati(datiDaAggiornare, this.headers).subscribe({
      next: response => {
        this.toastr.info(response, 'Modifica Dati');
        this.onLogout();
      },
      error: err => this.toastr.error(err.error, 'Modifica Dati')
    });
  }

  selectAula(aula: AulaDTO): void {
    if (this.selectedAula?.id === aula.id) {
      this.selectedAula = null;
      this.laboratorio = false;
    } else {
      this.selectedAula = aula;
      this.laboratorio = this.selectedAula.laboratorio;
      if (this.ruolo === this.ROLE_STUDENTE) {
        this.loadPrenotazioni();
      }
    }
  }

  onLogout(): void {
    this.utenteService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
