import { Component, ChangeDetectionStrategy, inject, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorDataService, Sensor } from './services/sensor-data.service';
import { SensorCardComponent } from './components/sensor-card/sensor-card.component';
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component';
import { TemperaturePanelComponent } from './components/temperature-panel/temperature-panel.component';
import { HumidityPanelComponent } from './components/humidity-panel/humidity-panel.component';
import { ThemeService } from './services/theme.service';
import { CustomizationPanelComponent } from './components/customization-panel/customization-panel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SensorCardComponent, NotificationPanelComponent, TemperaturePanelComponent, HumidityPanelComponent, CustomizationPanelComponent],
})
export class AppComponent {
  private sensorDataService = inject(SensorDataService);
  // Initialize the theme service to load the user's preference
  private themeService = inject(ThemeService);

  sensors: Signal<Sensor[]> = this.sensorDataService.sensors;

  temperatureSensors: Signal<Sensor[]> = computed(() =>
    this.sensors().filter((sensor) => sensor.type === 'temperature')
  );

  humiditySensors: Signal<Sensor[]> = computed(() =>
    this.sensors().filter((sensor) => sensor.type === 'humidity')
  );

  errorNotifications: Signal<Sensor[]> = computed(() =>
    this.sensors().filter((sensor) => sensor.status() === 'ERROR')
  );
}