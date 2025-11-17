import { Injectable, signal, WritableSignal } from '@angular/core';

export interface Sensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity';
  value: WritableSignal<number>;
  unit: '°C' | '%';
  status: WritableSignal<'OK' | 'WARNING' | 'ERROR'>;
  normalRange: [number, number];
}

@Injectable({
  providedIn: 'root',
})
export class SensorDataService {
  sensors: WritableSignal<Sensor[]> = signal([
    { id: 'temp-gh-tomato', name: 'Invernadero Tomates', type: 'temperature', value: signal(24.5), unit: '°C', status: signal('OK'), normalRange: [21, 27] },
    { id: 'hum-gh-tomato', name: 'Humedad Invernadero', type: 'humidity', value: signal(65), unit: '%', status: signal('OK'), normalRange: [60, 70] },
    { id: 'temp-field-corn', name: 'Campo de Maíz', type: 'temperature', value: signal(26.1), unit: '°C', status: signal('OK'), normalRange: [18, 32] },
    { id: 'hum-soil-corn', name: 'Humedad Suelo Maíz', type: 'humidity', value: signal(62), unit: '%', status: signal('OK'), normalRange: [50, 75] },
    { id: 'temp-silo', name: 'Silo de Grano', type: 'temperature', value: signal(15.0), unit: '°C', status: signal('OK'), normalRange: [10, 20] },
    { id: 'hum-silo', name: 'Humedad Silo', type: 'humidity', value: signal(14), unit: '%', status: signal('OK'), normalRange: [12, 15] },
    { id: 'temp-gh-lettuce', name: 'Invernadero Lechugas', type: 'temperature', value: signal(19.5), unit: '°C', status: signal('OK'), normalRange: [15, 21] },
    { id: 'temp-vineyard', name: 'Viñedo', type: 'temperature', value: signal(25.5), unit: '°C', status: signal('WARNING'), normalRange: [15, 25] },
  ]);

  constructor() {
    setInterval(() => this.updateSensorData(), 2000);
  }

  private updateSensorData(): void {
    this.sensors.update(currentSensors => {
      return currentSensors.map(sensor => {
        // Occasionally, a sensor might fail completely
        if (Math.random() < 0.01 && sensor.status() !== 'ERROR') {
          sensor.status.set('ERROR');
          return sensor;
        }

        // Recover a failed sensor
        if (sensor.status() === 'ERROR' && Math.random() < 0.2) {
           sensor.status.set('OK');
        }

        if (sensor.status() !== 'ERROR') {
            // Simulate value fluctuation
            const change = (Math.random() - 0.5) * (sensor.type === 'temperature' ? 0.5 : 2);
            const newValue = parseFloat((sensor.value() + change).toFixed(1));
            sensor.value.set(newValue);

            // Update status based on value
            const [min, max] = sensor.normalRange;
            const warningMargin = (max - min) * 0.1; // 10% margin for warnings
            if (newValue < min || newValue > max) {
              sensor.status.set('WARNING');
            } else if (newValue < min + warningMargin || newValue > max - warningMargin) {
              // It's in a warning zone but not critical yet
              if (sensor.status() !== 'WARNING') sensor.status.set('OK'); // don't clear existing warnings
            }
            else {
              sensor.status.set('OK');
            }
        }
        
        return sensor;
      });
    });
  }
}