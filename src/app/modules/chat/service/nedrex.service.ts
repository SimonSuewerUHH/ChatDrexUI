import {inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NedrexAPIInfoDTO} from '../dto/nedrex';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NedrexService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getInfo(query: string): Observable<NedrexAPIInfoDTO> {
    const params = new HttpParams().set('q', query);
    return this.http.get<NedrexAPIInfoDTO>(`${this.baseUrl}/nedrex/info`, {params});
  }

  embeddingsAvailable(): Observable<boolean> {
    return this.http.get<Response>(`${this.baseUrl}/nedrex/embeddings-available`, {observe: 'response'}).pipe(
      map(response => response.status === 200),
      catchError(() => of(false))
    );
  }


}
