# 🧠 Skill: Angular Zen Portfolio System

> **Contexto:** Guía técnica y visual para el mantenimiento y escalabilidad del Portafolio Angular.
> **Stack:** Angular 18+ (Standalone), Tailwind CSS v4, GSAP, TypeScript Strict.

## 1. Reglas de Arquitectura & Código (The "Zen" Code)

### 🧱 Core Principles

- **Strictly Standalone:** Prohibido usar `NgModules`. Todo componente debe ser `standalone: true`.
- **Atomic Design:** Mantener la estructura de carpetas:
  - `atoms/`: Botones, inputs, iconos (sin lógica de negocio).
  - `molecules/`: Cards, search bars (combinación de átomos).
  - `organisms/`: Secciones completas (Hero, About, Navbar).
  - `pages/`: Vistas completas que orquestan organismos.
- **Dependency Injection:** Usar siempre `private svc = inject(ServiceType)` en lugar de constructores.

### ⚡ Reactividad & Performance

- **Signals First:** Usar `signal()`, `computed()`, y `effect()` para el estado local y derivado. Evitar RxJS para estado síncrono simple.

  ```typescript
  // ✅ DO
  count = signal(0);
  double = computed(() => this.count() * 2);

  // ❌ DON'T
  count$ = new BehaviorSubject(0);
  ```

- **Control Flow:** Usar siempre la nueva sintaxis `@if`, `@src`, `@switch` en lugar de `*ngIf`, `*ngFor`.
- **Lazy Loading:** Imágenes pesadas y GSAP deben cargarse de manera diferida (como ya se hace en `GsapService`).

### 🛡️ TypeScript Strictness

- **No `any`:** Evitar `any` a toda costa. Definir interfaces para modelos de datos (ej: `Project`, `Skill`).
- **Strong Typing:** Tipar retornos de funciones y props de componentes.

---

## 2. Sistema de Diseño (UI/UX Guidelines)

### 🎨 Paleta "Zen Natural"

Usar la calidez de `stone` y la vitalidad de `emerald`/`teal`. Evitar grays fríos (`slate`, `gray`) a menos que sea para contrastes específicos de modo oscuro profundo.

| Token          | Tailwind Class             | Hex Aprox | Uso                                  |
| -------------- | -------------------------- | --------- | ------------------------------------ |
| **Base**       | `bg-white` / `bg-stone-50` | `#FAFAF9` | Fondos generales                     |
| **Surface**    | `bg-white` + `shadow-sm`   | `#FFFFFF` | Cards, Dropdowns                     |
| **Primary**    | `text-emerald-600`         | `#059669` | Acentos, CTA, Iconos                 |
| **Secondary**  | `text-teal-600`            | `#0D9488` | Subtítulos, tags secundarios         |
| **Text Main**  | `text-stone-900`           | `#1C1917` | Títulos, párrafos importantes        |
| **Text Muted** | `text-stone-500`           | `#78716C` | Metadatos, descripciones secundarias |

### 🔡 Tipografía

- **Headings & Body:** `Inter` (Google Fonts). Limpia, legible, moderna.
- **Accents / Technical:** `JetBrains Mono`. Usar para:
  - Etiquetas de código (ej: `// SOBRE MÍ`).
  - Nombres de tecnologías.
  - Snippets de código.

### 📐 Espaciado y Ritmo

- **Layout:** Seguir múltiplos de 4 (Tailwind standard).
- **Secciones:** `py-24` (96px) o `py-32` (128px) para dar aire ("breathability") entre secciones.
- **Glassmorphism:** Usar con moderación. `bg-white/80 backdrop-blur-md` para navbars o cards flotantes.

## 3. Comandos Comunes

- **Dev:** `npm start` (o `ng serve`)
- **Build:** `npm run build`
