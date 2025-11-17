import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  imports: [CommonModule],
})
export class ThemeSelectorComponent {
  themeService = inject(ThemeService);
  
  selectTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }
}