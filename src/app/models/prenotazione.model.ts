import {Time} from '@angular/common';

export interface PrenotazioneDTO {

  id : number;
  dataPrenotazione: Date | null ;
  durata: Time | null ;
  codice: number ;
  idutente: number | null ;
  idlaboratorio: number | null ;
}
