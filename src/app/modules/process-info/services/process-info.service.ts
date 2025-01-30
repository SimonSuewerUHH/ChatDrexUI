import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { environment } from '../../../../environments/environment';
import {ProcessInfoDTO} from '../dto/process-info';

@Injectable({
  providedIn: 'root',
})
export class ProcessInfoService {
  private readonly apiUrl = environment.apiBaseUrl + '/project/info';

  processInfoStreamStream(): Observable<ProcessInfoDTO> {
    return new Observable<ProcessInfoDTO>((observer) => {
      const eventSource = new EventSource(`${this.apiUrl}`);

      eventSource.onmessage = (event) => {
        observer.next(JSON.parse(event.data) as ProcessInfoDTO);
      };

      eventSource.onerror = (error) => {
        observer.error('SSE connection error');
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    });
  }

}

