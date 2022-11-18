import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WildersService {
  public connectionState$: BehaviorSubject<number>;

  constructor(private zone: NgZone) {
    this.connectionState$ = new BehaviorSubject<number>(EventSource.CLOSED);
  }

  public getWildersSSE(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      const eventSource: EventSource = new EventSource(
        'http://localhost:8082/api/v1/wilders/get-all-sse'
      );
      eventSource.onmessage = (message) => {
        this.zone.run(() => {
          observer.next(message);
          this.connectionState$.next(eventSource.readyState);
        });
      };
      eventSource.onerror = (error) => {
        this.zone.run(() => {
          this.connectionState$.next(eventSource.readyState);
        });
      };
      return () => {
        eventSource.close();
        this.zone.run(() => {
          this.connectionState$.next(eventSource.readyState);
        });
      };
    });
  }
}
