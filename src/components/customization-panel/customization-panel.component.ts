import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';
import { ThemeService, AccentColor, availableAccentColors } from '../../services/theme.service';

@Component({
  selector: 'app-customization-panel',
  templateUrl: './customization-panel.component.html',
  imports: [CommonModule, ThemeSelectorComponent],
})
export class CustomizationPanelComponent {
  isOpen = signal(false);
  themeService = inject(ThemeService);
  
  availableColors = availableAccentColors;
  currentAccent = this.themeService.accentColor;

  colorPreview: Record<AccentColor, string> = {
    blue: '#3b82f6',
    green: '#22c55e',
    violet: '#8b5cf6',
    orange: '#f97316',
  };

  togglePanel(): void {
    this.isOpen.update(open => !open);
  }

  selectAccent(color: AccentColor): void {
    this.themeService.setAccentColor(color);
  }

  getButtonClasses(color: AccentColor): string {
    const baseClasses = 'h-10 w-10 rounded-full focus:outline-none transition-transform hover:scale-110';
    let ringClasses = '';
    if (this.currentAccent() === color) {
        ringClasses = ` ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900`;
        switch(color) {
            case 'blue': ringClasses += ' ring-blue-500'; break;
            case 'green': ringClasses += ' ring-green-500'; break;
            case 'violet': ringClasses += ' ring-violet-500'; break;
            case 'orange': ringClasses += ' ring-orange-500'; break;
        }
    }
    return `${baseClasses}${ringClasses}`;
  }
}