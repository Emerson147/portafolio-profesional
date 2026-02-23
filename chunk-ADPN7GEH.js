import{k as s}from"./chunk-ZUQ3FGSJ.js";var a=[{slug:"arquitectura-microservicios-spring-boot",title:"Arquitectura de Microservicios con Spring Boot",excerpt:"C\xF3mo dise\xF1ar, implementar y desplegar microservicios robustos con Spring Boot, Docker y un API Gateway. Lecciones aprendidas en producci\xF3n.",status:"evergreen",tags:["Java","Spring Boot","Microservicios","Docker"],date:"2025-01-15",readTime:12,coverEmoji:"\u2615",content:`
## \xBFPor qu\xE9 Microservicios?

Cuando un monolito crece m\xE1s all\xE1 de cierto punto, el costo de cada cambio se dispara. Los microservicios resuelven esto dividiendo la aplicaci\xF3n en servicios peque\xF1os, independientes y desplegables por separado.

> "Un microservicio debe hacer una sola cosa, y hacerla bien." \u2014 Principio de Responsabilidad \xDAnica aplicado a la arquitectura.

## La Estructura Base

Para un sistema de gesti\xF3n empresarial, divid\xED los servicios de la siguiente manera:

- **auth-service** \u2014 JWT, roles y permisos.
- **inventory-service** \u2014 Gesti\xF3n de productos y stock.
- **sales-service** \u2014 Procesamiento de ventas y POS.
- **report-service** \u2014 Generaci\xF3n de reportes as\xEDncronos.
- **api-gateway** \u2014 Spring Cloud Gateway como punto de entrada \xFAnico.

## Comunicaci\xF3n entre Servicios

Us\xE9 dos patrones de comunicaci\xF3n:

- **S\xEDncrona (REST/Feign):** Para operaciones que necesitan respuesta inmediata, como validar stock antes de una venta.
- **As\xEDncrona (RabbitMQ):** Para eventos como "venta completada" que disparan la actualizaci\xF3n de inventario y la generaci\xF3n de reportes.

## Dockerizaci\xF3n

Cada servicio tiene su propio \`Dockerfile\` y todos se orquestan con \`docker-compose.yml\`. El truco clave es usar **multi-stage builds** para reducir el tama\xF1o de la imagen final:

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

- El **service discovery** (Eureka) es esencial cuando tienes m\xE1s de 3 servicios.
- Los **circuit breakers** (Resilience4j) evitan cascadas de fallos.
- La **trazabilidad distribuida** (Zipkin) es imprescindible para debuggear.
- Empieza con un monolito modular y migra a microservicios cuando realmente lo necesites.
    `},{slug:"angular-signals-reactive-state",title:"Angular Signals: El Futuro del Estado Reactivo",excerpt:"Signals llegaron para cambiar c\xF3mo manejamos el estado en Angular. Menos boilerplate, mejor rendimiento y una DX superior a RxJS para casos simples.",status:"growing",tags:["Angular","TypeScript","Signals","Frontend"],date:"2025-02-01",readTime:8,coverEmoji:"\u26A1",content:`
## El Problema con el Estado en Angular

Antes de Signals, manejar estado en Angular significaba elegir entre \`BehaviorSubject\` de RxJS (poderoso pero verboso) o simplemente mutar propiedades del componente (simple pero sin reactividad granular).

## \xBFQu\xE9 son los Signals?

Un Signal es un wrapper reactivo alrededor de un valor. Cuando el valor cambia, Angular sabe exactamente qu\xE9 partes del DOM necesitan actualizarse \u2014 sin necesidad de Zone.js ni change detection completo.

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

Los dos compa\xF1eros inseparables de \`signal()\`:

- **computed()** \u2014 Deriva un valor de uno o m\xE1s signals. Se recalcula autom\xE1ticamente cuando sus dependencias cambian.
- **effect()** \u2014 Ejecuta c\xF3digo como efecto secundario cuando un signal cambia. Ideal para sincronizar con localStorage o APIs externas.

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

## \xBFCu\xE1ndo usar Signals vs RxJS?

- \u2705 **Signals:** Estado local del componente, UI state, formularios simples.
- \u2705 **RxJS:** Streams de eventos, HTTP con operadores complejos (debounce, switchMap), WebSockets.
- \u{1F504} **Ambos:** \`toSignal()\` y \`toObservable()\` permiten interoperabilidad.

## Mi Experiencia

Migr\xE9 este portafolio a Signals y la diferencia en legibilidad es notable. El c\xF3digo es m\xE1s declarativo y el bundle final es m\xE1s peque\xF1o porque Angular puede hacer tree-shaking m\xE1s agresivo sin Zone.js.
    `},{slug:"ci-cd-github-actions-docker",title:"CI/CD con GitHub Actions y Docker: De Cero a Producci\xF3n",excerpt:"Un pipeline completo de integraci\xF3n y despliegue continuo usando GitHub Actions, Docker Hub y un VPS. Automatiza tu flujo de trabajo como un profesional.",status:"seed",tags:["DevOps","Docker","GitHub Actions","CI/CD"],date:"2025-02-10",readTime:10,coverEmoji:"\u{1F680}",content:`
## El Objetivo

Cada vez que hago \`git push\` a \`main\`, quiero que autom\xE1ticamente se ejecuten los tests, se construya la imagen Docker, se publique en Docker Hub y se despliegue en el servidor. Sin intervenci\xF3n manual.

## Estructura del Pipeline

El workflow de GitHub Actions tiene 3 jobs:

1. **test** \u2014 Ejecuta los tests unitarios con Maven.
2. **build-and-push** \u2014 Construye la imagen Docker y la sube a Docker Hub.
3. **deploy** \u2014 Se conecta al VPS por SSH y hace \`docker pull\` + \`docker-compose up -d\`.

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

Nunca hardcodees credenciales. Usa **GitHub Secrets** (Settings \u2192 Secrets and variables \u2192 Actions) para almacenar: \`DOCKER_USERNAME\`, \`DOCKER_TOKEN\`, \`VPS_HOST\`, \`VPS_USER\`, \`VPS_SSH_KEY\`.

## Estado: \u{1F331} Semilla

Este art\xEDculo est\xE1 en desarrollo. Pr\xF3ximamente a\xF1adir\xE9: rollback autom\xE1tico en caso de fallo, notificaciones a Slack/Discord, y estrategias de despliegue blue-green.
    `},{slug:"documentacion-completa-del-sistema",title:"MigatteDev Portfolio \u2014 Documentaci\xF3n Completa del Sistema",excerpt:"Referencia t\xE9cnica completa: arquitectura Atomic Design, sistema de dise\xF1o Minimalismo Zen, componentes, servicios, animaciones, dark mode e i18n.",status:"evergreen",tags:["Angular","TypeScript","Arquitectura","Frontend"],date:"2025-02-23",readTime:25,coverEmoji:"\u{1F4DD}",content:`
    # \u{1F4D6} MigatteDev Portfolio \u2014 Documentaci\xF3n Completa del Sistema

> **Referencia t\xE9cnica y de dise\xF1o** para estudio y reutilizaci\xF3n en futuros proyectos.
> \xDAltima actualizaci\xF3n: Febrero 2026

---

## Tabla de Contenidos

1. [Visi\xF3n General](#1-visi\xF3n-general)
2. [Stack Tecnol\xF3gico](#2-stack-tecnol\xF3gico)
3. [Arquitectura del Proyecto](#3-arquitectura-del-proyecto)
4. [Sistema de Dise\xF1o \u2014 Minimalismo Zen](#4-sistema-de-dise\xF1o--minimalismo-zen)
5. [Componentes del Sistema](#5-componentes-del-sistema)
6. [Servicios Core](#6-servicios-core)
7. [Capa de Datos](#7-capa-de-datos)
8. [Patrones y T\xE9cnicas Modernas](#8-patrones-y-t\xE9cnicas-modernas)
9. [Animaciones y Scroll Reveal](#9-animaciones-y-scroll-reveal)
10. [Dark Mode](#10-dark-mode)
11. [Internacionalizaci\xF3n (i18n)](#11-internacionalizaci\xF3n-i18n)
12. [SEO y Rendimiento](#12-seo-y-rendimiento)
13. [Gu\xEDa de Referencia R\xE1pida](#13-gu\xEDa-de-referencia-r\xE1pida)

---

## 1. Visi\xF3n General

### \xBFQu\xE9 es?

Portfolio profesional de desarrollo Full Stack. Una SPA (Single Page Application) que sirve como carta de presentaci\xF3n profesional, mostrando proyectos, stack tecnol\xF3gico, metodolog\xEDa de trabajo y formulario de contacto.

### Filosof\xEDa

**"Minimalismo Zen"** \u2014 Cada elemento visual tiene un prop\xF3sito. Nada es decorativo por accidente. El dise\xF1o transmite:

- **Precisi\xF3n t\xE9cnica** (font-mono, code snippets)
- **Calma visual** (palette stone/emerald, espaciado generoso)
- **Interactividad sutil** (micro-animaciones, no distracciones)

---

## 2. Stack Tecnol\xF3gico

### Core

| Tecnolog\xEDa       | Versi\xF3n | Prop\xF3sito                                           |
| ---------------- | ------- | --------------------------------------------------- |
| **Angular**      | 21.0.0  | Framework frontend (standalone components, signals) |
| **TypeScript**   | 5.x     | Tipado est\xE1tico                                     |
| **Tailwind CSS** | 4.1.18  | Utility-first CSS framework                         |
| **GSAP**         | 3.14.2  | Animaciones complejas (hero, loading screen)        |

### Herramientas

| Herramienta                          | Prop\xF3sito                 |
| ------------------------------------ | ------------------------- |
| \`@angular/build\`                     | Build system (esbuild)    |
| \`angular-cli-ghpages\`                | Deploy a GitHub Pages     |
| Google Fonts (Inter, JetBrains Mono) | Tipograf\xEDa                |
| Material Symbols Outlined            | Iconograf\xEDa (servicios)   |
| Formspree                            | Backend-less contact form |

### \xBFPor qu\xE9 esta combinaci\xF3n?

\`\`\`
Angular 21 + Standalone Components
  \u2192 Sin NgModules \u2192 imports expl\xEDcitos \u2192 tree-shaking perfecto

Tailwind CSS 4 + PostCSS
  \u2192 Utility-first \u2192 sin CSS custom gigante
  \u2192 Dark mode via class strategy (html.dark)

GSAP via CDN (solo donde se necesita)
  \u2192 Hero timeline + Loading screen
  \u2192 No a\xF1ade peso al bundle principal
  \u2192 Las secciones individuales usan IntersectionObserver + CSS transitions

Signals (no RxJS para UI state)
  \u2192 M\xE1s simple, m\xE1s performante \u2192 signal(), computed()
  \u2192 RxJS solo para HTTP (ContactService)
\`\`\`

---

## 3. Arquitectura del Proyecto

### Estructura de Directorios

\`\`\`
src/app/
\u251C\u2500\u2500 app.ts                    # Root component
\u251C\u2500\u2500 app.config.ts             # Providers (router, httpClient)
\u251C\u2500\u2500 app.routes.ts             # Lazy routes
\u251C\u2500\u2500 app.css                   # Global styles + utilities
\u2502
\u251C\u2500\u2500 core/                     # Singleton services + datos
\u2502   \u251C\u2500\u2500 services/             # 7 services (providedIn: 'root')
\u2502   \u2502   \u251C\u2500\u2500 gsap.service.ts
\u2502   \u2502   \u251C\u2500\u2500 theme.service.ts
\u2502   \u2502   \u251C\u2500\u2500 translate.service.ts
\u2502   \u2502   \u251C\u2500\u2500 contact.service.ts
\u2502   \u2502   \u251C\u2500\u2500 blog.service.ts
\u2502   \u2502   \u251C\u2500\u2500 markdown.service.ts
\u2502   \u2502   \u2514\u2500\u2500 project.service.ts
\u2502   \u251C\u2500\u2500 data/                 # Datos est\xE1ticos tipados
\u2502   \u2502   \u251C\u2500\u2500 icons.data.ts
\u2502   \u2502   \u251C\u2500\u2500 tech-icons.data.ts
\u2502   \u2502   \u251C\u2500\u2500 projects.data.ts
\u2502   \u2502   \u251C\u2500\u2500 navigation.data.ts
\u2502   \u2502   \u251C\u2500\u2500 blog.data.ts
\u2502   \u2502   \u2514\u2500\u2500 tech-stack.data.ts
\u2502   \u2514\u2500\u2500 i18n/                 # Traducciones
\u2502       \u251C\u2500\u2500 es.ts
\u2502       \u2514\u2500\u2500 en.ts
\u2502
\u251C\u2500\u2500 layouts/                  # Layout wrappers
\u2502   \u2514\u2500\u2500 main-layout/
\u2502
\u251C\u2500\u2500 pages/                    # Route-level components
\u2502   \u251C\u2500\u2500 home/                 # \u2192 HomePageComponent
\u2502   \u2514\u2500\u2500 blog/                 # \u2192 BlogListPage, BlogDetailPage
\u2502
\u2514\u2500\u2500 shared/                   # Reutilizables (Atomic Design)
    \u251C\u2500\u2500 atoms/                # badge, button, icon, logo
    \u251C\u2500\u2500 molecules/            # boot-log-entry, code-snippet, nav-link, tech-card
    \u2514\u2500\u2500 organisms/            # 12 secciones de la homepage
        \u251C\u2500\u2500 navbar/
        \u251C\u2500\u2500 loading-screen/
        \u251C\u2500\u2500 hero-section/
        \u251C\u2500\u2500 about-section/
        \u251C\u2500\u2500 process-section/
        \u251C\u2500\u2500 stack-section/
        \u251C\u2500\u2500 services-section/
        \u251C\u2500\u2500 projects-section/
        \u251C\u2500\u2500 project-detail-modal/
        \u251C\u2500\u2500 testimonials-section/
        \u251C\u2500\u2500 contact-section/
        \u2514\u2500\u2500 footer/
\`\`\`

### Patr\xF3n: Atomic Design

\`\`\`
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  Atoms     \u2192 badge, button, icon, logo                       \u2502
\u2502              Unidades m\xEDnimas. No tienen l\xF3gica de negocio.  \u2502
\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
\u2502  Molecules \u2192 code-snippet, nav-link, tech-card               \u2502
\u2502              Combinan atoms. Pueden tener estado m\xEDnimo.     \u2502
\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
\u2502  Organisms \u2192 hero-section, stack-section, projects-section   \u2502
\u2502              Secciones completas con l\xF3gica, datos y layout. \u2502
\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
\u2502  Pages     \u2192 HomePageComponent, BlogListPageComponent        \u2502
\u2502              Componen organisms + layout para una ruta.      \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
\`\`\`

### Routing \u2014 Lazy Loading

\`\`\`typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page.component').then((m) => m.HomePageComponent), // \u2190 lazy loaded
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

**Patr\xF3n clave:** \`loadComponent\` (no \`loadChildren\`). Cada ruta carga un solo standalone component. Resultado: el bundle inicial solo contiene el router y el root component.

---

## 4. Sistema de Dise\xF1o \u2014 Minimalismo Zen

### Paleta de Colores

\`\`\`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551  SUPERFICIES                             \u2551
\u2551  Light: bg-white, bg-stone-50/100        \u2551
\u2551  Dark:  bg-stone-900, bg-stone-950       \u2551
\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563
\u2551  TEXTO                                   \u2551
\u2551  Primary:   text-stone-900 / dark:50     \u2551
\u2551  Secondary: text-stone-600 / dark:400    \u2551
\u2551  Muted:     text-stone-400 / dark:500    \u2551
\u2551  Mono:      text-stone-500 (font-mono)   \u2551
\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563
\u2551  ACENTOS                                 \u2551
\u2551  Primary:   emerald-600 / dark:400       \u2551
\u2551  Gradient:  emerald \u2192 teal \u2192 cyan        \u2551
\u2551  Per-category accents:                   \u2551
\u2551    Backend  \u2192 #f97316 (orange)           \u2551
\u2551    Frontend \u2192 #dd0031 (angular red)      \u2551
\u2551    Cloud    \u2192 #38bdf8 (sky blue)         \u2551
\u2551    Methods  \u2192 #a78bfa (purple)           \u2551
\u2551    Rust     \u2192 #14b8a6 (teal)             \u2551
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
\`\`\`

### Tipograf\xEDa

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

### Espaciado \u2014 Ritmo Vertical

Cada secci\xF3n sigue el mismo esquema:

\`\`\`
py-24 md:py-32              \u2190 padding vertical
max-w-7xl mx-auto px-6      \u2190 contenedor centrado
mb-14                        \u2190 gap header \u2192 content
gap-5 / gap-6                \u2190 grid gaps
\`\`\`

### Secci\xF3n Header Pattern (consistente en todo el site)

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
    T\xEDtulo <span class="text-emerald-600 dark:text-emerald-400">Acento</span>
    <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-700"></span>
  </h2>
  <!-- Subtitle -->
  <p class="text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed">
    Descripci\xF3n breve.
  </p>
</div>
\`\`\`

### Background Patterns

1. **Dot Grid (Light):** \`radial-gradient(#000 1px, transparent 1px)\` con \`opacity: [0.03-0.06]\`
2. **Dot Grid (Dark):** \`radial-gradient(#fff 1px, transparent 1px)\` con \`dark:opacity\` swap
3. **Blueprint Grid:** \`linear-gradient\` en ambos ejes (usado en contact y projects)
4. **Ambient Glow:** Divs \`blur-3xl\` con \`emerald/4\` o \`emerald/5\` posicionados absolute

### Micro-interacciones Est\xE1ndar

| Interacci\xF3n              | Implementaci\xF3n                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Hover card \u2192 border glow | \`hover:border-color-mix(accent 30%)\` via CSS custom property \`--accent\`                    |
| Hover card \u2192 shadow      | \`hover:shadow-xl hover:shadow-accent/8\`                                                    |
| Hover card \u2192 lift        | \`hover:-translate-y-1\`                                                                     |
| Hover text \u2192 accent      | \`group-hover:text-emerald-600 dark:group-hover:text-emerald-400\`                           |
| 3D tilt (mouse)          | \`perspective(800-900px) rotateX(\xB18\xB0) rotateY(\xB18\xB0)\` \u2014 disabled on touch (\`pointer: coarse\`) |
| Button press             | \`active:scale-95\`                                                                          |

---

## 5. Componentes del Sistema

### Homepage Flow (orden de renderizado)

\`\`\`
HomePageComponent
\u251C\u2500\u2500 LoadingScreenComponent     # Deploy pipeline animation (GSAP)
\u251C\u2500\u2500 MainLayoutComponent        # Wrapper con .main-container
\u2502   \u251C\u2500\u2500 NavbarComponent        # Fixed top, scroll-aware, theme/lang toggle
\u2502   \u251C\u2500\u2500 HeroSectionComponent   # Parallax blobs, GSAP text reveal, CTA
\u2502   \u251C\u2500\u2500 AboutSectionComponent  # Stats counters, tech pills, SVG icons
\u2502   \u251C\u2500\u2500 ProcessSectionComponent# Zigzag timeline, 4 steps, scroll reveal
\u2502   \u251C\u2500\u2500 StackSectionComponent  # 2x2 grid, progress bars, tilt cards
\u2502   \u251C\u2500\u2500 ServicesSectionComponent # 3x2 grid, Material Symbols icons
\u2502   \u251C\u2500\u2500 ProjectsSectionComponent # Filter pills, blueprint hover, modal
\u2502   \u2502   \u2514\u2500\u2500 ProjectDetailModalComponent
\u2502   \u251C\u2500\u2500 TestimonialsSectionComponent # 3-col, 3D tilt, quote marks
\u2502   \u251C\u2500\u2500 ContactSectionComponent     # 2-col (info sidebar + form)
\u2502   \u2514\u2500\u2500 FooterComponent             # Headline CTA + social links
\`\`\`

### Detalle por Componente

#### \u{1F680} LoadingScreenComponent

- **Qu\xE9 hace:** Simula un pipeline CI/CD (Build \u2192 Lint \u2192 Test \u2192 Bundle \u2192 Deploy)
- **Tech:** GSAP timeline, progress bar, commit metadata
- **Pattern:** \`(loadingComplete)\` output event notifica a HomePage para revelar contenido
- **Duraci\xF3n:** ~4 segundos

#### \u{1F3E0} HeroSectionComponent

- **Qu\xE9 hace:** Secci\xF3n principal con nombre, t\xEDtulo, CTAs y code snippet
- **Tech:** GSAP (animateHero), parallax via \`(mousemove)\`, CodeSnippetComponent
- **Features:** Animated gradient headline, tech stack pills, scroll indicator

#### \u{1F464} AboutSectionComponent

- **Qu\xE9 hace:** Bio, stats animados (2+ a\xF1os, 15+ proyectos), tech pills con SVG icons
- **Tech:** IntersectionObserver, counter animation con \`setInterval\`
- **Features:** Category-specific accent colors, DomSanitizer para SVGs

#### \u{1F504} ProcessSectionComponent

- **Qu\xE9 hace:** 4 pasos de metodolog\xEDa en zigzag con timeline central
- **Layout:** Desktop: \`grid-cols-[1fr_56px_1fr]\` zigzag. Mobile: vertical left-border
- **Tech:** IntersectionObserver, timeline height animation, stagger delays
- **Features:** Numbered dots en timeline, SVG icons por step, hover glow per-category

#### \u{1F6E0} StackSectionComponent

- **Qu\xE9 hace:** 4 categor\xEDas de tech en grid 2x2 con progress bars
- **Tech:** IntersectionObserver, animated progress bars, counter animation
- **Features:** 3D tilt (\xB16\xB0), per-category accent via \`--accent\` CSS custom property, dot level indicators, featured tags con micro SVG icons

#### \u{1F4BC} ServicesSectionComponent

- **Qu\xE9 hace:** 6 servicios en grid 3x2
- **Tech:** Material Symbols Outlined (Google Fonts), IntersectionObserver stagger
- **Features:** Per-service accent colors, feature pills que cambian color en hover, \`--card-accent\` para hover border/shadow

#### \u{1F4C2} ProjectsSectionComponent

- **Qu\xE9 hace:** Filtro por tecnolog\xEDa, cards con blueprint hover effect, modal de detalle
- **Tech:** Signals (\`activeFilter\`, \`computed\` \u2192 \`filteredProjects\`, \`uniqueTechs\`), IntersectionObserver
- **Features:** Status badges, tech icons en tags, impact metrics (hover reveal), image overlay (hover)

#### \u{1F4AC} TestimonialsSectionComponent

- **Qu\xE9 hace:** 3 testimonios en grid
- **Tech:** IntersectionObserver stagger, 3D tilt (\xB18\xB0), touch device guard
- **Features:** Quote mark decorativa, avatar con iniciales, hover accent line (bottom border animation)

#### \u{1F4E7} ContactSectionComponent

- **Qu\xE9 hace:** 2 columnas: info sidebar (email, GitHub, LinkedIn, availability) + formulario
- **Tech:** Reactive Forms, ContactService (Formspree), IntersectionObserver
- **Features:** Floating labels (peer-placeholder-shown), submit states (idle/loading/success/error), i18n

#### \u{1F9B6} FooterComponent

- **Qu\xE9 hace:** Headline CTA + download CV + social links + bottom bar
- **Tech:** IntersectionObserver stagger, i18n
- **Features:** Mailto CTA primario, download PDF secundario, version badge

---

## 6. Servicios Core

### ThemeService \u2014 Dark Mode

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

**Patr\xF3n:** Signal + \`<html class="dark">\` + \`localStorage\` persistencia.

### TranslateService \u2014 i18n

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

**Patr\xF3n:** \`computed()\` que reactivamente cambia el objeto de traducciones. Templates usan \`{{ i18n.t().section.key }}\`.

### GsapService \u2014 Animaciones Globales

\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class GsapService {
  // Carga GSAP + ScrollTrigger + ScrollToPlugin via CDN
  loadGsap(): Promise<void> { ... }

  // animaciones:
  revealMainContainer()    // fade in .main-container
  animateHero()            // timeline: .hero-reveal stagger
  setupScrollTriggers()    // .gs-reveal \u2192 scroll-triggered fade in
  scrollTo(target)         // smooth scroll to section
}
\`\`\`

**Patr\xF3n:** CDN loading (no bundle), usado SOLO en:

- \`LoadingScreenComponent\` (pipeline timeline)
- \`HeroSectionComponent\` (text reveal)
- \`NavbarComponent\` (smooth scroll)
- \`HomePageComponent\` (coordinator)

Todas las **secciones de contenido** usan \`IntersectionObserver\` + CSS transitions en su lugar.

### ContactService \u2014 Formulario

\`\`\`typescript
// Formspree integration via HttpClient
sendMessage(data: ContactForm): Observable<boolean>
\`\`\`

---

## 7. Capa de Datos

### Datos Est\xE1ticos Tipados

Toda la data del portfolio vive en \`core/data/\` como objetos TypeScript tipados. **No hay base de datos ni API** (excepto Formspree para contacto).

| Archivo              | Contenido                                                | Tipo exportado                                      |
| -------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| \`icons.data.ts\`      | SVG strings para UI icons + project visuals + tech icons | \`ICONS\`, \`PROJECT_VISUALS\`, \`TECH_ICONS\`            |
| \`tech-icons.data.ts\` | SVGs branded (Java, Spring Boot, etc.)                   | \`TECH_ICONS\` (duplicado, usado por tech-stack.data) |
| \`projects.data.ts\`   | Proyectos con slug, tags, metrics, gallery               | \`Project[]\`                                         |
| \`navigation.data.ts\` | Links de navegaci\xF3n                                      | \`NavigationItem[]\`                                  |
| \`blog.data.ts\`       | Art\xEDculos de blog                                        | \`BlogPost[]\`                                        |
| \`tech-stack.data.ts\` | Stack overview data                                      | \`TechStackItem[]\`                                   |

**Patr\xF3n clave:** Type-safe SVG icons:

\`\`\`typescript
export const TECH_ICONS = {
  'Spring Boot': \`<svg ...>...</svg>\`,
  Angular: \`<svg ...>...</svg>\`,
  // ...
} as const;

export type TechIconName = keyof typeof TECH_ICONS;
// \u2192 'Spring Boot' | 'Angular' | 'Docker' | ...
\`\`\`

Uso en componentes:

\`\`\`typescript
getSafeTechIcon(iconName: keyof typeof TECH_ICONS): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(TECH_ICONS[iconName] || '');
}
\`\`\`

---

## 8. Patrones y T\xE9cnicas Modernas

### 8.1 Standalone Components (Angular 21)

\`\`\`typescript
@Component({
  selector: 'app-stack-section',
  standalone: true, // \u2190 sin NgModule
  imports: [CommonModule], // \u2190 imports expl\xEDcitos
  template: \`...\`,
  styles: [\`...\`], // \u2190 inline styles
})
export class StackSectionComponent {}
\`\`\`

**Ventajas:**

- Tree-shaking perfecto (solo se incluye lo importado)
- No hay SharedModule monol\xEDtico
- Cada componente declara sus dependencias

### 8.2 Signals para Estado Reactivo

\`\`\`typescript
// Signal simple (estado local)
isDark = signal<boolean>(false);
activeFilter = signal<string>('all');
submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

// Computed (derivado, se actualiza autom\xE1ticamente)
filteredProjects = computed(() => {
  const filter = this.activeFilter();
  return filter === 'all' ? this.projects : this.projects.filter((p) => p.tags.includes(filter));
});

// Signal update (m\xE9todo funcional)
this.animatedStats.update((s) => {
  const updated = [...s];
  updated[index] = { ...updated[index], currentValue: Math.floor(current) };
  return updated;
});
\`\`\`

**Cu\xE1ndo usar Signals vs RxJS:**

- \`signal()\` \u2192 estado de UI, toggles, filtros, counters
- \`RxJS Observable\` \u2192 HTTP requests, streams de datos

### 8.3 Control Flow Moderno (@for, @if)

\`\`\`html
<!-- Antes (NgFor) -->
<div *ngFor="let item of items">{{ item.name }}</div>

<!-- Despu\xE9s (@for con track) -->
@for (item of items; track item.name; let i = $index) {
<div>{{ item.name }}</div>
}

<!-- @if con @else -->
@if (submitStatus() === 'success') {
<div>\xA1Enviado!</div>
} @else {
<form>...</form>
}
\`\`\`

**Ventajas:** Mejor performance, track expression obligatorio (evita re-renders), no necesita importar directivas.

### 8.4 inject() Pattern

\`\`\`typescript
// Antes (constructor injection)
constructor(private sanitizer: DomSanitizer, private platformId: Object) { }

// Despu\xE9s (inject function)
private sanitizer  = inject(DomSanitizer);
private platformId = inject(PLATFORM_ID);
\`\`\`

**Ventaja:** M\xE1s limpio, composable (se puede usar en funciones fuera de la clase), elimina la necesidad de \`@Inject()\`.

### 8.5 CSS Custom Properties para Temas Din\xE1micos

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

**Patr\xF3n:** Cada card recibe su accent color via \`[style.--accent]\`. Los pseudoestados CSS leen la variable. Resultado: un solo CSS rule para N colores diferentes.

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

**\xBFPor qu\xE9 no \`<img>\` o font icons?**

- SVG inline se colorea con \`currentColor\` \u2192 se adapta al tema
- No requiere peticiones HTTP extra
- Se puede estilizar con CSS del parent (color, size, opacity)

---

## 9. Animaciones y Scroll Reveal

### Dos Sistemas Complementarios

\`\`\`
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  GSAP (CDN)                             \u2502
\u2502  Usado para:                             \u2502
\u2502  \u2022 Loading screen pipeline              \u2502
\u2502  \u2022 Hero text reveal timeline            \u2502
\u2502  \u2022 Smooth scroll navigation             \u2502
\u2502  \u2022 Floating card animation              \u2502
\u2502  Raz\xF3n: Secuencias complejas, timelines \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  IntersectionObserver + CSS Transitions \u2502
\u2502  Usado para:                             \u2502
\u2502  \u2022 Todas las secciones de contenido     \u2502
\u2502  \u2022 Card stagger reveals                 \u2502
\u2502  \u2022 Progress bar animations              \u2502
\u2502  \u2022 Counter animations                   \u2502
\u2502  Raz\xF3n: Ligero, nativo, consistente     \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
\`\`\`

### Patr\xF3n IntersectionObserver (template reutilizable)

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
| Header reveal   | 0.6s      | \u2014                 | ease                      |
| Card reveal     | 0.5-0.55s | 70-130ms per card | ease-out                  |
| Progress bar    | 0.9s      | 60ms per bar      | cubic-bezier(0.4,0,0.2,1) |
| Timeline line   | 1.6s      | \u2014                 | cubic-bezier(0.4,0,0.2,1) |
| 3D tilt apply   | 0.08-0.1s | \u2014                 | linear                    |
| 3D tilt release | 0.4-0.45s | \u2014                 | ease                      |

---

## 10. Dark Mode

### Implementaci\xF3n

\`\`\`
1. ThemeService \u2192 signal \`isDark\` + toggle
2. <html class="dark"> se toglea via DOM
3. Tailwind \`dark:\` variant en cada elemento
4. Persistencia en localStorage (\`'zen-theme'\`)
5. Fallback a \`prefers-color-scheme: dark\`
\`\`\`

### Checklist Dark Mode por Componente

Cada componente debe tener:

\`\`\`html
<!-- Superficies -->
bg-white \u2192 dark:bg-stone-900 (o 950 para mayor contraste) bg-stone-50 \u2192 dark:bg-stone-800
border-stone-100 \u2192 dark:border-stone-700

<!-- Texto -->
text-stone-900 \u2192 dark:text-stone-50 text-stone-600 \u2192 dark:text-stone-400 text-stone-500 \u2192
dark:text-stone-400/500

<!-- Acentos -->
text-emerald-600 \u2192 dark:text-emerald-400 bg-emerald-50 \u2192 dark:bg-emerald-900/20-30

<!-- Backgrounds patterns (DOBLE dot grid) -->
<div class="opacity-[0.04] dark:opacity-0" style="bg: radial(#000...)"></div>
<div class="opacity-0 dark:opacity-[0.06]" style="bg: radial(#fff...)"></div>
\`\`\`

---

## 11. Internacionalizaci\xF3n (i18n)

### Arquitectura

\`\`\`
core/i18n/
\u251C\u2500\u2500 es.ts    # Exporta objeto tipado con todas las traducciones ES
\u2514\u2500\u2500 en.ts    # Mismo shape, diferente idioma
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

**Patr\xF3n:** \`t\` es un \`computed<Translations>\`. Cuando \`lang\` signal cambia \u2192 \`t\` se recalcula \u2192 todos los bindings se actualizan autom\xE1ticamente (sin pipe, sin subscription).

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
<\/script>

<!-- Sitemap hint -->
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />

<!-- HTML lang attribute (dynamic via i18n) -->
<html lang="es"></html>
\`\`\`

### Performance

| T\xE9cnica                  | Implementaci\xF3n                                        |
| ------------------------ | ----------------------------------------------------- |
| **Lazy Loading**         | Todas las rutas usan \`loadComponent\`                  |
| **GSAP via CDN**         | No a\xF1ade peso al bundle Angular                       |
| **IntersectionObserver** | Nativo, 0 KB bundle cost                              |
| **CSS Transitions**      | GPU-accelerated via \`transform\`, \`opacity\`            |
| **\`will-change\`**        | En cards con tilt para hint al browser                |
| **Tree-shaking**         | Standalone components + explicit imports              |
| **Font preconnect**      | \`<link rel="preconnect" href="fonts.googleapis.com">\` |
| **Image lazy**           | Project images en hover-only overlay                  |

---

## 13. Gu\xEDa de Referencia R\xE1pida

### Crear una Nueva Secci\xF3n (Copiar-Pegar Template)

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
        <!-- Header (copiar patr\xF3n est\xE1ndar) -->
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
            T\xEDtulo <span class="text-emerald-600 dark:text-emerald-400">Acento</span>
            <span class="hidden md:block flex-1 h-px bg-stone-200 dark:bg-stone-700"></span>
          </h2>
          <p class="text-stone-600 dark:text-stone-400 max-w-2xl mt-4 leading-relaxed">
            Descripci\xF3n.
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
\`\`\`
### Comandos \xDAtiles

\`\`\`\bash
ng serve                    # Dev server (http://localhost:4200)
ng build                    # Production build
ng build --configuration development  # Dev build (r\xE1pido, sin minify)
npx angular-cli-ghpages --dir=dist/portafolio-angular/browser  # Deploy
\`\`\`
---

> **Nota Final:** Este documento cubre el estado del sistema a Febrero 2026. Cada patr\xF3n aqu\xED documentado es reutilizable para futuros proyectos Angular con est\xE9tica similar. El template de secci\xF3n en la secci\xF3n 13 es tu punto de partida para crear nuevas secciones manteniendo la consistencia del sistema de dise\xF1o.
`}];var i=class o{getAll(){return a.sort((e,t)=>new Date(t.date).getTime()-new Date(e.date).getTime())}getBySlug(e){return a.find(t=>t.slug===e)}getByTag(e){return a.filter(t=>t.tags.some(n=>n.toLowerCase()===e.toLowerCase()))}getAllTags(){let e=new Set;return a.forEach(t=>t.tags.forEach(n=>e.add(n))),Array.from(e).sort()}static \u0275fac=function(t){return new(t||o)};static \u0275prov=s({token:o,factory:o.\u0275fac,providedIn:"root"})};export{i as a};
