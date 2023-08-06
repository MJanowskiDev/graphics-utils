import { Controller, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';

import { EventsService } from './events.service';
import { MessageEvent } from '../types';
import { UserOperationEventId } from '../decorators/user-operation-event-id.decorator';

@Controller('/events')
export class EventsController {
  constructor(private eventService: EventsService) {}

  @Sse('basic-transformations/:operationType')
  basicTransformationsEvents(
    @UserOperationEventId() operationId: string,
  ): Observable<MessageEvent> {
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
