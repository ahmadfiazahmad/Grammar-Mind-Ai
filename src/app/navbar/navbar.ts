import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <nav class="flex justify-between items-center py-10 w-full max-w-7xl mx-auto">
      <div class="flex flex-col">
        <span class="font-playfair text-[28px] italic font-semibold bg-gradient-to-r from-[#00ffff] to-[#55f0b0] text-transparent bg-clip-text leading-tight">GrammarMind AI</span>
        <span class="text-xs tracking-[1px] uppercase text-[#f0f4f8]/60 mt-[2px]">AI Grammar & Spelling Correction</span>
      </div>
    </nav>
  `,
  host: {
    class: 'block w-full',
  }
})
export class NavbarComponent {}
