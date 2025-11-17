import { Component, ChangeDetectionStrategy, input, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sensor } from '../../services/sensor-data.service';

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  imports: [CommonModule],
})
export class HistoryChartComponent {
  sensor = input.required<Sensor>();

  // SVG dimensions
  private width = 100;
  private height = 40;
  private strokeWidth = 2;

  viewBox: Signal<string> = computed(() => `0 0 ${this.width} ${this.height}`);

  strokeColor: Signal<string> = computed(() => {
    return this.sensor().type === 'temperature' ? '#60a5fa' /* blue-400 */ : '#22d3ee' /* cyan-400 */;
  });

  pathData: Signal<string> = computed(() => {
    const history = this.sensor().history();
    if (history.length < 2) {
      return `M 0,${this.height / 2} L ${this.width},${this.height / 2}`; // Flat line if not enough data
    }

    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = (max - min) === 0 ? 1 : max - min; // Avoid division by zero

    const points = history.map((value, index) => {
      // Ensure y is within the drawable area, considering stroke width
      const yPercentage = (value - min) / range;
      const drawableHeight = this.height - (this.strokeWidth * 2);
      const y = (this.height - this.strokeWidth) - (yPercentage * drawableHeight);

      const x = (index / (history.length - 1)) * this.width;
      
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    return `M ${points.join(' L ')}`;
  });
}
