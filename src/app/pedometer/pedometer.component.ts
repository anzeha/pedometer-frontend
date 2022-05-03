import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-pedometer',
  templateUrl: './pedometer.component.html',
  styleUrls: ['./pedometer.component.css'],
})
export class PedometerComponent implements OnInit, OnDestroy {
  public stepsCount: number = 0;

  constructor(private _webSocketService: WebSocketService) {
    _webSocketService.messages.subscribe((msg) => {
      console.log('Response from websocket: ' + msg);
    });
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
