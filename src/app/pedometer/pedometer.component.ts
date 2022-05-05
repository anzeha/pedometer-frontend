import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, of, Subscription } from 'rxjs';
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

  accTrace$: Observable<any> = of(null);

  constructor(private _webSocketService: WebSocketService) {}

  onIP_submit() {
    console.log(this.esp_ip);
  }

  ngOnInit(): void {
    this.accTrace$ = this._webSocketService.messages.pipe(
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
    );
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
