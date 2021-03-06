import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  Observer,
  of,
} from 'rxjs';
import { AnonymousSubject, Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private subject: AnonymousSubject<MessageEvent>;
  _timestamps: Date[] = [];
  _x: number[] = [];
  _y: number[] = [];
  _z: number[] = [];
  _treshold: number[] = [];
  _iter = 0;

  public messages: Subject<{
    x: number[];
    y: number[];
    z: number[];
    treshold: number[];
    timestamps: Date[];
    mainAxis: number;
  }>;

  public step: Subject<number>;

  constructor() {
    this.step = new Subject<number>();
  }

  public createConnection(url: string) {
    return (this.messages = <
      Subject<{
        x: number[];
        y: number[];
        z: number[];
        treshold: number[];
        timestamps: Date[];
        mainAxis: number;
      }>
    >this.connect(url).pipe(
      map(
        (
          response: MessageEvent
        ): {
          x: number[];
          y: number[];
          z: number[];
          treshold: number[];
          timestamps: Date[];
          mainAxis: number;
        } => {
          let data = JSON.parse(response.data);
          // We will show the 20 most recent values

          if (data.event_id == 1) {
            this._timestamps.push(new Date());
            this._x.push(data.accs.x);
            this._y.push(data.accs.y);
            this._z.push(data.accs.z);
            this._treshold.push(data.treshold);
          } else {
            this.step.next(data.steps);
          }

          if (this._y.length > 20) {
            this._x = this._x.slice(1, -1);
            this._y = this._y.slice(1, -1);
            this._z = this._z.slice(1, -1);
            this._treshold = this._treshold.slice(1, -1);
            this._timestamps = this._timestamps.slice(1, -1);
          }
          return {
            x: this._x,
            y: this._y,
            z: this._z,
            timestamps: this._timestamps,
            treshold: this._treshold,
            mainAxis: data.main_axis,
          };
        }
      ),
      catchError((err) => {
        return err;
      })
    ));
  }

  public connect(url: string): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
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
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      },
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}
