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
];
