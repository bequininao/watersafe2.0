
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

  statusClasses: Signal<string> = computed(() => {
    const status = this.sensor().status();
    switch (status) {
      case 'OK':
        return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 ring-green-600/20 dark:ring-green-500/20';
      case 'WARNING':
        return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 ring-yellow-600/20 dark:ring-yellow-500/20';
      case 'ERROR':
        return 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400 ring-red-600/20 dark:ring-red-500/20 animate-pulse';
      default:
        return '';
    }
  });
}