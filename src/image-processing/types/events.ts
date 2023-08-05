export interface MessageEvent {
  data: string | object;
  timestamp?: number;
  id?: string;
  type?: string;
  retry?: number;
}
