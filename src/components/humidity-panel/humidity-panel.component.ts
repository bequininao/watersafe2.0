import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Sensor } from '../../services/sensor-data.service';

@Component({
  selector: 'app-humidity-panel',
  templateUrl: './humidity-panel.component.html',
  imports: [CommonModule, DecimalPipe],
})
export class HumidityPanelComponent {
  sensors = input.required<Sensor[]>();
}
