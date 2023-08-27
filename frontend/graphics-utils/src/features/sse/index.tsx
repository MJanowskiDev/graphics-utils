'use client';
import { useEffect, useState } from 'react';
import EventSourcePolyfill from 'eventsource';

import { OperationTypeSelect } from './components';
import { OperationType } from './types';

import { Button } from '@/shared/ui';

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default function SSE() {
  const [events, setEvents] = useState<{ value: string; timestamp: number }[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [recreateConnection, setRecreateConnection] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<OperationType>(OperationType.resize);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/basic-transformations/${selectedOperation}`;
    const eventSource = new EventSourcePolyfill(url, { withCredentials: true });

    eventSource.onopen = () => {
      console.log('connected');
      setIsConnected(true);
    };

    eventSource.onmessage = (event: MessageEvent) => {
      const { data, timestamp } = JSON.parse(event.data);
      const entry = { value: data.data, timestamp };
      setEvents((prev) => [...prev, entry]);
    };

    eventSource.onerror = (event: MessageEvent) => {
      console.error(event);
      eventSource?.close();
      setIsConnected(false);
    };

    return () => {
      eventSource?.close();
      setIsConnected(false);
    };
  }, [selectedOperation, recreateConnection]);

  return (
    <div className="mt-12 mx-12 w-full">
      <div className="flex flex-row justify-center items-center mb-20">
        <OperationTypeSelect
          setSelectedOperation={(operation) => {
            setSelectedOperation(operation);
            setEvents([]);
          }}
          selectedOperation={selectedOperation}
        />
      </div>

      <div className="flex flex-row  w-full justify-between">
        <h1 className="text-2xl font-bold mb-2">Server-sent events</h1>
        <div className="flex flex-row items-center gap-2">
          <p className="text-gray-500 mr-2">{isConnected ? 'connected' : 'not connected'}</p>
          <Button onClick={() => setRecreateConnection((prev) => !prev)}>Re-connect</Button>
        </div>
      </div>

      <ul className=" overflow-y-auto">
        {events
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((event, index) => {
            return (
              <li key={`sse-li-${index}`} className={`py-2 text-sm text-purple-400`}>
                <div className="text-lg font-mono bg-transparent p-2 rounded border border-gray-400 ">
                  <span className="text-purple-600 mr-2">[{formatTime(event.timestamp)}]</span>
                  <span className="text-gray-100">{event.value}</span>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
