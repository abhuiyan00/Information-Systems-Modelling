import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Listing, MarketplaceService } from '../../services/marketplace';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './marketplace.html'
})
export class MarketplaceComponent implements OnInit {
  private service = inject(MarketplaceService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  listings: Listing[] = [];
  loading = true;
  statusFilter = '';
  categoryFilter = '';
  creating = false;
  error = '';

  form = this.fb.nonNullable.group({
    title:         ['', Validators.required],
    part_category: ['motor'],
    brand:         [''],
    condition:     ['used'],
    price_pln:     [0, Validators.required],
    description:   ['']
  });

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) { this.loading = false; return; }
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.service.list(this.statusFilter || undefined, this.categoryFilter || undefined).subscribe({
      next: r => { this.listings = r; this.loading = false; },
      error: () => { this.listings = []; this.loading = false; }
    });
  }

  setStatus(s: string): void { this.statusFilter = s; this.reload(); }
  setCategory(c: string): void { this.categoryFilter = c; this.reload(); }
  isLoggedIn(): boolean { return this.auth.isLoggedIn(); }
  toggleCreate(): void { this.creating = !this.creating; this.error = ''; }

  submit(): void {
    if (this.form.invalid) return;
    this.service.create(this.form.getRawValue() as Partial<Listing>).subscribe({
      next: () => { this.creating = false; this.form.reset({
        title: '', part_category: 'motor', brand: '', condition: 'used', price_pln: 0, description: '' }); this.reload(); },
      error: e => (this.error = e?.error?.message ?? 'Could not create listing')
    });
  }

  markSold(id: string): void { this.service.markSold(id).subscribe(() => this.reload()); }
  remove(id: string): void {
    if (!confirm('Delete listing?')) return;
    this.service.delete(id).subscribe(() => this.reload());
  }
}
