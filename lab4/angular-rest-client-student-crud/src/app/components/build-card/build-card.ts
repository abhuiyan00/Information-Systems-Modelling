import { Component, Input, OnChanges, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Build } from '../../models/build';
import { MediaService } from '../../services/media';

/**
 * Card view of a Build (image + title + badges).
 * Used by the Explore and MyBuilds grids and by the Home dashboard.
 *
 * Lazily fetches media list for the build and uses the first image-MIME
 * file as the cover. Falls back to a coloured-emoji placeholder if no
 * image is attached.
 */
@Component({
  selector: 'app-build-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './build-card.html'
})
export class BuildCardComponent implements OnInit, OnChanges {
  private mediaService = inject(MediaService);
  private platformId = inject(PLATFORM_ID);

  @Input({ required: true }) build!: Build;

  coverUrl: string | null = null;

  ngOnInit(): void {
    this.loadCover();
  }
  ngOnChanges(): void {
    this.loadCover();
  }

  private loadCover(): void {
    if (!this.build?.id) return;
    // Skip on SSR — let the browser hydrate, then fetch real cover URL.
    if (!isPlatformBrowser(this.platformId)) return;
    this.coverUrl = null;
    this.mediaService.list(this.build.id).subscribe({
      next: items => {
        const firstImage = items.find(m => m.mime_type?.startsWith('image/'));
        this.coverUrl = firstImage?.url ?? null;
      },
      error: () => (this.coverUrl = null)
    });
  }

  emoji(): string {
    switch (this.build?.type) {
      case 'drone': return '🚁';
      case 'fixed_wing': return '✈️';
      case 'helicopter': return '🚁';
      case 'boat': return '🛥️';
      case 'car': return '🏎️';
      case 'scale_model': return '🛩️';
      default: return '🛠️';
    }
  }
}
