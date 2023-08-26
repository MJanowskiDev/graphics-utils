'use client';
import { useEffect, useState } from 'react';
import EventSourcePolyfill from 'eventsource';

import { OperationType } from '../types';

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

interface SSEListenerProps {
  selectedOperation: OperationType;
}

export const SSEListener = ({ selectedOperation }: SSEListenerProps) => {
  const [events, setEvents] = useState<{ value: string; timestamp: number }[]>([]);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/basic-transformations/${selectedOperation}`;
    const eventSource = new EventSourcePolyfill(url, { withCredentials: true });

    eventSource.onmessage = (event: MessageEvent) => {
      const { data, timestamp } = JSON.parse(event.data);
      const entry = { value: data.data, timestamp };
      setEvents((prev) => [...prev, entry]);
    };

    eventSource.onerror = (event: MessageEvent) => {
      console.error(event);
      eventSource?.close();
    };

    return () => {
      eventSource?.close();
    };
  }, [selectedOperation]);

  return (
    <div className="mt-2 flex flex-col items-center max-w-[80%]">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-xl font-bold mb-2">Operation details</h1>
      </div>

      <ul className="overflow-auto p-2 ">
        {events
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((event, index) => {
            return (
              <li key={`sse-li-${index}`} className={`py-2 text-sm text-purple-400`}>
                <div className="text-sm font-mono bg-transparent p-2 rounded border border-gray-400 ">
                  <span className="text-purple-600 mr-2">[{formatTime(event.timestamp)}]</span>
                  <span className="text-gray-100 break-words">{event.value}</span>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
