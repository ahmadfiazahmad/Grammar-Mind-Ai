import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center p-8 space-y-4">
      <div class="relative w-16 h-16">
        <!-- Outer glowing ring -->
        <div class="absolute inset-0 rounded-full border-2 border-[#00ffff]/20 animate-[spin_3s_linear_infinite]"></div>
        
        <!-- Inner spinning ring -->
        <div class="absolute inset-2 rounded-full border-2 border-transparent border-t-[#55f0b0] border-l-[#00ffff] animate-spin"></div>
        
        <!-- Center core -->
        <div class="absolute inset-6 bg-gradient-to-tr from-[#00ffff] to-[#55f0b0] rounded-full animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.5)]"></div>
      </div>
      <p class="text-sm font-medium text-[#55f0b0] animate-pulse font-inter tracking-wide">Enhancing text...</p>
    </div>
  `
})
export class LoadingComponent {}
