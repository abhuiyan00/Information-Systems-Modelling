import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Message, MessageService } from '../../services/message';
import { AuthService } from '../../services/auth';
import { DirectoryUser, UserDirectoryService } from '../../services/user-directory';

/**
 * One thread per "other party". Holds the participant info + ordered message
 * list + unread count so the left rail renders without recomputing.
 */
interface Thread {
  otherId: string;
  otherUsername: string;
  messages: Message[];
  lastAt: string;
  unread: number;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html'
})
export class MessagesComponent implements OnInit {
  private messageService = inject(MessageService);
  private directory = inject(UserDirectoryService);
  private auth = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  threads: Thread[] = [];
  selectedThread: Thread | null = null;
  loading = true;
  error = '';
  draft = '';

  // "New conversation" picker state
  showPicker = false;
  pickerQuery = '';
  pickerResults: DirectoryUser[] = [];
  pickerLoading = false;
  private querySubject = new Subject<string>();

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) { this.loading = false; return; }
    this.reload();

    // Debounced typeahead — fires backend search 250 ms after the user stops typing.
    this.querySubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(q => {
        this.pickerLoading = true;
        return this.directory.search(q);
      })
    ).subscribe({
      next: rows => { this.pickerResults = rows; this.pickerLoading = false; },
      error: () => { this.pickerResults = []; this.pickerLoading = false; }
    });
  }

  reload(): void {
    if (!this.auth.isLoggedIn()) { this.loading = false; return; }
    this.messageService.inbox().subscribe({
      next: m => {
        this.threads = this.groupIntoThreads(m);
        // Preserve current selection if the thread still exists, else pick first.
        if (this.selectedThread) {
          const same = this.threads.find(t => t.otherId === this.selectedThread!.otherId);
          this.selectedThread = same ?? this.threads[0] ?? null;
        } else {
          this.selectedThread = this.threads[0] ?? null;
        }
        this.loading = false;
      },
      error: () => { this.threads = []; this.loading = false; }
    });
  }

  /** Bucket flat inbox into per-other-party threads, sorted by recency. */
  private groupIntoThreads(rows: Message[]): Thread[] {
    const me = this.currentUserId();
    const map = new Map<string, Thread>();
    for (const m of rows) {
      const otherId      = m.sender_id === me ? m.recipient_id! : m.sender_id!;
      const otherUser    = m.sender_id === me ? m.recipient_username : m.sender_username;
      if (!otherId) continue;
      let t = map.get(otherId);
      if (!t) {
        t = { otherId, otherUsername: otherUser ?? '(unknown)', messages: [], lastAt: '', unread: 0 };
        map.set(otherId, t);
      }
      t.messages.push(m);
      if (m.recipient_id === me && !m.read) t.unread++;
    }
    // Sort messages chronologically inside each thread, threads by latest activity.
    for (const t of map.values()) {
      t.messages.sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''));
      t.lastAt = t.messages[t.messages.length - 1]?.created_at ?? '';
    }
    return Array.from(map.values()).sort((a, b) => b.lastAt.localeCompare(a.lastAt));
  }

  select(t: Thread): void {
    this.selectedThread = t;
    this.error = '';
    this.draft = '';
  }

  sendReply(): void {
    if (!this.selectedThread || !this.draft.trim()) return;
    const recipient = this.selectedThread.otherId;
    const content = this.draft.trim();
    this.messageService.send(recipient, content).subscribe({
      next: () => { this.draft = ''; this.reload(); },
      error: e => (this.error = e?.error?.message ?? 'Could not send message')
    });
  }

  // ---- Recipient picker (for starting a new conversation) ------------------

  openPicker(): void {
    this.showPicker = true;
    this.pickerQuery = '';
    this.pickerResults = [];
    // Pre-load: empty query returns alphabetical directory (capped to 20).
    this.querySubject.next('');
  }

  closePicker(): void { this.showPicker = false; }

  onPickerInput(q: string): void {
    this.pickerQuery = q;
    this.querySubject.next(q);
  }

  startConversation(u: DirectoryUser): void {
    // If a thread with this user already exists, jump to it. Otherwise create
    // an empty thread in memory so the chat pane renders immediately — the
    // first sendReply() will persist a real message.
    const existing = this.threads.find(t => t.otherId === u.id);
    if (existing) {
      this.selectedThread = existing;
    } else {
      const t: Thread = {
        otherId: u.id, otherUsername: u.username,
        messages: [], lastAt: new Date().toISOString(), unread: 0
      };
      this.threads = [t, ...this.threads];
      this.selectedThread = t;
    }
    this.closePicker();
  }

  // ---- Display helpers used by template ------------------------------------

  isLoggedIn(): boolean { return this.auth.isLoggedIn(); }
  currentUserId(): string | undefined { return this.auth.getCurrentUser()?.id; }

  isMine(m: Message): boolean { return m.sender_id === this.currentUserId(); }

  initials(name: string | undefined): string {
    if (!name) return '?';
    return name.slice(0, 2).toUpperCase();
  }
}
