import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from './components/site-header/site-header';
import { SiteFooterComponent } from './components/site-footer/site-footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './app.html'
})
export class AppComponent {}
