import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {AulaDTO} from '../../models/aula.model';
import {FeedbackDTO} from '../../models/feedback.model';
import {UtenteDTO} from '../../models/utente.model';
import {JwtResponse} from '../../models/jwt-response.model';
import {LoggedInUser} from '../../models/loggedUser.model';
import {PrenotazioneDTO} from '../../models/prenotazione.model';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  private currentUserSubject: BehaviorSubject<LoggedInUser | null>;
  currentUser$: Observable<LoggedInUser | null>;
  private apiBasePath = 'http://localhost:8080/AuleLibere/home';

  constructor(private http: HttpClient) {
    const storedUserString = localStorage.getItem('loggedInUser');
    const initialUser: LoggedInUser | null = storedUserString ? JSON.parse(storedUserString) : null;
    this.currentUserSubject = new BehaviorSubject<LoggedInUser | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  registrazione(utente: UtenteDTO): Observable<string> {
    const url = `${this.apiBasePath}/auth/registrazione`;
    return this.http.post(url, utente, { responseType: 'text' });
  }

  login(utente: UtenteDTO): Observable<JwtResponse> {
    const url = `${this.apiBasePath}/auth/login`;
    return this.http.post<JwtResponse>(url, utente).pipe(
      tap(res => {
        if (res && res.jwt && res.username && res.ruolo) {
          localStorage.setItem('token', res.jwt);
          const userData: LoggedInUser = { username: res.username, ruolo: res.ruolo };
          localStorage.setItem('loggedInUser', JSON.stringify(userData));
          this.currentUserSubject.next(userData);
        } else {
          this.logout();
        }
      })
    );
  }

  aggiornaDati(dati: { email: string, password: string }, headers: HttpHeaders): Observable<string> {
    const url = `${this.apiBasePath}/aggiornaDati`;
    return this.http.post(url, dati, { headers: headers, responseType: 'text' });
  }

  getPrenotazioni(headers: HttpHeaders): Observable<PrenotazioneDTO[]> {
    const url = `${this.apiBasePath}/getPrenotazioni`;
    return this.http.get<PrenotazioneDTO[]>(url, { headers: headers });
  }

  delete(idPrenotazione: number, headers: HttpHeaders): Observable<string> {
    const url = `${this.apiBasePath}/delete`;
    return this.http.post(url, idPrenotazione, { headers: headers, responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuleLibere(headers: HttpHeaders): Observable<AulaDTO[]> {
    const url = `${this.apiBasePath}/getLista`;
    return this.http.get<AulaDTO[]>(url, { headers: headers });
  }

  prenotaLaboratorio(prenotazioneData: any, headers: HttpHeaders): Observable<string> {
    const url = `${this.apiBasePath}/prenota`;
    return this.http.post(url, prenotazioneData, { headers: headers, responseType: 'text' });
  }

  inviaFeedback(feedback: FeedbackDTO, headers: HttpHeaders): Observable<string> {
    const url = `${this.apiBasePath}/feedback`;
    return this.http.post(url, feedback, { headers: headers, responseType: 'text' });
  }
}
