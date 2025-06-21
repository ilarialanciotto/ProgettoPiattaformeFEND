import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {prenotazioneAule} from '../../models/prenotazioneAuleDTO.model';

@Injectable({
  providedIn: 'root'
})
export class StudenteService {

  private studenteApiPath = `http://localhost:8080/AuleLibere/home/Studente`;

  constructor(private http: HttpClient) {}

  esciDaAula(aulaId: number, headers: HttpHeaders): Observable<string> {
    const url = `${this.studenteApiPath}/Esci`;
    return this.http.post(url, aulaId, { headers: headers, responseType: 'text' });
  }

  controllaCodice(headers: HttpHeaders): Observable<string> {
    const url = `${this.studenteApiPath}/controllaCodice`;
    return this.http.get(url, { headers: headers, responseType: 'text' });
  }

  getPrenotazioniPerAula(aulaId: number, headers: HttpHeaders): Observable<prenotazioneAule[]> {
    const url = `${this.studenteApiPath}/controllaAule`;
    return this.http.post<prenotazioneAule[]>(url, aulaId, { headers: headers });
  }

  segnalaEntrata(aulaId: number, codice: number, headers: HttpHeaders): Observable<string> {
    const url = `${this.studenteApiPath}/Entra`;
    const body = { idAula: aulaId, codice: codice };
    return this.http.post(url, body, { headers: headers, responseType: 'text' });
  }
}
