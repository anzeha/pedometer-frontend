import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PedometerComponent } from './pedometer/pedometer.component';

import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [PedometerComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [PedometerComponent],
})
export class AppModule {}
