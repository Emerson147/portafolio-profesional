import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { BlogPost } from '../../core/data/blog.data';

@Component({
  selector: 'app-blog-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white dark:bg-stone-950 transition-colors duration-500">
      <!-- Header -->
      <header class="pt-32 pb-16 px-6 relative overflow-hidden">
        <!-- Dot grid (light) -->
        <div
          class="absolute inset-0 opacity-[0.02] dark:opacity-0 pointer-events-none"
          style="background-image: radial-gradient(circle at 1px 1px, #000 1px, transparent 0); background-size: 40px 40px;"
        ></div>
        <!-- Dot grid (dark) -->
        <div
          class="absolute inset-0 opacity-0 dark:opacity-[0.04] pointer-events-none"
          style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 40px 40px;"
        ></div>

        <div class="max-w-5xl mx-auto relative z-10">
          <!-- Back to home -->
          <a
            routerLink="/"
            class="inline-flex items-center gap-2 text-xs font-mono text-stone-400 dark:text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-10 group"
          >
            <svg
              class="w-3 h-3 group-hover:-translate-x-1 transition-transform"
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
            // volver al portafolio
          </a>

          <div class="flex items-start gap-6">
            <span class="text-5xl md:text-6xl">🌿</span>
            <div>
              <span
                class="text-emerald-600 font-mono font-bold text-xs tracking-widest uppercase mb-3 block"
              >
                // Jardín Digital
              </span>
              <h1
                class="text-4xl md:text-6xl font-bold text-stone-900 dark:text-stone-50 leading-tight tracking-tight"
              >
                Notas &<br />
                <span
                  class="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500"
                  >Reflexiones</span
                >
              </h1>
              <p class="mt-4 text-stone-500 dark:text-stone-400 max-w-xl leading-relaxed">
                Un espacio donde cultivo ideas sobre desarrollo de software, arquitectura y
                aprendizajes del mundo real. Los artículos crecen con el tiempo.
              </p>
            </div>
          </div>

          <!-- Status legend -->
          <div class="flex flex-wrap gap-4 mt-10">
            <div class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span>🌱</span><span class="font-mono">Semilla — idea inicial</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span>🌿</span><span class="font-mono">Creciendo — en desarrollo</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span>🌲</span><span class="font-mono">Perenne — artículo maduro</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Filters & Search -->
      <div class="px-6 pb-8 border-b border-stone-100 dark:border-stone-800">
        <div class="max-w-5xl mx-auto">
          <!-- Search -->
          <div class="relative mb-6">
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar artículos..."
              [value]="searchQuery()"
              (input)="onSearch($event)"
              class="w-full max-w-md pl-11 pr-4 py-3 bg-white/40 dark:bg-[#0a0a0a]/40 backdrop-blur-md border border-stone-200/50 dark:border-white/5 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/60 dark:focus:bg-[#111]/60 transition-all text-sm"
            />
          </div>

          <!-- Tag filters -->
          <div class="flex flex-wrap gap-2">
            <button
              (click)="setActiveTag(null)"
              [class]="
                'px-4 py-1.5 rounded-full text-xs font-mono transition-all backdrop-blur-sm ' +
                (activeTag() === null
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'bg-white/50 dark:bg-[#111]/50 border border-stone-200/50 dark:border-white/5 text-stone-600 dark:text-stone-400 hover:border-emerald-500/30')
              "
            >
              Todos ({{ allPosts().length }})
            </button>
            @for (tag of allTags(); track tag) {
              <button
                (click)="setActiveTag(tag)"
                [class]="
                  'px-4 py-1.5 rounded-full text-xs font-mono transition-all border backdrop-blur-sm ' +
                  (activeTag() === tag
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white/30 dark:bg-transparent border-stone-200/50 dark:border-white/5 text-stone-600 dark:text-stone-400 hover:border-emerald-500/30 hover:bg-white/50 dark:hover:bg-[#111]/50 hover:text-emerald-600 dark:hover:text-emerald-400')
                "
              >
                {{ tag }}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Posts Grid -->
      <main class="px-6 py-16 relative z-10">
        <div class="max-w-5xl mx-auto">
          @if (filteredPosts().length === 0) {
            <div class="text-center py-24">
              <span class="text-5xl mb-4 block">🔍</span>
              <p class="text-stone-500 dark:text-stone-400 font-mono text-sm">
                // No se encontraron artículos
              </p>
            </div>
          } @else {
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (post of filteredPosts(); track post.slug) {
                <article
                  class="group relative bg-white/40 dark:bg-[#0a0a0a]/40 backdrop-blur-md border border-stone-200/50 dark:border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 hover:bg-white/60 dark:hover:bg-[#111]/60 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 cursor-pointer"
                >
                  <!-- Status badge -->
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-2xl">{{ getStatusEmoji(post.status) }}</span>
                    <span class="text-xs font-mono text-stone-400 dark:text-stone-500">
                      {{ post.readTime }} min lectura
                    </span>
                  </div>

                  <!-- Cover emoji -->
                  <div class="text-4xl mb-4">{{ post.coverEmoji }}</div>

                  <!-- Title -->
                  <h2
                    class="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug"
                  >
                    {{ post.title }}
                  </h2>

                  <!-- Excerpt -->
                  <p
                    class="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-4 line-clamp-3"
                  >
                    {{ post.excerpt }}
                  </p>

                  <!-- Tags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    @for (tag of post.tags.slice(0, 3); track tag) {
                      <span
                        class="text-xs px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded font-mono"
                      >
                        {{ tag }}
                      </span>
                    }
                  </div>

                  <!-- Footer -->
                  <div
                    class="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800"
                  >
                    <span class="text-xs text-stone-400 dark:text-stone-500 font-mono">
                      {{ formatDate(post.date) }}
                    </span>
                    <a
                      [routerLink]="['/blog', post.slug]"
                      class="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    >
                      Leer
                      <svg
                        class="w-3 h-3 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>

                  <!-- Invisible full-card link -->
                  <a
                    [routerLink]="['/blog', post.slug]"
                    class="absolute inset-0 rounded-2xl"
                    aria-label="{{ post.title }}"
                  ></a>
                </article>
              }
            </div>

            <p class="text-center text-xs font-mono text-stone-400 dark:text-stone-600 mt-12">
              // {{ filteredPosts().length }} artículo{{ filteredPosts().length !== 1 ? 's' : '' }}
              en el jardín
            </p>
          }
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class BlogListPageComponent implements OnInit {
  private blogService = inject(BlogService);

  allPosts = signal<BlogPost[]>([]);
  allTags = signal<string[]>([]);
  activeTag = signal<string | null>(null);
  searchQuery = signal<string>('');

  filteredPosts = computed(() => {
    let posts = this.allPosts();
    const tag = this.activeTag();
    const query = this.searchQuery().toLowerCase().trim();

    if (tag) {
      posts = posts.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
    }
    if (query) {
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)),
      );
    }
    return posts;
  });

  ngOnInit() {
    this.allPosts.set(this.blogService.getAll());
    this.allTags.set(this.blogService.getAllTags());
  }

  setActiveTag(tag: string | null) {
    this.activeTag.set(tag);
  }

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
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

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
