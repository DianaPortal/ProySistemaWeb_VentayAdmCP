import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {
  private urlApi: string = environment.endpoint + "DashBoard/";

  constructor(private http: HttpClient) { }

  resumen(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Resumen`)
  }
}
