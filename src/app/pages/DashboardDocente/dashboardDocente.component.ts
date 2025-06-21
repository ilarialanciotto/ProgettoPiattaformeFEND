import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { AulaDTO } from "../../models/aula.model";
import { LoggedInUser } from "../../models/loggedUser.model";
import { Subscription } from "rxjs";
import { PrenotazioneDTO } from '../../models/prenotazione.model';
import {DocenteService} from '../../services/docenteService/docente.service';

@Component({
  selector: 'app-dashboardDocente',
  templateUrl: './dashboardDocente.component.html',
  standalone: false,
  styleUrls: ['./dashboardDocente.component.css']
})
export class DashboardDocente implements OnInit, OnDestroy {

  constructor(
    private docenteService: DocenteService,
    private toastr: ToastrService,
  ) { }

  @Input() selectedAula: AulaDTO | null = null;
  @Input() headers: HttpHeaders | undefined;
  @Input() currentUser: LoggedInUser | null = null;
  @Input() userSubscription: Subscription | undefined;
  @Input() guidaStep: number = 0;

  daAccettare: PrenotazioneDTO[] = [];

  ngOnInit(): void {
    this.controllaPrenotazioni();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  controllaPrenotazioni() {
    if (!this.headers) {
      return;
    }

    this.docenteService.getPrenotazioniDaAccettare(this.headers)
      .subscribe({
        next: (response: PrenotazioneDTO[]) => {
          this.daAccettare = response;
        },
        error: (error: { error: string | undefined; }) => {
          this.toastr.error(error.error, 'Prenotazioni');
        }
      });
  }

  accetta(id: number) {
    if (!this.headers) {
      return;
    }

    this.docenteService.accettaPrenotazione(id, this.headers)
      .subscribe({
        next: (response: string | undefined) => {
          this.controllaPrenotazioni();
          this.toastr.info(response, "Prenotazioni");
        },
        error: (error: { error: string | undefined; }) => {
          this.toastr.error(error.error, 'Prenotazioni');
        }
      });
  }
}
