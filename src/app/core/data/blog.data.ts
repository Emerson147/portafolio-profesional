export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown string (Obsidian-compatible)
  tags: string[];
  date: string; // ISO date string
  readTime: number; // minutes
  status: 'seed' | 'growing' | 'evergreen';
  coverEmoji?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'arquitectura-microservicios-spring-boot',
    title: 'Arquitectura de Microservicios con Spring Boot',
    excerpt:
      'Cómo diseñar, implementar y desplegar microservicios robustos con Spring Boot, Docker y un API Gateway. Lecciones aprendidas en producción.',
    status: 'evergreen',
    tags: ['Java', 'Spring Boot', 'Microservicios', 'Docker'],
    date: '2025-01-15',
    readTime: 12,
    coverEmoji: '☕',
    content: `
## ¿Por qué Microservicios?

Cuando un monolito crece más allá de cierto punto, el costo de cada cambio se dispara. Los microservicios resuelven esto dividiendo la aplicación en servicios pequeños, independientes y desplegables por separado.

> "Un microservicio debe hacer una sola cosa, y hacerla bien." — Principio de Responsabilidad Única aplicado a la arquitectura.

## La Estructura Base

Para un sistema de gestión empresarial, dividí los servicios de la siguiente manera:

- **auth-service** — JWT, roles y permisos.
- **inventory-service** — Gestión de productos y stock.
- **sales-service** — Procesamiento de ventas y POS.
- **report-service** — Generación de reportes asíncronos.
- **api-gateway** — Spring Cloud Gateway como punto de entrada único.

## Comunicación entre Servicios

Usé dos patrones de comunicación:

- **Síncrona (REST/Feign):** Para operaciones que necesitan respuesta inmediata, como validar stock antes de una venta.
- **Asíncrona (RabbitMQ):** Para eventos como "venta completada" que disparan la actualización de inventario y la generación de reportes.

## Dockerización

Cada servicio tiene su propio \`Dockerfile\` y todos se orquestan con \`docker-compose.yml\`. El truco clave es usar **multi-stage builds** para reducir el tamaño de la imagen final:

\`\`\`dockerfile
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
\`\`\`

## Lecciones Aprendidas

- El **service discovery** (Eureka) es esencial cuando tienes más de 3 servicios.
- Los **circuit breakers** (Resilience4j) evitan cascadas de fallos.
- La **trazabilidad distribuida** (Zipkin) es imprescindible para debuggear.
- Empieza con un monolito modular y migra a microservicios cuando realmente lo necesites.
    `,
  },
  {
    slug: 'angular-signals-reactive-state',
    title: 'Angular Signals: El Futuro del Estado Reactivo',
    excerpt:
      'Signals llegaron para cambiar cómo manejamos el estado en Angular. Menos boilerplate, mejor rendimiento y una DX superior a RxJS para casos simples.',
    status: 'growing',
    tags: ['Angular', 'TypeScript', 'Signals', 'Frontend'],
    date: '2025-02-01',
    readTime: 8,
    coverEmoji: '⚡',
    content: `
## El Problema con el Estado en Angular

Antes de Signals, manejar estado en Angular significaba elegir entre \`BehaviorSubject\` de RxJS (poderoso pero verboso) o simplemente mutar propiedades del componente (simple pero sin reactividad granular).

## ¿Qué son los Signals?

Un Signal es un wrapper reactivo alrededor de un valor. Cuando el valor cambia, Angular sabe exactamente qué partes del DOM necesitan actualizarse — sin necesidad de Zone.js ni change detection completo.

\`\`\`typescript
// Antes (con BehaviorSubject)
private _count = new BehaviorSubject(0);
count$ = this._count.asObservable();
increment() { this._count.next(this._count.value + 1); }

// Ahora (con Signals)
count = signal(0);
increment() { this.count.update(v => v + 1); }
\`\`\`

## computed() y effect()

Los dos compañeros inseparables de \`signal()\`:

- **computed()** — Deriva un valor de uno o más signals. Se recalcula automáticamente cuando sus dependencias cambian.
- **effect()** — Ejecuta código como efecto secundario cuando un signal cambia. Ideal para sincronizar con localStorage o APIs externas.

\`\`\`typescript
// computed: precio con descuento
price = signal(100);
discount = signal(0.2);
finalPrice = computed(() => this.price() * (1 - this.discount()));

// effect: persistir en localStorage
theme = signal('dark');
constructor() {
  effect(() => localStorage.setItem('theme', this.theme()));
}
\`\`\`

## ¿Cuándo usar Signals vs RxJS?

- ✅ **Signals:** Estado local del componente, UI state, formularios simples.
- ✅ **RxJS:** Streams de eventos, HTTP con operadores complejos (debounce, switchMap), WebSockets.
- 🔄 **Ambos:** \`toSignal()\` y \`toObservable()\` permiten interoperabilidad.

## Mi Experiencia

Migré este portafolio a Signals y la diferencia en legibilidad es notable. El código es más declarativo y el bundle final es más pequeño porque Angular puede hacer tree-shaking más agresivo sin Zone.js.
    `,
  },
  {
    slug: 'ci-cd-github-actions-docker',
    title: 'CI/CD con GitHub Actions y Docker: De Cero a Producción',
    excerpt:
      'Un pipeline completo de integración y despliegue continuo usando GitHub Actions, Docker Hub y un VPS. Automatiza tu flujo de trabajo como un profesional.',
    status: 'seed',
    tags: ['DevOps', 'Docker', 'GitHub Actions', 'CI/CD'],
    date: '2025-02-10',
    readTime: 10,
    coverEmoji: '🚀',
    content: `
## El Objetivo

Cada vez que hago \`git push\` a \`main\`, quiero que automáticamente se ejecuten los tests, se construya la imagen Docker, se publique en Docker Hub y se despliegue en el servidor. Sin intervención manual.

## Estructura del Pipeline

El workflow de GitHub Actions tiene 3 jobs:

1. **test** — Ejecuta los tests unitarios con Maven.
2. **build-and-push** — Construye la imagen Docker y la sube a Docker Hub.
3. **deploy** — Se conecta al VPS por SSH y hace \`docker pull\` + \`docker-compose up -d\`.

\`\`\`yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '21', distribution: 'temurin' }
      - run: mvn test

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_TOKEN }}
      - run: |
          docker build -t migattedev/myapp:latest .
          docker push migattedev/myapp:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          script: |
            docker pull migattedev/myapp:latest
            docker-compose -f /opt/myapp/docker-compose.yml up -d
\`\`\`

## Secrets en GitHub

Nunca hardcodees credenciales. Usa **GitHub Secrets** (Settings → Secrets and variables → Actions) para almacenar: \`DOCKER_USERNAME\`, \`DOCKER_TOKEN\`, \`VPS_HOST\`, \`VPS_USER\`, \`VPS_SSH_KEY\`.

## Estado: 🌱 Semilla

Este artículo está en desarrollo. Próximamente añadiré: rollback automático en caso de fallo, notificaciones a Slack/Discord, y estrategias de despliegue blue-green.
    `,
  },
  {
    slug: 'documentacion-completa-del-sistema',
    title: 'MigatteDev Portfolio — Documentación Completa del Sistema',
    excerpt:
      'Referencia técnica completa: arquitectura Atomic Design, sistema de diseño Minimalismo Zen, componentes, servicios, animaciones, dark mode e i18n.',
    status: 'evergreen',
    tags: ['Angular', 'TypeScript', 'Arquitectura', 'Frontend'],
    date: '2025-02-23',
    readTime: 25,
    coverEmoji: '📝',
    content: `
    # 📖 MigatteDev Portfolio — Documentación Completa del Sistema

> **Referencia técnica y de diseño** para estudio y reutilización en futuros proyectos.
> Última actualización: Febrero 2026

---

## Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Arquitectura del Proyecto](#3-arquitectura-del-proyecto)
4. [Sistema de Diseño — Minimalismo Zen](#4-sistema-de-diseño--minimalismo-zen)
5. [Componentes del Sistema](#5-componentes-del-sistema)
6. [Servicios Core](#6-servicios-core)
7. [Capa de Datos](#7-capa-de-datos)
8. [Patrones y Técnicas Modernas](#8-patrones-y-técnicas-modernas)
9. [Animaciones y Scroll Reveal](#9-animaciones-y-scroll-reveal)
10. [Dark Mode](#10-dark-mode)
11. [Internacionalización (i18n)](#11-internacionalización-i18n)
12. [SEO y Rendimiento](#12-seo-y-rendimiento)
13. [Guía de Referencia Rápida](#13-guía-de-referencia-rápida)

---

## 1. Visión General

### ¿Qué es?

Portfolio profesional de desarrollo Full Stack. Una SPA (Single Page Application) que sirve como carta de presentación profesional, mostrando proyectos, stack tecnológico, metodología de trabajo y formulario de contacto.

### Filosofía

**"Minimalismo Zen"** — Cada elemento visual tiene un propósito. Nada es decorativo por accidente. El diseño transmite:

- **Precisión técnica** (font-mono, code snippets)
- **Calma visual** (palette stone/emerald, espaciado generoso)
- **Interactividad sutil** (micro-animaciones, no distracciones)

---

## 2. Stack Tecnológico

### Core

| Tecnología       | Versión | Propósito                                           |
| ---------------- | ------- | --------------------------------------------------- |
| **Angular**      | 21.0.0  | Framework frontend (standalone components, signals) |
| **TypeScript**   | 5.x     | Tipado estático                                     |
| **Tailwind CSS** | 4.1.18  | Utility-first CSS framework                         |
| **GSAP**         | 3.14.2  | Animaciones complejas (hero, loading screen)        |

### Herramientas

| Herramienta                          | Propósito                 |
| ------------------------------------ | ------------------------- |
| \`@angular/build\`                     | Build system (esbuild)    |
| \`angular-cli-ghpages\`                | Deploy a GitHub Pages     |
| Google Fonts (Inter, JetBrains Mono) | Tipografía                |
| Material Symbols Outlined            | Iconografía (servicios)   |
| Formspree                            | Backend-less contact form |

### ¿Por qué esta combinación?

\`\`\`
Angular 21 + Standalone Components
  → Sin NgModules → imports explícitos → tree-shaking perfecto

Tailwind CSS 4 + PostCSS
  → Utility-first → sin CSS custom gigante
  → Dark mode via class strategy (html.dark)

GSAP via CDN (solo donde se necesita)
  → Hero timeline + Loading screen
  → No añade peso al bundle principal
  → Las secciones individuales usan IntersectionObserver + CSS transitions

Signals (no RxJS para UI state)
  → Más simple, más performante → signal(), computed()
  → RxJS solo para HTTP (ContactService)
\`\`\`

---

## 3. Arquitectura del Proyecto

### Estructura de Directorios

\`\`\`
src/app/
├── app.ts                    # Root component
├── app.config.ts             # Providers (router, httpClient)
├── app.routes.ts             # Lazy routes
├── app.css                   # Global styles + utilities
│
├── core/                     # Singleton services + datos
│   ├── services/             # 7 services (providedIn: 'root')
│   │   ├── gsap.service.ts
│   │   ├── theme.service.ts
│   │   ├── translate.service.ts
│   │   ├── contact.service.ts
│   │   ├── blog.service.ts
│   │   ├── markdown.service.ts
│   │   └── project.service.ts
│   ├── data/                 # Datos estáticos tipados
│   │   ├── icons.data.ts
│   │   ├── tech-icons.data.ts
│   │   ├── projects.data.ts
│   │   ├── navigation.data.ts
│   │   ├── blog.data.ts
│   │   └── tech-stack.data.ts
│   └── i18n/                 # Traducciones
│       ├── es.ts
│       └── en.ts
│
├── layouts/                  # Layout wrappers
│   └── main-layout/
│
├── pages/                    # Route-level components
│   ├── home/                 # → HomePageComponent
│   └── blog/                 # → BlogListPage, BlogDetailPage
│
└── shared/                   # Reutilizables (Atomic Design)
    ├── atoms/                # badge, button, icon, logo
    ├── molecules/            # boot-log-entry, code-snippet, nav-link, tech-card
    └── organisms/            # 12 secciones de la homepage
        ├── navbar/
        ├── loading-screen/
        ├── hero-section/
        ├── about-section/
        ├── process-section/
        ├── stack-section/
        ├── services-section/
        ├── projects-section/
        ├── project-detail-modal/
        ├── testimonials-section/
        ├── contact-section/
        └── footer/
\`\`\`

### Patrón: Atomic Design

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│  Atoms     → badge, button, icon, logo                       │
│              Unidades mínimas. No tienen lógica de negocio.  │
├──────────────────────────────────────────────────────────────┤
│  Molecules → code-snippet, nav-link, tech-card               │
│              Combinan atoms. Pueden tener estado mínimo.     │
├──────────────────────────────────────────────────────────────┤
│  Organisms → hero-section, stack-section, projects-section   │
│              Secciones completas con lógica, datos y layout. │
├──────────────────────────────────────────────────────────────┤
│  Pages     → HomePageComponent, BlogListPageComponent        │
│              Componen organisms + layout para una ruta.      │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### Routing — Lazy Loading

\`\`\`typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page.component').then((m) => m.HomePageComponent), // ← lazy loaded
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog/blog-list-page.component').then((m) => m.BlogListPageComponent),
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./pages/blog/blog-detail-page.component').then((m) => m.BlogDetailPageComponent),
  },
  { path: '**', redirectTo: '' },
];
\`\`\`

**Patrón clave:** \`loadComponent\` (no \`loadChildren\`). Cada ruta carga un solo standalone component. Resultado: el bundle inicial solo contiene el router y el root component.

---

## 4. Sistema de Diseño — Minimalismo Zen

### Paleta de Colores

\`\`\`
╔══════════════════════════════════════════╗
║  SUPERFICIES                             ║
║  Light: bg-white, bg-stone-50/100        ║
║  Dark:  bg-stone-900, bg-stone-950       ║
╠══════════════════════════════════════════╣
║  TEXTO                                   ║
║  Primary:   text-stone-900 / dark:50     ║
║  Secondary: text-stone-600 / dark:400    ║
║  Muted:     text-stone-400 / dark:500    ║
║  Mono:      text-stone-500 (font-mono)   ║
╠══════════════════════════════════════════╣
║  ACENTOS                                 ║
║  Primary:   emerald-600 / dark:400       ║
║  Gradient:  emerald → teal → cyan        ║
║  Per-category accents:                   ║
║    Backend  → #f97316 (orange)           ║
║    Frontend → #dd0031 (angular red)      ║
║    Cloud    → #38bdf8 (sky blue)         ║
║    Methods  → #a78bfa (purple)           ║
║    Rust     → #14b8a6 (teal)             ║
╚══════════════════════════════════════════╝
\`\`\`

### Tipografía

\`\`\`css
/* index.html */
body {
  font-family: 'Inter', system-ui, sans-serif;
}
.font-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}
\`\`\`

| Uso           | Font           | Weight         | Ejemplo                             |
| ------------- | -------------- | -------------- | ----------------------------------- |
| Headings      | Inter          | 700-900 (bold) | \`text-3xl font-bold\`                |
| Body text     | Inter          | 400            | \`text-sm leading-relaxed\`           |
| Labels / Code | JetBrains Mono | 400-700        | \`font-mono text-xs tracking-widest\` |

### Espaciado — Ritmo Vertical

Cada sección sigue el mismo esquema:

\`\`\`
py-24 md:py-32              ← padding vertical
max-w-7xl mx-auto px-6      ← contenedor centrado
mb-14                        ← gap header → content
gap-5 / gap-6                ← grid gaps
\`\`\`

### Sección Header Pattern (consistente en todo el site)

\`\`\`html
<div class="mb-14 [class]-reveal">
  <!-- Label mono -->
  <span
    class="text-emerald-600 dark:text-emerald-400 font-mono font-bold
               text-xs tracking-widest uppercase mb-3 block"
  >
    // Label
  </span>
  <!-- Title + decorative line -->
  <h2
    class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50
             flex items-center gap-4 tracking-tight"
  >
    Título <span class="text-emerald-600 dark:text-emerald-400">Acento</span>
    <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-700"></span>
  </h2>
  <!-- Subtitle -->
  <p class="text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed">
    Descripción breve.
  </p>
</div>
\`\`\`

### Background Patterns

1. **Dot Grid (Light):** \`radial-gradient(#000 1px, transparent 1px)\` con \`opacity: [0.03-0.06]\`
2. **Dot Grid (Dark):** \`radial-gradient(#fff 1px, transparent 1px)\` con \`dark:opacity\` swap
3. **Blueprint Grid:** \`linear-gradient\` en ambos ejes (usado en contact y projects)
4. **Ambient Glow:** Divs \`blur-3xl\` con \`emerald/4\` o \`emerald/5\` posicionados absolute

### Micro-interacciones Estándar

| Interacción              | Implementación                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Hover card → border glow | \`hover:border-color-mix(accent 30%)\` via CSS custom property \`--accent\`                    |
| Hover card → shadow      | \`hover:shadow-xl hover:shadow-accent/8\`                                                    |
| Hover card → lift        | \`hover:-translate-y-1\`                                                                     |
| Hover text → accent      | \`group-hover:text-emerald-600 dark:group-hover:text-emerald-400\`                           |
| 3D tilt (mouse)          | \`perspective(800-900px) rotateX(±8°) rotateY(±8°)\` — disabled on touch (\`pointer: coarse\`) |
| Button press             | \`active:scale-95\`                                                                          |

---

## 5. Componentes del Sistema

### Homepage Flow (orden de renderizado)

\`\`\`
HomePageComponent
├── LoadingScreenComponent     # Deploy pipeline animation (GSAP)
├── MainLayoutComponent        # Wrapper con .main-container
│   ├── NavbarComponent        # Fixed top, scroll-aware, theme/lang toggle
│   ├── HeroSectionComponent   # Parallax blobs, GSAP text reveal, CTA
│   ├── AboutSectionComponent  # Stats counters, tech pills, SVG icons
│   ├── ProcessSectionComponent# Zigzag timeline, 4 steps, scroll reveal
│   ├── StackSectionComponent  # 2x2 grid, progress bars, tilt cards
│   ├── ServicesSectionComponent # 3x2 grid, Material Symbols icons
│   ├── ProjectsSectionComponent # Filter pills, blueprint hover, modal
│   │   └── ProjectDetailModalComponent
│   ├── TestimonialsSectionComponent # 3-col, 3D tilt, quote marks
│   ├── ContactSectionComponent     # 2-col (info sidebar + form)
│   └── FooterComponent             # Headline CTA + social links
\`\`\`

### Detalle por Componente

#### 🚀 LoadingScreenComponent

- **Qué hace:** Simula un pipeline CI/CD (Build → Lint → Test → Bundle → Deploy)
- **Tech:** GSAP timeline, progress bar, commit metadata
- **Pattern:** \`(loadingComplete)\` output event notifica a HomePage para revelar contenido
- **Duración:** ~4 segundos

#### 🏠 HeroSectionComponent

- **Qué hace:** Sección principal con nombre, título, CTAs y code snippet
- **Tech:** GSAP (animateHero), parallax via \`(mousemove)\`, CodeSnippetComponent
- **Features:** Animated gradient headline, tech stack pills, scroll indicator

#### 👤 AboutSectionComponent

- **Qué hace:** Bio, stats animados (2+ años, 15+ proyectos), tech pills con SVG icons
- **Tech:** IntersectionObserver, counter animation con \`setInterval\`
- **Features:** Category-specific accent colors, DomSanitizer para SVGs

#### 🔄 ProcessSectionComponent

- **Qué hace:** 4 pasos de metodología en zigzag con timeline central
- **Layout:** Desktop: \`grid-cols-[1fr_56px_1fr]\` zigzag. Mobile: vertical left-border
- **Tech:** IntersectionObserver, timeline height animation, stagger delays
- **Features:** Numbered dots en timeline, SVG icons por step, hover glow per-category

#### 🛠 StackSectionComponent

- **Qué hace:** 4 categorías de tech en grid 2x2 con progress bars
- **Tech:** IntersectionObserver, animated progress bars, counter animation
- **Features:** 3D tilt (±6°), per-category accent via \`--accent\` CSS custom property, dot level indicators, featured tags con micro SVG icons

#### 💼 ServicesSectionComponent

- **Qué hace:** 6 servicios en grid 3x2
- **Tech:** Material Symbols Outlined (Google Fonts), IntersectionObserver stagger
- **Features:** Per-service accent colors, feature pills que cambian color en hover, \`--card-accent\` para hover border/shadow

#### 📂 ProjectsSectionComponent

- **Qué hace:** Filtro por tecnología, cards con blueprint hover effect, modal de detalle
- **Tech:** Signals (\`activeFilter\`, \`computed\` → \`filteredProjects\`, \`uniqueTechs\`), IntersectionObserver
- **Features:** Status badges, tech icons en tags, impact metrics (hover reveal), image overlay (hover)

#### 💬 TestimonialsSectionComponent

- **Qué hace:** 3 testimonios en grid
- **Tech:** IntersectionObserver stagger, 3D tilt (±8°), touch device guard
- **Features:** Quote mark decorativa, avatar con iniciales, hover accent line (bottom border animation)

#### 📧 ContactSectionComponent

- **Qué hace:** 2 columnas: info sidebar (email, GitHub, LinkedIn, availability) + formulario
- **Tech:** Reactive Forms, ContactService (Formspree), IntersectionObserver
- **Features:** Floating labels (peer-placeholder-shown), submit states (idle/loading/success/error), i18n

#### 🦶 FooterComponent

- **Qué hace:** Headline CTA + download CV + social links + bottom bar
- **Tech:** IntersectionObserver stagger, i18n
- **Features:** Mailto CTA primario, download PDF secundario, version badge

---

## 6. Servicios Core

### ThemeService — Dark Mode

\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(false);

  constructor() {
    // Prioridad: localStorage > sistema operativo
    const stored = localStorage.getItem('zen-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(stored ? stored === 'dark' : prefersDark);
  }

  toggle() {
    this.applyTheme(!this.isDark());
  }

  private applyTheme(dark: boolean) {
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('zen-theme', dark ? 'dark' : 'light');
  }
}
\`\`\`

**Patrón:** Signal + \`<html class="dark">\` + \`localStorage\` persistencia.

### TranslateService — i18n

\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class TranslateService {
  lang = signal<Lang>('es');
  t = computed<Translations>(() => (this.lang() === 'es' ? es : en));

  constructor() {
    const stored = localStorage.getItem('zen-lang');
    // fallback a browser language
    this.lang.set(stored || navigator.language.startsWith('es') ? 'es' : 'en');
  }

  toggle() {
    const next = this.lang() === 'es' ? 'en' : 'es';
    this.lang.set(next);
    localStorage.setItem('zen-lang', next);
    document.documentElement.lang = next; // SEO
  }
}
\`\`\`

**Patrón:** \`computed()\` que reactivamente cambia el objeto de traducciones. Templates usan \`{{ i18n.t().section.key }}\`.

### GsapService — Animaciones Globales

\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class GsapService {
  // Carga GSAP + ScrollTrigger + ScrollToPlugin via CDN
  loadGsap(): Promise<void> { ... }

  // animaciones:
  revealMainContainer()    // fade in .main-container
  animateHero()            // timeline: .hero-reveal stagger
  setupScrollTriggers()    // .gs-reveal → scroll-triggered fade in
  scrollTo(target)         // smooth scroll to section
}
\`\`\`

**Patrón:** CDN loading (no bundle), usado SOLO en:

- \`LoadingScreenComponent\` (pipeline timeline)
- \`HeroSectionComponent\` (text reveal)
- \`NavbarComponent\` (smooth scroll)
- \`HomePageComponent\` (coordinator)

Todas las **secciones de contenido** usan \`IntersectionObserver\` + CSS transitions en su lugar.

### ContactService — Formulario

\`\`\`typescript
// Formspree integration via HttpClient
sendMessage(data: ContactForm): Observable<boolean>
\`\`\`

---

## 7. Capa de Datos

### Datos Estáticos Tipados

Toda la data del portfolio vive en \`core/data/\` como objetos TypeScript tipados. **No hay base de datos ni API** (excepto Formspree para contacto).

| Archivo              | Contenido                                                | Tipo exportado                                      |
| -------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| \`icons.data.ts\`      | SVG strings para UI icons + project visuals + tech icons | \`ICONS\`, \`PROJECT_VISUALS\`, \`TECH_ICONS\`            |
| \`tech-icons.data.ts\` | SVGs branded (Java, Spring Boot, etc.)                   | \`TECH_ICONS\` (duplicado, usado por tech-stack.data) |
| \`projects.data.ts\`   | Proyectos con slug, tags, metrics, gallery               | \`Project[]\`                                         |
| \`navigation.data.ts\` | Links de navegación                                      | \`NavigationItem[]\`                                  |
| \`blog.data.ts\`       | Artículos de blog                                        | \`BlogPost[]\`                                        |
| \`tech-stack.data.ts\` | Stack overview data                                      | \`TechStackItem[]\`                                   |

**Patrón clave:** Type-safe SVG icons:

\`\`\`typescript
export const TECH_ICONS = {
  'Spring Boot': \`<svg ...>...</svg>\`,
  Angular: \`<svg ...>...</svg>\`,
  // ...
} as const;

export type TechIconName = keyof typeof TECH_ICONS;
// → 'Spring Boot' | 'Angular' | 'Docker' | ...
\`\`\`

Uso en componentes:

\`\`\`typescript
getSafeTechIcon(iconName: keyof typeof TECH_ICONS): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(TECH_ICONS[iconName] || '');
}
\`\`\`

---

## 8. Patrones y Técnicas Modernas

### 8.1 Standalone Components (Angular 21)

\`\`\`typescript
@Component({
  selector: 'app-stack-section',
  standalone: true, // ← sin NgModule
  imports: [CommonModule], // ← imports explícitos
  template: \`...\`,
  styles: [\`...\`], // ← inline styles
})
export class StackSectionComponent {}
\`\`\`

**Ventajas:**

- Tree-shaking perfecto (solo se incluye lo importado)
- No hay SharedModule monolítico
- Cada componente declara sus dependencias

### 8.2 Signals para Estado Reactivo

\`\`\`typescript
// Signal simple (estado local)
isDark = signal<boolean>(false);
activeFilter = signal<string>('all');
submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

// Computed (derivado, se actualiza automáticamente)
filteredProjects = computed(() => {
  const filter = this.activeFilter();
  return filter === 'all' ? this.projects : this.projects.filter((p) => p.tags.includes(filter));
});

// Signal update (método funcional)
this.animatedStats.update((s) => {
  const updated = [...s];
  updated[index] = { ...updated[index], currentValue: Math.floor(current) };
  return updated;
});
\`\`\`

**Cuándo usar Signals vs RxJS:**

- \`signal()\` → estado de UI, toggles, filtros, counters
- \`RxJS Observable\` → HTTP requests, streams de datos

### 8.3 Control Flow Moderno (@for, @if)

\`\`\`html
<!-- Antes (NgFor) -->
<div *ngFor="let item of items">{{ item.name }}</div>

<!-- Después (@for con track) -->
@for (item of items; track item.name; let i = $index) {
<div>{{ item.name }}</div>
}

<!-- @if con @else -->
@if (submitStatus() === 'success') {
<div>¡Enviado!</div>
} @else {
<form>...</form>
}
\`\`\`

**Ventajas:** Mejor performance, track expression obligatorio (evita re-renders), no necesita importar directivas.

### 8.4 inject() Pattern

\`\`\`typescript
// Antes (constructor injection)
constructor(private sanitizer: DomSanitizer, private platformId: Object) { }

// Después (inject function)
private sanitizer  = inject(DomSanitizer);
private platformId = inject(PLATFORM_ID);
\`\`\`

**Ventaja:** Más limpio, composable (se puede usar en funciones fuera de la clase), elimina la necesidad de \`@Inject()\`.

### 8.5 CSS Custom Properties para Temas Dinámicos

\`\`\`html
<div [style.--accent]="category.accentColor">
  <!-- El hover border/shadow usa la variable -->
</div>
\`\`\`

\`\`\`css
.stack-card:hover {
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  box-shadow: 0 8px 32px color-mix(in srgb, var(--accent) 8%, transparent);
}
\`\`\`

**Patrón:** Cada card recibe su accent color via \`[style.--accent]\`. Los pseudoestados CSS leen la variable. Resultado: un solo CSS rule para N colores diferentes.

### 8.6 DomSanitizer para SVG Inline

\`\`\`typescript
// Renderizar SVG strings de forma segura en Angular
getIcon(name: keyof typeof ICONS): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(ICONS[name] ?? '');
}
\`\`\`

\`\`\`html
<span [innerHTML]="getIcon('github')"></span>
\`\`\`

**¿Por qué no \`<img>\` o font icons?**

- SVG inline se colorea con \`currentColor\` → se adapta al tema
- No requiere peticiones HTTP extra
- Se puede estilizar con CSS del parent (color, size, opacity)

---

## 9. Animaciones y Scroll Reveal

### Dos Sistemas Complementarios

\`\`\`
┌─────────────────────────────────────────┐
│  GSAP (CDN)                             │
│  Usado para:                             │
│  • Loading screen pipeline              │
│  • Hero text reveal timeline            │
│  • Smooth scroll navigation             │
│  • Floating card animation              │
│  Razón: Secuencias complejas, timelines │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  IntersectionObserver + CSS Transitions │
│  Usado para:                             │
│  • Todas las secciones de contenido     │
│  • Card stagger reveals                 │
│  • Progress bar animations              │
│  • Counter animations                   │
│  Razón: Ligero, nativo, consistente     │
└─────────────────────────────────────────┘
\`\`\`

### Patrón IntersectionObserver (template reutilizable)

\`\`\`typescript
// TypeScript
private observer: IntersectionObserver | null = null;

ngAfterViewInit() {
  if (!isPlatformBrowser(this.platformId)) return;  // SSR guard
  this.setupObserver();
}

ngOnDestroy() {
  this.observer?.disconnect();  // cleanup
}

private setupObserver() {
  this.observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');   // trigger CSS transition
        this.observer?.unobserve(entry.target);  // run once
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  requestAnimationFrame(() => {
    document.querySelectorAll('#section .section-reveal, #section .section-card')
      .forEach(el => this.observer?.observe(el));
  });
}
\`\`\`

\`\`\`css
/* CSS */
.section-reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}
.section-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
\`\`\`

\`\`\`html
<!-- HTML stagger via transition-delay -->
<div class="section-card" [style.transition-delay.ms]="i * 100"></div>
\`\`\`

### Timing Constants

| Elemento        | Duration  | Delay (stagger)   | Ease                      |
| --------------- | --------- | ----------------- | ------------------------- |
| Header reveal   | 0.6s      | —                 | ease                      |
| Card reveal     | 0.5-0.55s | 70-130ms per card | ease-out                  |
| Progress bar    | 0.9s      | 60ms per bar      | cubic-bezier(0.4,0,0.2,1) |
| Timeline line   | 1.6s      | —                 | cubic-bezier(0.4,0,0.2,1) |
| 3D tilt apply   | 0.08-0.1s | —                 | linear                    |
| 3D tilt release | 0.4-0.45s | —                 | ease                      |

---

## 10. Dark Mode

### Implementación

\`\`\`
1. ThemeService → signal \`isDark\` + toggle
2. <html class="dark"> se toglea via DOM
3. Tailwind \`dark:\` variant en cada elemento
4. Persistencia en localStorage (\`'zen-theme'\`)
5. Fallback a \`prefers-color-scheme: dark\`
\`\`\`

### Checklist Dark Mode por Componente

Cada componente debe tener:

\`\`\`html
<!-- Superficies -->
bg-white → dark:bg-stone-900 (o 950 para mayor contraste) bg-stone-50 → dark:bg-stone-800
border-stone-100 → dark:border-stone-700

<!-- Texto -->
text-stone-900 → dark:text-stone-50 text-stone-600 → dark:text-stone-400 text-stone-500 →
dark:text-stone-400/500

<!-- Acentos -->
text-emerald-600 → dark:text-emerald-400 bg-emerald-50 → dark:bg-emerald-900/20-30

<!-- Backgrounds patterns (DOBLE dot grid) -->
<div class="opacity-[0.04] dark:opacity-0" style="bg: radial(#000...)"></div>
<div class="opacity-0 dark:opacity-[0.06]" style="bg: radial(#fff...)"></div>
\`\`\`

---

## 11. Internacionalización (i18n)

### Arquitectura

\`\`\`
core/i18n/
├── es.ts    # Exporta objeto tipado con todas las traducciones ES
└── en.ts    # Mismo shape, diferente idioma
\`\`\`

\`\`\`typescript
// es.ts
export interface Translations {
  nav: { ... };
  hero: { ... };
  contact: { title: string; subtitle: string; ... };
  footer: { headline1: string; ... };
}

export const es: Translations = {
  nav: { home: 'Inicio', ... },
  contact: { title: 'Hablemos', ... },
  // ...
};
\`\`\`

### Uso en Templates

\`\`\`html
{{ i18n.t().contact.title }} {{ i18n.t().footer.headline2 }}
\`\`\`

**Patrón:** \`t\` es un \`computed<Translations>\`. Cuando \`lang\` signal cambia → \`t\` se recalcula → todos los bindings se actualizan automáticamente (sin pipe, sin subscription).

---

## 12. SEO y Rendimiento

### SEO Implementado

\`\`\`html
<!-- index.html -->
<title>Emerson Quijada | MigatteDev - Full Stack Developer</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<link rel="canonical" href="https://migattedev.me/" />

<!-- Open Graph / Twitter Cards -->
<meta property="og:..." />
<meta name="twitter:..." />

<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
  // Person, WebSite, ItemList (projects)
</script>

<!-- Sitemap hint -->
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />

<!-- HTML lang attribute (dynamic via i18n) -->
<html lang="es"></html>
\`\`\`

### Performance

| Técnica                  | Implementación                                        |
| ------------------------ | ----------------------------------------------------- |
| **Lazy Loading**         | Todas las rutas usan \`loadComponent\`                  |
| **GSAP via CDN**         | No añade peso al bundle Angular                       |
| **IntersectionObserver** | Nativo, 0 KB bundle cost                              |
| **CSS Transitions**      | GPU-accelerated via \`transform\`, \`opacity\`            |
| **\`will-change\`**        | En cards con tilt para hint al browser                |
| **Tree-shaking**         | Standalone components + explicit imports              |
| **Font preconnect**      | \`<link rel="preconnect" href="fonts.googleapis.com">\` |
| **Image lazy**           | Project images en hover-only overlay                  |

---

## 13. Guía de Referencia Rápida

### Crear una Nueva Sección (Copiar-Pegar Template)

\`\`\`typescript
import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-mi-seccion',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <section
      id="mi-seccion"
      class="py-24 relative overflow-hidden
             bg-white dark:bg-stone-950 transition-colors duration-500"
    >
      <!-- Dot grid light/dark -->
      <div
        class="absolute inset-0 opacity-[0.04] dark:opacity-0 pointer-events-none"
        style="background-image: radial-gradient(#000 1px, transparent 1px);
                  background-size: 36px 36px;"
      ></div>
      <div
        class="absolute inset-0 opacity-0 dark:opacity-[0.04] pointer-events-none"
        style="background-image: radial-gradient(#fff 1px, transparent 1px);
                  background-size: 36px 36px;"
      ></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <!-- Header (copiar patrón estándar) -->
        <div class="mb-14 mi-reveal">
          <span
            class="text-emerald-600 dark:text-emerald-400 font-mono font-bold
                       text-xs tracking-widest uppercase mb-3 block"
          >
            // Label
          </span>
          <h2
            class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50
                     flex items-center gap-4 tracking-tight"
          >
            Título <span class="text-emerald-600 dark:text-emerald-400">Acento</span>
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-700"></span>
          </h2>
          <p class="text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed">
            Descripción.
          </p>
        </div>

        <!-- Content -->
        <div class="grid md:grid-cols-3 gap-6">
          @for (item of items; track item.id; let i = $index) {
            <div class="mi-card" [style.transition-delay.ms]="i * 100">...</div>
          }
        </div>
      </div>
    </section>
  \`,
  styles: [
    \`
      :host {
        display: block;
      }
      .mi-reveal {
        opacity: 0;
        transform: translateY(16px);
        transition:
          opacity 0.6s ease,
          transform 0.6s ease;
      }
      .mi-reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .mi-card {
        opacity: 0;
        transform: translateY(16px);
        transition:
          opacity 0.55s ease-out,
          transform 0.55s ease-out;
      }
      .mi-card.visible {
        opacity: 1;
        transform: translateY(0);
      }
    \`,
  ],
})
export class MiSeccionComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  items = [
    /* datos */
  ];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('visible');
          this.observer?.unobserve(e.target);
        }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );
    requestAnimationFrame(() => {
      document
        .querySelectorAll('#mi-seccion .mi-reveal, #mi-seccion .mi-card')
        .forEach((el) => this.observer?.observe(el));
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
\`\`\`\

### Comandos Útiles

\`\`\`\bash
ng serve                    # Dev server (http://localhost:4200)
ng build                    # Production build
ng build --configuration development  # Dev build (rápido, sin minify)
npx angular-cli-ghpages --dir=dist/portafolio-angular/browser  # Deploy
\`\`\`\

---

> **Nota Final:** Este documento cubre el estado del sistema a Febrero 2026. Cada patrón aquí documentado es reutilizable para futuros proyectos Angular con estética similar. El template de sección en la sección 13 es tu punto de partida para crear nuevas secciones manteniendo la consistencia del sistema de diseño.
`,
  },
];
