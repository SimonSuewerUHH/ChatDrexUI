import {inject, Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {v4 as uuidv4} from 'uuid';
import {Observable, Subject} from 'rxjs';
import {RequestDTO, ResponseDTO} from '../dto/paper-chat';
import {environment} from '../../../../environments/environment';
import {Store} from '@ngrx/store';
import {requestedMessage} from './paper-chat.actions';
import {MessageType} from '../dto/enums';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NedrexAPIInfoDTO} from '../dto/nedrex';

@Injectable({
  providedIn: 'root',
})
export class NedrexService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getInfo(query: string): Observable<NedrexAPIInfoDTO> {
    const params = new HttpParams().set('q', query);
    return this.http.get<NedrexAPIInfoDTO>(`${this.baseUrl}/nedrex/info`, { params });
  }
}
