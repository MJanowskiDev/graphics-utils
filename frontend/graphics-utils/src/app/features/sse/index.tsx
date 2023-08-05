'use client';
import { useEffect, useState } from 'react';

export default function SSE() {
  const [events, setEvents] = useState<MessageEvent[]>([]);

  useEffect(() => {
    const url = 'http://localhost:4005/events/basic-transformations';
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      setEvents((prev) => [...prev, event]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="mt-32 mx-12">
      <h1 className="text-xl mb-2">Server-sent events</h1>
      <ul className=" max-h-[300px] overflow-y-auto">
        {events
          .sort((a, b) => b.timeStamp - a.timeStamp)
          .map((event: MessageEvent, index) => {
            return (
              <li
                key={`sse-li-${index}`}
                className={`py-2 text-sm ${
                  index === 0 ? 'text-purple-400 font-bold' : 'text-gray-200'
                }`}
              >
                {JSON.parse(event.data).data}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
