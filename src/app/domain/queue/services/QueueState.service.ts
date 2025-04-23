import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iQueueResponse } from '@/domain/queue/interfaces/queue.interface';

@Injectable({
  providedIn: 'root',
})
export class QueueStateService {
  private readonly _queueSubject = new BehaviorSubject<iQueueResponse[]>([]);
  public queue$ = this._queueSubject.asObservable();

  updateQueue(queue: iQueueResponse[]): void {
    this._queueSubject.next(queue);
  }
}
