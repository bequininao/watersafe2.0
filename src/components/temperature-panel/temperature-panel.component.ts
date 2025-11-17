import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sensor } from '../../services/sensor-data.service';

@Component({
  selector: 'app-temperature-panel',
  templateUrl: './temperature-panel.component.html',
  imports: [CommonModule],
})
export class TemperaturePanelComponent {
  sensors = input.required<Sensor[]>();

  // Define a realistic scale for agricultural temperatures.
  private minTempScale = -10;
  private maxTempScale = 50;

  getTemperatureHeight(temp: number): number {
    const clampedTemp = Math.max(this.minTempScale, Math.min(temp, this.maxTempScale));
    const percentage = ((clampedTemp - this.minTempScale) / (this.maxTempScale - this.minTempScale)) * 100;
    // Ensure the value is strictly between 0 and 100 for CSS height percentage.
    return Math.max(0, Math.min(percentage, 100));
  }

  getTemperatureLiquidColor(temp: number): string {
    // Use a color scale from blue (cold) to red (hot).
    // Mapping range: 0°C to 40°C
    const minColorTemp = 0;
    const maxColorTemp = 40;
    
    const clampedTemp = Math.max(minColorTemp, Math.min(temp, maxColorTemp));

    // Map temperature to HSL hue value (240 for blue, 0 for red)
    const hue = 240 - ((clampedTemp - minColorTemp) / (maxColorTemp - minColorTemp)) * 240;
    
    return `hsl(${hue}, 85%, 55%)`;
  }
}
