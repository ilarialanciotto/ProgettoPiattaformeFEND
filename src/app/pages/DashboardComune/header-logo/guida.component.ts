import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AulaDTO} from '../../../models/aula.model';

@Component({
  selector: 'app-guida',
  templateUrl: './guida.component.html',
  standalone: false,
  styleUrl: './guida.component.css'
})

export class GuidaComponent implements OnInit {

  @Input() guidaStep: number = 0;
  @Input() ruolo: String = "";
  @Output() guidaStepChange = new EventEmitter<number>();

  messaggiGuida = [
    'Benvenuto! Qui puoi cercare le aule libere dell\'università',
    'Seleziona un aula per vederne i dettagli',
    'Clicca qui per prenotare un aula',
    'Inserisci un feedback per l\'applicazione',
    'Qui puoi vedere o annullare le tue prenotazioni',
    'Qui puoi visualizzare e modificare i tuoi dati',
  ];

  messaggiSTUDENTE = [
    'Qui tieni aggiornate le tue prenotazioni visualizzando i loro codici, che ti saranno dati quando il responsabile accetterà',
    'Qui puoi entrare/uscire dell\'aula ed eventualmente inserire il codice dato',
    'Qui puoi visualizzare le prenotazioni fatte dai docenti per l\'aula selezionata',
  ];

  messaggiDOCENTE = [
    'Qui puoi visualizzare le prenotazioni fatte dagli studenti che devono essere accettate',
    'Cliccando sull\'id puoi vedere i dettagli di una prenotazione'
  ]

  avanti() {
    if (this.guidaStep < this.messaggiGuida.length - 1) {
      this.guidaStep++;
    } else {
      this.guidaStep = -1; // Fine guida
    }
    this.guidaStepChange.emit(this.guidaStep);
  }

  saltaGuida() {
    this.guidaStep = -1;
    this.guidaStepChange.emit(this.guidaStep);
  }

  ngOnInit(): void {
    if(this.ruolo === "ROLE_STUDENTE") this.messaggiGuida= this.messaggiGuida.concat(this.messaggiSTUDENTE)
    else this.messaggiGuida=this.messaggiGuida.concat(this.messaggiDOCENTE)
  }

}
