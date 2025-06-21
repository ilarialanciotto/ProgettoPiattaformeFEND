import {UtenteDTO} from './utente.model';
import {ContenutoDTO} from './contenuto.model';

export interface AulaDTO {
  id: number;
  cubo: string;
  laboratorio: boolean;
  numeroPosti: number;
  piano: number;
  responsabile : String;
  contenuti? : ContenutoDTO[];
}
