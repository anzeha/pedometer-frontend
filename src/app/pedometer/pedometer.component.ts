import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/services/web-socket.service';
import {
  ChartOptions,
  ChartType,
  ChartData,
  ChartDataset,
  ChartConfiguration,
} from 'chart.js';
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-pedometer',
  templateUrl: './pedometer.component.html',
  styleUrls: ['./pedometer.component.css'],
})
export class PedometerComponent {
  public stepsCount: number = 0;
  esp_ip: string = '';
  connected: boolean = false;
  loading: boolean = false;
  accTrace$: Observable<any> = of(null);

  constructor(private _webSocketService: WebSocketService) {}

  onIP_submit() {
    let url = 'ws://'.concat(this.esp_ip).concat(':81');
    console.log(`Attempting to connecto to: ${url}`);
    this.loading = true;
    this.accTrace$ = this._webSocketService.createConnection(url).pipe(
      map((data) => {
        this.loading = false;
        this.connected = true;
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
      }),
      catchError((err) => {
        console.log('Error connecting to ESP8266');
        console.log(err);
        return err;
      })
    );
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
    },
  };
}
