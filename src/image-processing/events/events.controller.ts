import { Controller, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';

import { EventsService } from './events.service';
import { MessageEvent } from '../types';

@Controller('/events')
export class EventsController {
  constructor(private eventService: EventsService) {}

  @Sse('basic-transformations')
  basicTransformationsEvents(): Observable<MessageEvent> {
    const operationId = 'hello-world';
    const subject = this.eventService.getEventStream(operationId);

    return new Observable<MessageEvent>((observer) => {
      const subscription = subject.subscribe({
        next: (data) => observer.next({ data }),
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });

      return () => {
        subscription.unsubscribe();
        this.eventService.completeEvent(operationId);
      };
    });
  }
}
