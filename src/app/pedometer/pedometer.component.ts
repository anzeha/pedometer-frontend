import { Component } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ChartOptions } from 'chart.js';
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-pedometer',
  templateUrl: './pedometer.component.html',
  styleUrls: ['./pedometer.component.css'],
})
export class PedometerComponent {
  public stepsCount: number = 0;
  esp_ip: string = 'espWebSock.local';
  connected: boolean = false;
  loading: boolean = false;
  errorConnecting: boolean = false;
  mainAxis: string = '';
  accTrace$: Observable<any> = of(null);
  stepsCounter: number = 0;
  constructor(private _webSocketService: WebSocketService) {}

  onIP_submit() {
    let url = 'ws://'.concat(this.esp_ip).concat(':81');
    console.log(`Attempting to connecto to: ${url}`);
    this.loading = true;
    this.accTrace$ = this._webSocketService.createConnection(url).pipe(
      map((data) => {
        this.loading = false;
        this.connected = true;
        this.errorConnecting = false;
        if (data.mainAxis == 0) this.mainAxis = 'X';
        if (data.mainAxis == 2) this.mainAxis = 'Y';
        if (data.mainAxis == 4) this.mainAxis = 'Z';
        return {
          datasets: [
            {
              data: data.x,
              label: 'X',
            },
            {
              data: data.y,
              label: 'Y',
            },
            {
              data: data.z,
              label: 'Z',
            },
            {
              data: data.treshold,
              label: 'Treshold',
              borderColor: 'green',
            },
          ],
          labels: data.timestamps,
        };
      }),
      catchError((err) => {
        console.log('Error connecting to ESP8266');
        //console.log(err);
        this.loading = false;
        this.errorConnecting = true;
        return of(err);
      })
    );
    this._webSocketService.step.subscribe((data) => {
      this.stepsCount++;
    });
  }

  ngOnInit(): void {
    /* this.accTrace$ = this._webSocketService.messages.pipe(
      map((data) => {
        return {
          datasets: [
            {
              data: data.x,
              label: 'X',
            },
            {
              data: data.y,
              label: 'Y',
            },
            {
              data: data.z,
              label: 'Z',
            },
            {
              data: data.treshold,
              label: 'Treshold',
            },
          ],
          labels: data.timestamps,
        };
      })
    ); */
  }
  options: ChartOptions = {
    animation: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'second',
        },
      },
      y: {
        min: -1.5,
        max: 1.5,
      },
    },
  };
}
