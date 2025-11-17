import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { Sensor } from './sensor-data.service';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private readonly apiKey = process.env.API_KEY;

  constructor() {
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    } else {
      console.error('API key for Google GenAI is not set. The AI assistant will be disabled.');
    }
  }

  isConfigured(): boolean {
    return !!this.ai;
  }

  async getAdviceForSensor(sensor: Sensor): Promise<string> {
    if (!this.ai) {
      return Promise.resolve('El servicio de IA no está configurado. Por favor, configure la clave API.');
    }

    const model = 'gemini-2.5-flash';
    const systemInstruction = `Eres un agrónomo experto y consultor agrícola. Tu objetivo es proporcionar consejos claros, concisos y prácticos a los agricultores basados en los datos de los sensores de sus cultivos. Analiza los datos del sensor proporcionados, explica los riesgos potenciales y sugiere pasos concretos para mitigarlos. Responde en español. Formatea tu respuesta usando markdown simple (negritas, listas). No incluyas encabezados.`;
    
    const prompt = `Un sensor para "${sensor.name}" de tipo "${sensor.type}" está reportando un valor de ${sensor.value()}${sensor.unit}. El rango normal está entre ${sensor.normalRange[0]}${sensor.unit} y ${sensor.normalRange[1]}${sensor.unit}. El estado actual es "${sensor.status()}". Por favor, proporciona tu análisis y recomendaciones.`;

    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
        }
      });
      return response.text;
    } catch (error) {
      console.error('Error getting advice from Gemini:', error);
      return 'Hubo un error al contactar al asistente de IA. Por favor, inténtelo de nuevo más tarde.';
    }
  }
}