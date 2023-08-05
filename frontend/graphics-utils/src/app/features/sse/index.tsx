'use client';
import { useEffect, useState } from 'react';
import EventSourcePolyfill from 'eventsource';
import { TokenInputField, OperationTypeSelect } from './components';
import { OperationType } from './types';

export default function SSE() {
  const [events, setEvents] = useState<MessageEvent[]>([]);
  const [token, setToken] = useState<string>('');
  const [selectedOperation, setSelectedOperation] = useState<OperationType>(
    OperationType.resize,
  );

  useEffect(() => {
    if (!token) return;

    const url = `http://localhost:4005/events/basic-transformations/${selectedOperation}`;
    const headers = { Authorization: `Bearer ${token}` };
    const eventSource = new EventSourcePolyfill(url, { headers });

    eventSource.onmessage = (event: MessageEvent) => {
      console.log(event);
      setEvents((prev) => [...prev, event]);
    };

    return () => {
      eventSource.close();
    };
  }, [token, selectedOperation]);

  return (
    <div className="mt-32 mx-12">
      <div className="flex flex-row justify-center items-center my-4">
        <TokenInputField setToken={setToken} />
        <OperationTypeSelect
          setSelectedOperation={(operation) => {
            setSelectedOperation(operation);
            setEvents([]);
          }}
          selectedOperation={selectedOperation}
        />
      </div>

      <h1 className="text-2xl font-bold mb-2">Server-sent events</h1>

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
