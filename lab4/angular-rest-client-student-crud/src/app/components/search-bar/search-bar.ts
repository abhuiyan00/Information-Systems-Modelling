import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuildType } from '../../models/build';

export interface BuildFilters {
  query: string;
  type: BuildType | 'all';
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html'
})
export class SearchBarComponent {
  @Input() filters: BuildFilters = { query: '', type: 'all' };
  @Output() filtersChange = new EventEmitter<BuildFilters>();

  types: { value: BuildType | 'all'; label: string }[] = [
    { value: 'all',         label: 'All types' },
    { value: 'drone',       label: 'Drone' },
    { value: 'fixed_wing',  label: 'Fixed Wing' },
    { value: 'helicopter',  label: 'Helicopter' },
    { value: 'boat',        label: 'Boat' },
    { value: 'car',         label: 'Car' },
    { value: 'scale_model', label: 'Scale Model' },
    { value: 'other',       label: 'Other' }
  ];

  emit(): void {
    this.filtersChange.emit({ ...this.filters });
  }
}
