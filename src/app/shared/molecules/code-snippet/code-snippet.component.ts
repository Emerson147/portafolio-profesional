import { Component, signal, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

// ── Token types & colors (VS Code Dark+ palette) ─────────────────────────────
type TType =
  | 'annotation'
  | 'keyword'
  | 'type'
  | 'method'
  | 'string'
  | 'comment'
  | 'bracket'
  | 'variable'
  | 'number'
  | 'operator'
  | 'plain';

interface Token {
  text: string;
  t: TType;
}
interface CodeLine {
  tokens: Token[];
  indent: number;
  speed?: number; // ms to wait before revealing (default 300ms)
}

interface Tab {
  filename: string;
  lang: string;
  lines: CodeLine[];
}

// ── Helper ────────────────────────────────────────────────────────────────────
const k = (text: string): Token => ({ text, t: 'keyword' });
const a = (text: string): Token => ({ text, t: 'annotation' });
const ty = (text: string): Token => ({ text, t: 'type' });
const m = (text: string): Token => ({ text, t: 'method' });
const s = (text: string): Token => ({ text, t: 'string' });
const c = (text: string): Token => ({ text, t: 'comment' });
const br = (text: string): Token => ({ text, t: 'bracket' });
const v = (text: string): Token => ({ text, t: 'variable' });
const pl = (text: string): Token => ({ text, t: 'plain' });
const op = (text: string): Token => ({ text, t: 'operator' });

// ── Java Spring Boot tab ──────────────────────────────────────────────────────
const JAVA_LINES: CodeLine[] = [
  { indent: 0, speed: 120, tokens: [a('@RestController')] },
  {
    indent: 0,
    speed: 120,
    tokens: [a('@RequestMapping'), br('('), s('"/api/v1/portfolio"'), br(')')],
  },
  { indent: 0, speed: 160, tokens: [k('public class '), ty('PortfolioController '), br('{')] },
  { indent: 0, speed: 60, tokens: [] }, // blank
  { indent: 1, speed: 140, tokens: [a('@Autowired')] },
  {
    indent: 1,
    speed: 140,
    tokens: [k('private '), ty('PortfolioService '), v('service'), op(';')],
  },
  { indent: 0, speed: 60, tokens: [] },
  { indent: 1, speed: 120, tokens: [a('@GetMapping'), br('('), s('"/projects"'), br(')')] },
  {
    indent: 1,
    speed: 200,
    tokens: [
      k('public '),
      ty('ResponseEntity'),
      br('<'),
      ty('List'),
      br('<'),
      ty('Project'),
      br('>> '),
      m('getAll'),
      br('() {'),
    ],
  },
  {
    indent: 2,
    speed: 240,
    tokens: [
      k('return '),
      ty('ResponseEntity'),
      op('.'),
      m('ok'),
      br('('),
      v('service'),
      op('.'),
      m('findAll'),
      br('());'),
    ],
  },
  { indent: 1, speed: 80, tokens: [br('}')] },
  { indent: 0, speed: 60, tokens: [] },
  { indent: 1, speed: 100, tokens: [c('// POST /contact — envía mensaje')] },
  { indent: 1, speed: 120, tokens: [a('@PostMapping'), br('('), s('"/contact"'), br(')')] },
  {
    indent: 1,
    speed: 200,
    tokens: [
      k('public '),
      ty('ResponseEntity'),
      br('<'),
      k('void'),
      br('> '),
      m('contact'),
      br('('),
      a('@RequestBody '),
      ty('ContactDto '),
      v('dto'),
      br(') {'),
    ],
  },
  {
    indent: 2,
    speed: 220,
    tokens: [v('service'), op('.'), m('sendMessage'), br('('), v('dto'), br(');')],
  },
  {
    indent: 2,
    speed: 220,
    tokens: [
      k('return '),
      ty('ResponseEntity'),
      op('.'),
      m('accepted'),
      br('().'),
      m('build'),
      br('();'),
    ],
  },
  { indent: 1, speed: 80, tokens: [br('}')] },
  { indent: 0, speed: 80, tokens: [br('}')] },
];

// ── Angular TypeScript tab ────────────────────────────────────────────────────
const TS_LINES: CodeLine[] = [
  { indent: 0, speed: 120, tokens: [a('@Component'), br('({')] },
  { indent: 1, speed: 160, tokens: [v('selector'), op(': '), s("'app-portfolio'"), op(',')] },
  { indent: 1, speed: 140, tokens: [v('standalone'), op(': '), k('true'), op(',')] },
  { indent: 0, speed: 80, tokens: [br('})')] },
  { indent: 0, speed: 60, tokens: [] },
  {
    indent: 0,
    speed: 160,
    tokens: [
      k('export class '),
      ty('PortfolioComponent '),
      k('implements '),
      ty('OnInit '),
      br('{'),
    ],
  },
  { indent: 0, speed: 60, tokens: [] },
  {
    indent: 1,
    speed: 200,
    tokens: [v('projects '), op('= '), m('signal'), br('<'), ty('Project'), br('[]>('), br('[])')],
  },
  { indent: 0, speed: 60, tokens: [] },
  {
    indent: 1,
    speed: 120,
    tokens: [
      k('constructor'),
      br('('),
      k('private '),
      v('api'),
      op(': '),
      ty('PortfolioService'),
      br(') {}'),
    ],
  },
  { indent: 0, speed: 60, tokens: [] },
  { indent: 1, speed: 140, tokens: [m('ngOnInit'), br('(): '), k('void '), br('{')] },
  {
    indent: 2,
    speed: 200,
    tokens: [
      k('this'),
      op('.'),
      v('api'),
      op('.'),
      m('getProjects'),
      br('()'),
      op('.'),
      m('subscribe'),
      br('('),
    ],
  },
  {
    indent: 3,
    speed: 220,
    tokens: [
      v('data'),
      op(' => '),
      k('this'),
      op('.'),
      v('projects'),
      op('.'),
      m('set'),
      br('('),
      v('data'),
      br(')'),
    ],
  },
  { indent: 2, speed: 140, tokens: [br(');')] },
  { indent: 1, speed: 80, tokens: [br('}')] },
  { indent: 0, speed: 80, tokens: [br('}')] },
];

const TABS: Tab[] = [
  { filename: 'PortfolioController.java', lang: 'Java', lines: JAVA_LINES },
  { filename: 'portfolio.component.ts', lang: 'TypeScript', lines: TS_LINES },
];

@Component({
  selector: 'app-code-snippet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #card
      class="relative z-10 rounded-2xl border shadow-2xl overflow-hidden"
      style="background:#0d1117; border-color:rgba(255,255,255,0.07); box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.06);"
    >
      <!-- ① Window chrome -->
      <div
        class="flex items-center gap-2 px-4 py-2.5 border-b"
        style="background:#161b22; border-color:rgba(255,255,255,0.06);"
      >
        <span class="w-3 h-3 rounded-full" style="background:#ff5f57;"></span>
        <span class="w-3 h-3 rounded-full" style="background:#febc2e;"></span>
        <span class="w-3 h-3 rounded-full" style="background:#28c840;"></span>

        <!-- ② Tab bar -->
        <div class="flex ml-3 gap-1">
          @for (tab of TABS; track tab.filename; let i = $index) {
            <button
              class="px-3 py-1 rounded-t text-xs font-mono transition-all duration-200"
              [style.background]="activeTab() === i ? '#0d1117' : 'transparent'"
              [style.color]="activeTab() === i ? '#fafafa' : 'rgba(107,114,128,0.6)'"
              [style.border]="
                activeTab() === i ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent'
              "
              [style.border-bottom]="
                activeTab() === i ? '1px solid #0d1117' : '1px solid transparent'
              "
            >
              <span [style.color]="activeTab() === i ? tabColor(tab.lang) : 'inherit'">●</span>
              &nbsp;{{ tab.filename }}
            </button>
          }
        </div>
      </div>

      <!-- ③ Editor body + Minimap -->
      <div class="flex" style="min-height: 240px;">
        <!-- Code area -->
        <div #codeArea class="flex-1 p-5 font-mono text-xs leading-6 overflow-hidden">
          @for (line of visibleLines(); track $index; let i = $index) {
            <div
              class="code-line flex items-start gap-3 rounded px-1 transition-colors duration-150"
              [style.background]="
                i === visibleLines().length - 1 && isTyping()
                  ? 'rgba(16,185,129,0.04)'
                  : 'transparent'
              "
            >
              <!-- Line number -->
              <span
                class="select-none text-right shrink-0 w-5 tabular-nums"
                style="color: rgba(48,54,61,0.9); font-size:0.65rem; padding-top:1px;"
                >{{ i + 1 }}</span
              >

              <!-- Indentation + tokens -->
              <span
                class="flex-1 flex flex-wrap items-center min-h-[1.5rem]"
                [style.padding-left.ch]="line.indent * 2"
              >
                @for (tok of line.tokens; track $index) {
                  <span [class]="tokenClass(tok.t)">{{ tok.text }}</span>
                }
                <!-- Cursor on last line -->
                @if (i === visibleLines().length - 1 && isTyping()) {
                  <span class="cursor-ibeam ml-0.5">▌</span>
                }
              </span>
            </div>
          }
        </div>

        <!-- ④ Minimap -->
        <div class="w-14 py-5 pr-2 opacity-20 shrink-0 overflow-hidden">
          @for (line of visibleLines(); track $index) {
            <div class="flex gap-0.5 mb-px items-center" [style.padding-left.px]="line.indent * 3">
              @for (tok of minimapTokens(line); track $index) {
                <div
                  class="h-1.5 rounded-sm"
                  [style.width.px]="tok.w"
                  [style.background]="tok.color"
                ></div>
              }
            </div>
          }
        </div>
      </div>

      <!-- ⑤ Status bar -->
      <div
        class="flex items-center justify-between px-4 py-1.5 border-t"
        style="background:#161b22; border-color:rgba(255,255,255,0.05);"
      >
        <div class="flex items-center gap-3 text-xs font-mono" style="color:rgba(107,114,128,0.7);">
          <span class="relative flex h-1.5 w-1.5">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style="background:#10b981;"
            ></span>
            <span
              class="relative inline-flex rounded-full h-1.5 w-1.5"
              style="background:#10b981;"
            ></span>
          </span>
          <span [style.color]="statusColor()">{{ statusText() }}</span>
        </div>
        <div class="flex items-center gap-3 text-xs font-mono" style="color:rgba(107,114,128,0.5);">
          <span>{{ activeLang() }}</span>
          <span>UTF-8</span>
          <span>Ln {{ visibleLines().length }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .cursor-ibeam {
        color: #10b981;
        animation: blink 0.85s step-end infinite;
      }
      @keyframes blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }

      /* Token colors — VS Code Dark+ */
      .t-annotation {
        color: #ffa657;
      }
      .t-keyword {
        color: #ff7b72;
      }
      .t-type {
        color: #79c0ff;
      }
      .t-method {
        color: #d2a8ff;
      }
      .t-string {
        color: #a5d6ff;
      }
      .t-comment {
        color: #6e7681;
        font-style: italic;
      }
      .t-bracket {
        color: #8b949e;
      }
      .t-variable {
        color: #ffa657;
      }
      .t-number {
        color: #79c0ff;
      }
      .t-operator {
        color: #ff7b72;
      }
      .t-plain {
        color: #e6edf3;
      }
    `,
  ],
})
export class CodeSnippetComponent implements OnInit, OnDestroy {
  @ViewChild('card') cardRef!: ElementRef<HTMLDivElement>;
  @ViewChild('codeArea') codeAreaRef!: ElementRef<HTMLDivElement>;

  TABS = TABS;

  visibleLines = signal<CodeLine[]>([]);
  isTyping = signal(true);
  activeTab = signal(0);
  statusText = signal('Initializing...');
  statusColor = signal('#6b7280');
  activeLang = signal(TABS[0].lang);

  private timeouts: ReturnType<typeof setTimeout>[] = [];
  private currentTabIdx = 0;

  ngOnInit() {
    this.startTab(0);
  }

  ngOnDestroy() {
    this.timeouts.forEach((t) => clearTimeout(t));
  }

  // ─── Token class helper ─────────────────────────────────────────────────────
  tokenClass(t: TType): string {
    return `t-${t}`;
  }

  tabColor(lang: string): string {
    return lang === 'Java' ? '#f97316' : '#3b82f6';
  }

  // ─── Minimap tokens ─────────────────────────────────────────────────────────
  minimapTokens(line: CodeLine): { w: number; color: string }[] {
    const colorMap: Record<TType, string> = {
      annotation: '#ffa657',
      keyword: '#ff7b72',
      type: '#79c0ff',
      method: '#d2a8ff',
      string: '#a5d6ff',
      comment: '#6e7681',
      bracket: '#4b5563',
      variable: '#ffa657',
      number: '#79c0ff',
      operator: '#ff7b72',
      plain: '#e6edf3',
    };
    return line.tokens.map((tok) => ({
      w: Math.max(4, Math.min(tok.text.length * 1.4, 18)),
      color: colorMap[tok.t],
    }));
  }

  // ─── Tab lifecycle ───────────────────────────────────────────────────────────
  private startTab(tabIdx: number) {
    this.currentTabIdx = tabIdx;
    this.activeTab.set(tabIdx);
    this.activeLang.set(TABS[tabIdx].lang);
    this.visibleLines.set([]);
    this.isTyping.set(true);
    this.statusText.set('Parsing...');
    this.statusColor.set('rgba(107,114,128,0.7)');

    const lines = TABS[tabIdx].lines;
    let cumulativeDelay = 350;

    lines.forEach((line, i) => {
      const delay = cumulativeDelay;
      const t = setTimeout(() => {
        this.visibleLines.update((curr) => [...curr, line]);

        // Status updates
        const pct = Math.round(((i + 1) / lines.length) * 100);
        if (pct === 30) {
          this.statusText.set('Compiling...');
          this.statusColor.set('#f97316');
        }
        if (pct === 60) {
          this.statusText.set('Building...');
          this.statusColor.set('#38bdf8');
        }
        if (pct === 90) {
          this.statusText.set('Linking...');
          this.statusColor.set('#a78bfa');
        }
      }, delay);
      this.timeouts.push(t);

      cumulativeDelay += line.speed ?? 300;
    });

    // Done
    const doneDelay = cumulativeDelay + 100;
    const td = setTimeout(() => {
      this.isTyping.set(false);
      this.statusText.set(tabIdx === 0 ? 'Build successful ✓' : 'Ready ✓');
      this.statusColor.set('#10b981');

      // Switch to next tab after pause, with fade
      const tn = setTimeout(() => this.fadeToNextTab(), 3500);
      this.timeouts.push(tn);
    }, doneDelay);
    this.timeouts.push(td);
  }

  private fadeToNextTab() {
    const nextIdx = (this.currentTabIdx + 1) % TABS.length;

    // GSAP fade out code area
    if (this.codeAreaRef) {
      gsap.to(this.codeAreaRef.nativeElement, {
        opacity: 0,
        y: -8,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(this.codeAreaRef.nativeElement, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          });
          this.startTab(nextIdx);
        },
      });
    } else {
      this.startTab(nextIdx);
    }
  }
}
