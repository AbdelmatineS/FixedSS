import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SousTraitantService {

  constructor(private http:HttpClient) { }

  private httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };

  addDateDemandeinter(formData: any) {
    return this.http.post(`${environment.baseApiUrl}/api/DemandeInter/addDateDemandeInter`, formData);
  }

  getAllDemandeinter() {
    return this.http.get(`${environment.baseApiUrl}/api/DemandeInter/retrieveallDemandeInter`);
  }

  searchDemandeinter(attribute: string, query: string) {
    const url = `${environment.baseApiUrl}/api/DemandeInter/search?attribute=${attribute}&query=${query}`;
    return this.http.get(url);
  }

  
  retrieveDemandeInterById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.baseApiUrl}/api/DemandeInter/retrieveDemandeInter/${id}`);
  }

  updateDatePlanif(demandeId: number | null, newDatePlanif: string): Observable<any> {
    const url = `${environment.baseApiUrl}/api/DemandeInter/updateDatePlanif/${demandeId}`;
    const params = new HttpParams().set('newDatePlanif', newDatePlanif);

    return this.http.put(url, null, { params });
    //return this.http.put(url, body);
  }
  
}
