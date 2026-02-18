import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService } from '../../core/services/blog.service';
import { BlogPost } from '../../core/data/blog.data';
import { MarkdownService } from '../../core/services/markdown.service';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white dark:bg-stone-950 transition-colors duration-500">
      @if (post()) {
        <!-- Hero -->
        <header
          class="pt-32 pb-16 px-6 relative overflow-hidden border-b border-stone-100 dark:border-stone-800"
        >
          <div
            class="absolute inset-0 opacity-[0.02] pointer-events-none"
            style="background-image: radial-gradient(circle at 1px 1px, #000 1px, transparent 0); background-size: 40px 40px;"
          ></div>

          <div class="max-w-3xl mx-auto relative z-10">
            <!-- Breadcrumb -->
            <nav
              class="flex items-center gap-2 text-xs font-mono text-stone-400 dark:text-stone-500 mb-10"
            >
              <a
                routerLink="/"
                class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >portafolio</a
              >
              <span>/</span>
              <a
                routerLink="/blog"
                class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >jardín</a
              >
              <span>/</span>
              <span class="text-stone-600 dark:text-stone-400 truncate max-w-[200px]">{{
                post()!.slug
              }}</span>
            </nav>

            <!-- Status + Read time -->
            <div class="flex items-center gap-4 mb-6">
              <span
                class="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full border"
                [class]="getStatusClass(post()!.status)"
              >
                {{ getStatusEmoji(post()!.status) }} {{ getStatusLabel(post()!.status) }}
              </span>
              <span class="text-xs font-mono text-stone-400 dark:text-stone-500">
                {{ post()!.readTime }} min lectura
              </span>
              <span class="text-xs font-mono text-stone-400 dark:text-stone-500">
                {{ formatDate(post()!.date) }}
              </span>
            </div>

            <!-- Cover emoji -->
            <div class="text-6xl mb-6">{{ post()!.coverEmoji }}</div>

            <!-- Title -->
            <h1
              class="text-3xl md:text-5xl font-bold text-stone-900 dark:text-stone-50 leading-tight tracking-tight mb-6"
            >
              {{ post()!.title }}
            </h1>

            <!-- Excerpt -->
            <p class="text-lg text-stone-500 dark:text-stone-400 leading-relaxed mb-8">
              {{ post()!.excerpt }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              @for (tag of post()!.tags; track tag) {
                <span
                  class="text-xs px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-full font-mono"
                >
                  {{ tag }}
                </span>
              }
            </div>
          </div>
        </header>

        <!-- Content -->
        <main class="px-6 py-16">
          <div class="max-w-3xl mx-auto">
            <div class="prose-zen" [innerHTML]="safeContent()"></div>

            <!-- Divider -->
            <div
              class="mt-16 pt-10 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between"
            >
              <a
                routerLink="/blog"
                class="inline-flex items-center gap-2 text-sm font-mono text-stone-500 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
              >
                <svg
                  class="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Volver al Jardín
              </a>
              <span class="text-xs font-mono text-stone-300 dark:text-stone-600"
                >// {{ post()!.slug }}</span
              >
            </div>

            <!-- Related posts -->
            @if (relatedPosts().length > 0) {
              <div class="mt-16">
                <h3
                  class="text-xs font-mono text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-6"
                >
                  // También puede interesarte
                </h3>
                <div class="grid sm:grid-cols-2 gap-4">
                  @for (related of relatedPosts(); track related.slug) {
                    <a
                      [routerLink]="['/blog', related.slug]"
                      class="group p-5 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl hover:border-emerald-500/50 transition-all"
                    >
                      <div class="text-2xl mb-2">{{ related.coverEmoji }}</div>
                      <h4
                        class="text-sm font-bold text-stone-800 dark:text-stone-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug"
                      >
                        {{ related.title }}
                      </h4>
                      <p class="text-xs text-stone-400 dark:text-stone-500 mt-1 font-mono">
                        {{ related.readTime }} min
                      </p>
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        </main>
      } @else if (notFound()) {
        <!-- 404 -->
        <div class="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <span class="text-6xl mb-6">🍂</span>
          <h1 class="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3">
            Artículo no encontrado
          </h1>
          <p class="text-stone-500 dark:text-stone-400 mb-8 font-mono text-sm">
            // Este artículo no existe en el jardín
          </p>
          <a
            routerLink="/blog"
            class="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            Volver al Jardín →
          </a>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* Zen prose styles */
      :host ::ng-deep .prose-zen {
        color: #44403c; /* stone-700 */
        line-height: 1.8;
        font-size: 1rem;
      }
      :host ::ng-deep .dark .prose-zen {
        color: #a8a29e; /* stone-400 */
      }
      :host ::ng-deep .prose-zen h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1c1917;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e7e5e4;
      }
      :host ::ng-deep .dark .prose-zen h2 {
        color: #f5f5f4;
        border-bottom-color: #292524;
      }
      :host ::ng-deep .prose-zen p {
        margin-bottom: 1.25rem;
      }
      :host ::ng-deep .prose-zen ul,
      :host ::ng-deep .prose-zen ol {
        margin-bottom: 1.25rem;
        padding-left: 1.5rem;
      }
      :host ::ng-deep .prose-zen li {
        margin-bottom: 0.5rem;
      }
      :host ::ng-deep .prose-zen strong {
        color: #1c1917;
        font-weight: 700;
      }
      :host ::ng-deep .dark .prose-zen strong {
        color: #f5f5f4;
      }
      :host ::ng-deep .prose-zen code {
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
        background: #f5f5f4;
        color: #059669;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
      }
      :host ::ng-deep .dark .prose-zen code {
        background: #292524;
        color: #34d399;
      }
      :host ::ng-deep .prose-zen pre {
        background: #1c1917;
        color: #e7e5e4;
        padding: 1.25rem;
        border-radius: 0.75rem;
        overflow-x: auto;
        margin-bottom: 1.5rem;
        font-size: 0.8rem;
        line-height: 1.7;
      }
      :host ::ng-deep .prose-zen pre code {
        background: transparent;
        color: inherit;
        padding: 0;
      }
      :host ::ng-deep .prose-zen blockquote {
        border-left: 3px solid #10b981;
        padding-left: 1rem;
        margin: 1.5rem 0;
        font-style: italic;
        color: #78716c;
      }
      :host ::ng-deep .dark .prose-zen blockquote {
        color: #a8a29e;
      }
    `,
  ],
})
export class BlogDetailPageComponent implements OnInit, OnDestroy {
  private blogService = inject(BlogService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private markdownService = inject(MarkdownService);
  private platformId = inject(PLATFORM_ID);

  post = signal<BlogPost | null>(null);
  notFound = signal(false);
  safeContent = signal<SafeHtml>('');
  relatedPosts = signal<BlogPost[]>([]);
  private paramSub?: Subscription;

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.loadPost(slug);
    });
  }

  ngOnDestroy() {
    this.paramSub?.unsubscribe();
  }

  private loadPost(slug: string | null) {
    if (!slug) {
      this.notFound.set(true);
      return;
    }

    const found = this.blogService.getBySlug(slug);
    if (!found) {
      this.notFound.set(true);
      return;
    }

    this.post.set(found);
    // Parse Markdown → HTML, then sanitize for safe rendering
    const html = this.markdownService.parse(found.content);
    this.safeContent.set(this.sanitizer.bypassSecurityTrustHtml(html));

    // Related posts: same tags, exclude current
    const related = this.blogService
      .getAll()
      .filter((p) => p.slug !== slug && p.tags.some((t) => found.tags.includes(t)))
      .slice(0, 2);
    this.relatedPosts.set(related);

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getStatusEmoji(status: BlogPost['status']): string {
    switch (status) {
      case 'seed':
        return '🌱';
      case 'growing':
        return '🌿';
      case 'evergreen':
        return '🌲';
    }
  }

  getStatusLabel(status: BlogPost['status']): string {
    switch (status) {
      case 'seed':
        return 'Semilla';
      case 'growing':
        return 'Creciendo';
      case 'evergreen':
        return 'Perenne';
    }
  }

  getStatusClass(status: BlogPost['status']): string {
    switch (status) {
      case 'seed':
        return 'border-amber-300 text-amber-600 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-950/30';
      case 'growing':
        return 'border-emerald-300 text-emerald-600 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/30';
      case 'evergreen':
        return 'border-teal-300 text-teal-600 bg-teal-50 dark:border-teal-700 dark:text-teal-400 dark:bg-teal-950/30';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
