import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GrammarService } from '../services/grammar.service';
import { LoadingComponent } from '../loading/loading';
import { ResultComponent } from '../result/result';

@Component({
  selector: 'app-grammar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, LoadingComponent, ResultComponent],
  template: `
    <div class="flex-1 w-full max-w-7xl mx-auto bg-white/[0.03] backdrop-blur-[20px] border border-white/10 rounded-[24px] grid grid-cols-1 lg:grid-cols-2 gap-[1px] bg-clip-padding overflow-hidden">
      
      <!-- Input Section -->
      <div class="relative flex flex-col p-8 lg:border-r lg:border-white/10 bg-[#0a0e1a]/20">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold uppercase tracking-[1.5px] text-[#f0f4f8]/60">Input Text</span>
          <div class="flex gap-4 text-xs text-[#f0f4f8]/60">
            <span>{{ wordCount }} Words</span>
            <span>{{ charCount }} Characters</span>
          </div>
        </div>
        
        <textarea
          [formControl]="textControl"
          placeholder="Paste your text here..."
          class="flex-1 bg-transparent border-none resize-none text-[#f0f4f8] text-base leading-[1.6] outline-none placeholder:text-white/15"
        ></textarea>
        
        <div class="flex items-center justify-end mt-5 pt-5 border-t border-white/5">
          <div class="flex gap-3">
            <button
              (click)="clear()"
              class="px-6 py-2.5 rounded-full border border-white/10 bg-transparent text-[#f0f4f8] text-sm font-semibold hover:-translate-y-0.5 hover:brightness-110 transition-all duration-300 flex items-center gap-2"
            >
              Clear
            </button>
            <button
              (click)="correctGrammar()"
              [disabled]="isLoading() || !textControl.value?.trim()"
              class="px-6 py-2.5 rounded-full bg-gradient-to-br from-[#00ffff] to-[#55f0b0] text-[#0a0e1a] border-none shadow-[0_0_20px_rgba(0,255,255,0.2)] text-sm font-semibold hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
            >
              Correct Grammar
            </button>
          </div>
        </div>
      </div>

      <!-- Output Section -->
      <div class="relative flex flex-col p-8 bg-[#0a0e1a]/20">
        @if (isLoading()) {
          <div class="h-full flex items-center justify-center">
            <app-loading />
          </div>
        } @else if (error()) {
          <div class="h-full flex flex-col items-center justify-center text-center">
            <div class="w-16 h-16 mb-4 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-red-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-red-400 font-inter mb-2">Oops! Something went wrong</h3>
            <p class="text-sm text-red-400/70 font-inter max-w-sm">{{ error() }}</p>
          </div>
        } @else if (correctedText()) {
          <app-result [text]="correctedText()!" />
        } @else {
          <div class="h-full flex flex-col items-center justify-center text-center text-white/20 italic">
            Paste your text here...
          </div>
        }
      </div>

    </div>
  `
})
export class GrammarComponent {
  private grammarService = inject(GrammarService);
  
  textControl = new FormControl('');
  correctedText = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  get wordCount(): number {
    return this.textControl.value?.trim().split(/\s+/).filter(w => w.length > 0).length || 0;
  }

  get charCount(): number {
    return this.textControl.value?.length || 0;
  }

  clear() {
    this.textControl.setValue('');
    this.correctedText.set(null);
    this.error.set(null);
  }

  correctGrammar() {
    const text = this.textControl.value;
    if (!text?.trim()) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.grammarService.correctGrammar(text).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.correctedText) {
          this.correctedText.set(response.correctedText);
        } else {
          this.error.set(response.error || 'Failed to correct grammar');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set('Network error occurred.');
        console.error(err);
      }
    });
  }
}
