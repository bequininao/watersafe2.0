
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sensor } from '../../services/sensor-data.service';

@Component({
  selector: 'app-notification-panel',
  templateUrl: './notification-panel.component.html',
  imports: [CommonModule],
})
export class NotificationPanelComponent {
  notifications = input.required<Sensor[]>();
}
