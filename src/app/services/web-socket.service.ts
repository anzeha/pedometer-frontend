import { Injectable } from '@angular/core';
import { map, Observable, Observer } from 'rxjs';
import { AnonymousSubject, Subject } from 'rxjs/internal/Subject';
import { webSocket } from 'rxjs/webSocket';

const CHAT_URL = 'ws://10.10.0.41:81';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private subject: AnonymousSubject<MessageEvent>;
  public messages: Subject<any>;

  constructor() {
    this.messages = <Subject<any>>this.connect(CHAT_URL).pipe(
      map((response: MessageEvent): any => {
        console.log(response.data);
        //let data = JSON.parse(response.data);
        return response.data;
      })
    );
  }

  public connect(url: string): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Successfully connected: ' + url);
    }
    return this.subject;
  }

  private create(url: string): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      error: null,
      complete: null,
      next: (data: Object) => {
        console.log('Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      },
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}
