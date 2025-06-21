import {Time} from '@angular/common';

export interface prenotazioneAule{
  id : number;
  dataPrenotazione : Date;
  oraPrenotazione : Time;
  durata : Time;
}
