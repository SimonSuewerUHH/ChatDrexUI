import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NetdrexAPIInfoDTO} from '../dto/nedrex';

@Injectable({
  providedIn: 'root',
})
export class NedrexService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getInfo(query: string): Observable<NetdrexAPIInfoDTO> {
    const params = new HttpParams().set('q', query);
    return this.http.get<NetdrexAPIInfoDTO>(`${this.baseUrl}/nedrex/info`, {params});
  }
}
