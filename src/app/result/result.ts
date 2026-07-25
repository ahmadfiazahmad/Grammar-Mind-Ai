import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <div class="flex flex-col h-full relative">
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-semibold uppercase tracking-[1.5px] text-[#f0f4f8]/60">Corrected Result</span>
        
        <span class="bg-[#55f0b0]/10 text-[#55f0b0] px-3 py-1 rounded-full text-[11px] font-semibold">High Confidence</span>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div class="text-[#f0f4f8] text-base leading-[1.6] whitespace-pre-wrap font-inter">
          {{ text() }}
        </div>
      </div>
      
      <div class="flex items-center justify-end mt-5 pt-5 border-t border-white/5">
        <button 
          (click)="copyToClipboard()"
          class="px-6 py-2.5 rounded-full border border-white/10 bg-transparent text-[#f0f4f8] text-sm font-semibold hover:-translate-y-0.5 hover:brightness-110 transition-all duration-300 flex items-center gap-2"
        >
          {{ copyStatus() }}
        </button>
      </div>

      @if (showToast()) {
        <div class="absolute bottom-6 right-6 bg-[#55f0b0] text-[#0a0e1a] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 opacity-90 shadow-lg animate-[fade-in_0.2s_ease-out]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
          Copied to clipboard
        </div>
      }
    </div>
  `
})
export class ResultComponent {
  text = input.required<string>();
  
  copyStatus = signal<string>('Copy Result');
  showToast = signal<boolean>(false);

  get charCount(): number {
    return this.text()?.length || 0;
  }

  get wordCount(): number {
    return this.text()?.trim().split(/\s+/).filter(w => w.length > 0).length || 0;
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.text());
      this.copyStatus.set('Copied!');
      this.showToast.set(true);
      setTimeout(() => {
        this.copyStatus.set('Copy Result');
        this.showToast.set(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      this.copyStatus.set('Failed to copy');
      setTimeout(() => this.copyStatus.set('Copy Result'), 2000);
    }
  }
}
