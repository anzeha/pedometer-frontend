import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PedometerComponent } from './pedometer/pedometer.component';

import { environment } from 'src/environments/environment';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PedometerComponent],
  imports: [BrowserModule, NgChartsModule, FormsModule],
  providers: [],
  bootstrap: [PedometerComponent],
})
export class AppModule {}
