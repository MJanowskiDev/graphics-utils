import { Injectable } from '@nestjs/common';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { MessageEvent } from '../types';

@Injectable()
export class EventsService {
  private eventSubjects = new Map<string, Subject<MessageEvent>>();

  getEventStream(operationId: string): Observable<MessageEvent> {
    const subject = this.eventSubjects.get(operationId) || new Subject();
    this.eventSubjects.set(operationId, subject);

    return subject.asObservable();
  }

  emitEvent(operationId: string, data: MessageEvent): void {
    const subject = this.eventSubjects.get(operationId) || new ReplaySubject();

    this.eventSubjects.set(operationId, subject);
    subject.next({ data, timestamp: Date.now() });
  }

  completeEvent(operationId: string): void {
    const subject = this.eventSubjects.get(operationId);

    if (subject) {
      subject.complete();
      this.eventSubjects.delete(operationId);
    }
  }
}
