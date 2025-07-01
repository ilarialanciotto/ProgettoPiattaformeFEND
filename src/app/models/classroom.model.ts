import {ContentDTO} from './content.model';

export interface ClassroomDTO {
  id: number;
  cube: string;
  laboratory: boolean;
  numberOfSeats: number;
  floor: number;
  personInCharge : String;
  contents? : ContentDTO[];
}
