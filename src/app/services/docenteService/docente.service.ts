import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {PrenotazioneDTO} from '../../models/prenotazione.model';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  private docenteApiPath = `http://localhost:8080/AuleLibere/home/Docente`;

  constructor(private http: HttpClient) { }

  getPrenotazioniDaAccettare(headers: HttpHeaders): Observable<PrenotazioneDTO[]> {
    const url = `${this.docenteApiPath}/getLista`;
    return this.http.get<PrenotazioneDTO[]>(url, { headers: headers });
  }

  accettaPrenotazione(prenotazioneId: number, headers: HttpHeaders): Observable<string> {
    const url = `${this.docenteApiPath}/accettaPrenotazione`;
    return this.http.post(url, prenotazioneId, { headers: headers, responseType: 'text' });
  }
}
