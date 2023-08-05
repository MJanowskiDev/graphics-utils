'use client';
import { useEffect, useState } from 'react';
import EventSourcePolyfill from 'eventsource';
import { TokenInputField, OperationTypeSelect } from './components';
import { OperationType } from './types';

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default function SSE() {
  const [events, setEvents] = useState<{ value: string; timestamp: number }[]>(
    [],
  );
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
      const { data, timestamp } = JSON.parse(event.data);
      const entry = { value: data.data, timestamp };
      setEvents((prev) => [...prev, entry]);
    };

    return () => {
      eventSource.close();
    };
  }, [token, selectedOperation]);

  return (
    <div className="mt-20 mx-12">
      <div className="flex flex-row justify-center items-center mb-20">
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

      <ul className=" overflow-y-auto">
        {events
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((event, index) => {
            return (
              <li
                key={`sse-li-${index}`}
                className={`py-2 text-sm text-purple-400`}
              >
                <div className="text-lg font-mono bg-transparent p-2 rounded border border-gray-400 ">
                  <span className="text-purple-600 mr-2">
                    [{formatTime(event.timestamp)}]
                  </span>
                  <span className="text-gray-100">{event.value}</span>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
