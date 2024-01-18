import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TraitementService {

  constructor(private http:HttpClient) { }

  private httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };


  addDateFicheinter(ssId: number | null, demandeId: number | null,formData: any) {
    return this.http.post(`${environment.baseApiUrl}/api/FicheInter/addFicheInter/${ssId}/${demandeId}`, formData);
  }

}
