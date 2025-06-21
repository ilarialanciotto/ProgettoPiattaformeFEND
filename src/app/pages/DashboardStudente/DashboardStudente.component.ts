import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AulaDTO } from '../../models/aula.model';
import { ToastrService } from 'ngx-toastr';
import { LoggedInUser } from '../../models/loggedUser.model';
import { Subscription } from 'rxjs';
import {StudenteService} from '../../services/studenteService/studente.service';
import {prenotazioneAule} from '../../models/prenotazioneAuleDTO.model';

@Component({
  selector: 'app-dashboardStudente',
  templateUrl: './DashboardStudente.component.html',
  standalone: false,
  styleUrls: ['./DashboardStudente.component.css']
})
export class DashboardStudente implements OnInit, OnDestroy {

  constructor(
    private studenteService: StudenteService,
    private toastr: ToastrService
  ) { }

  //TODO CONTROLLARE SE CACHE E PAGINAZIONE VANNO FATTI

  @Input() guidaStep: number = 0;
  @Input() prenotazioni: prenotazioneAule[] = [];
  @Input() selectedAula: AulaDTO | null = null;
  @Output() selectedAulaChange = new EventEmitter<null>();

  codice: String = '';
  codiceInserito: number = 0;

  @Input() headers: HttpHeaders | undefined;
  @Input() currentUser: LoggedInUser | null = null;
  @Input() userSubscription: Subscription | undefined;

  enterAula(): void {
    if (!this.selectedAula) {
      return;
    }

    this.segnalaEntrata(this.selectedAula.id, this.codiceInserito);
  }

  exitAula(): void {
    if (!this.selectedAula || !this.headers) {
      this.toastr.error("Errore nell'uscita dall'aula", 'Uscita');
      return;
    }

    this.studenteService.esciDaAula(this.selectedAula.id, this.headers)
      .subscribe({
        next: (response: string | undefined) => {
          this.toastr.info(response, 'Uscita');
          this.selectedAula = null;
          this.selectedAulaChange.emit(null);
        },
        error: (error: { error: string | undefined; }) => {
          this.toastr.error(error.error, 'Uscita');
        }
      });
  }

  controllaCodice() {
    if (!this.headers) return;

    this.studenteService.controllaCodice(this.headers).subscribe({
      next: (response: String) => {
        this.codice = response;
        this.selectedAula = null;
      },
      error: (error: { error: string | undefined; }) => {
        this.toastr.error(error.error, 'Codice');
      }
    });
  }

  segnalaEntrata(aulaId: number, codice: number): void {
    if (!this.headers) return;

    this.studenteService.segnalaEntrata(aulaId, codice, this.headers)
      .subscribe({
        next: (response: string | undefined) => {
          this.toastr.info(response, 'Entrata');
        },
        error: (error: { error: string | undefined; }) => {
          this.toastr.error(error.error, 'Entrata');
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
