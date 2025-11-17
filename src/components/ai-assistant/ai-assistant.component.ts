import { Component, ChangeDetectionStrategy, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sensor } from '../../services/sensor-data.service';
import { GeminiService } from '../../services/gemini.service';

type AiState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-ai-assistant',
  templateUrl: './ai-assistant.component.html',
  imports: [CommonModule],
})
export class AiAssistantComponent {
  sensors = input.required<Sensor[]>();
  geminiService = inject(GeminiService);

  aiState = signal<AiState>('idle');
  recommendation = signal<string>('');
  
  isServiceConfigured = this.geminiService.isConfigured();

  async getRecommendation() {
    const problematicSensor = this.sensors()[0];
    if (!problematicSensor) {
        this.recommendation.set('No hay problemas detectados en los sensores para analizar.');
        this.aiState.set('success');
        return;
    }

    this.aiState.set('loading');
    this.recommendation.set('');

    try {
      const result = await this.geminiService.getAdviceForSensor(problematicSensor);
      // Basic markdown to HTML conversion
      const formattedResult = result
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // italic
        .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>'); // list items
      this.recommendation.set(formattedResult);
      this.aiState.set('success');
    } catch (e) {
      this.recommendation.set('No se pudo obtener una recomendación del asistente de IA.');
      this.aiState.set('error');
      console.error(e);
    }
  }
}
