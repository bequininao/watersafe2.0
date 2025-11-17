
import { Component, ChangeDetectionStrategy, input, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sensor } from '../../services/sensor-data.service';
import { HistoryChartComponent } from '../history-chart/history-chart.component';

@Component({
  selector: 'app-sensor-card',
  templateUrl: './sensor-card.component.html',
  imports: [CommonModule, HistoryChartComponent],
})
export class SensorCardComponent {
  sensor = input.required<Sensor>();

  statusClasses: Signal<{ [key: string]: boolean }> = computed(() => {
    const status = this.sensor().status();
    return {
      'bg-green-500/10 text-green-400 ring-green-500/20': status === 'OK',
      'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20': status === 'WARNING',
      'bg-red-500/10 text-red-400 ring-red-500/20 animate-pulse': status === 'ERROR',
    };
  });

  statusTextClasses: Signal<{ [key: string]: boolean }> = computed(() => {
    const status = this.sensor().status();
    return {
      'text-green-400': status === 'OK',
      'text-yellow-400': status === 'WARNING',
      'text-red-400': status === 'ERROR',
    };
  });
}