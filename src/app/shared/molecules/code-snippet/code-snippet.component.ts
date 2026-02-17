import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CodeLine {
  text: string;
  indent: number;
  type: 'keyword' | 'class' | 'type' | 'string' | 'comment' | 'method' | 'bracket' | 'annotation';
}

@Component({
  selector: 'app-code-snippet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative z-10 bg-linear-to-br from-slate-900 to-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-2xl shadow-emerald-500/10 card-3d hover:shadow-emerald-500/20 transition-all duration-500"
    >
      <!-- Window Controls + Filename -->
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/50">
        <div class="flex items-center gap-2">
          <div
            class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"
          ></div>
          <div
            class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"
          ></div>
          <div
            class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"
          ></div>
        </div>
        <div class="flex items-center gap-2 text-slate-400 text-xs">
          <span class="text-emerald-400">●</span>
          <span>MigatteProfile.java</span>
        </div>
      </div>

      <!-- Animated Code -->
      <div class="font-mono text-xs md:text-sm space-y-1 min-h-[200px]">
        @for (line of visibleLines(); track $index) {
          <div
            class="flex items-start code-line"
            [style.padding-left.px]="line.indent * 16"
            [class.animate-fade-in]="$index === visibleLines().length - 1"
          >
            <span class="text-slate-600 select-none w-6 text-right mr-4">{{ $index + 1 }}</span>
            <span [class]="getTypeClass(line.type)">{{ line.text }}</span>
          </div>
        }

        <!-- Typing cursor -->
        @if (isTyping()) {
          <div class="flex items-center" [style.padding-left.px]="currentIndent() * 16">
            <span class="text-slate-600 select-none w-6 text-right mr-4">{{
              visibleLines().length + 1
            }}</span>
            <span class="typing-cursor w-2 h-4 bg-emerald-400 animate-pulse"></span>
          </div>
        }
      </div>

      <!-- Status Badge -->
      <div
        class="absolute -bottom-4 -right-4 bg-linear-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
      >
        <span class="relative flex h-2 w-2">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span class="font-bold text-sm">{{ statusText() }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .card-3d {
        transform-style: preserve-3d;
      }
      .code-line {
        transition: all 0.3s ease;
      }
      .code-line:hover {
        background: rgba(255, 255, 255, 0.02);
      }
      .animate-fade-in {
        animation: fadeSlideIn 0.3s ease-out;
      }
      @keyframes fadeSlideIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .typing-cursor {
        animation: blink 0.8s infinite;
      }
      @keyframes blink {
        0%,
        50% {
          opacity: 1;
        }
        51%,
        100% {
          opacity: 0;
        }
      }
    `,
  ],
})
export class CodeSnippetComponent implements OnInit, OnDestroy {
  private intervalId: any;
  private currentLineIndex = 0;

  visibleLines = signal<CodeLine[]>([]);
  isTyping = signal(true);
  currentIndent = signal(0);
  statusText = signal('Compiling...');

  private allLines: CodeLine[] = [
    { text: '@Service', indent: 0, type: 'annotation' },
    { text: 'public class MigatteProfile {', indent: 0, type: 'keyword' },
    { text: '', indent: 0, type: 'bracket' },
    { text: 'String role = "Full Stack Dev";', indent: 1, type: 'string' },
    { text: 'String[] stack = {"Java", "Angular"};', indent: 1, type: 'string' },
    { text: '', indent: 0, type: 'bracket' },
    { text: 'public void buildFuture() {', indent: 1, type: 'method' },
    { text: '// Transformando ideas en código', indent: 2, type: 'comment' },
    { text: 'this.learn().code().deploy();', indent: 2, type: 'method' },
    { text: '}', indent: 1, type: 'bracket' },
    { text: '}', indent: 0, type: 'bracket' },
  ];

  ngOnInit() {
    this.startTypingAnimation();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startTypingAnimation() {
    // Small delay before starting
    setTimeout(() => {
      this.intervalId = setInterval(() => {
        if (this.currentLineIndex < this.allLines.length) {
          const nextLine = this.allLines[this.currentLineIndex];
          this.currentIndent.set(nextLine.indent);
          this.visibleLines.update((lines) => [...lines, nextLine]);
          this.currentLineIndex++;

          // Update status based on progress
          if (this.currentLineIndex === 4) {
            this.statusText.set('Building...');
          } else if (this.currentLineIndex === 7) {
            this.statusText.set('Almost done...');
          }
        } else {
          this.isTyping.set(false);
          this.statusText.set('Ready! 🚀');
          clearInterval(this.intervalId);

          // Restart animation after a pause
          setTimeout(() => this.restartAnimation(), 5000);
        }
      }, 400);
    }, 1000);
  }

  private restartAnimation() {
    this.currentLineIndex = 0;
    this.visibleLines.set([]);
    this.isTyping.set(true);
    this.statusText.set('Compiling...');
    this.startTypingAnimation();
  }

  getTypeClass(type: CodeLine['type']): string {
    const classes: Record<string, string> = {
      keyword: 'text-purple-400 font-semibold',
      class: 'text-yellow-300 font-bold',
      type: 'text-cyan-400',
      string: 'text-emerald-400',
      comment: 'text-slate-500 italic',
      method: 'text-blue-400',
      bracket: 'text-slate-400',
      annotation: 'text-yellow-500',
    };
    return classes[type] || 'text-slate-300';
  }
}
