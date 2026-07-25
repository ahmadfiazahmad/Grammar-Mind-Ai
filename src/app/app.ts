import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
import { GrammarComponent } from './grammar/grammar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, GrammarComponent],
  template: `
    <div class="min-h-screen bg-[#0a0e1a] text-[#f0f4f8] font-inter overflow-x-hidden relative" style="background-image: radial-gradient(circle at 0% 0%, rgba(0,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(85,240,176,0.08) 0%, transparent 40%);">
      <div class="relative z-10 flex flex-col min-h-screen px-4 sm:px-10 pb-10">
        <app-navbar />
        
        <main class="flex-1 w-full flex flex-col">
          <app-grammar />
        </main>
      </div>
    </div>
  `
})
export class App {}
