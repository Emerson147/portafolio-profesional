import{k as i}from"./chunk-HQIFB75C.js";var s=[{slug:"arquitectura-microservicios-spring-boot",title:"Arquitectura de Microservicios con Spring Boot",excerpt:"C\xF3mo dise\xF1ar, implementar y desplegar microservicios robustos con Spring Boot, Docker y un API Gateway. Lecciones aprendidas en producci\xF3n.",status:"evergreen",tags:["Java","Spring Boot","Microservicios","Docker"],date:"2025-01-15",readTime:12,coverEmoji:"\u2615",content:`
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
    `}];var r=class o{getAll(){return s.sort((e,a)=>new Date(a.date).getTime()-new Date(e.date).getTime())}getBySlug(e){return s.find(a=>a.slug===e)}getByTag(e){return s.filter(a=>a.tags.some(t=>t.toLowerCase()===e.toLowerCase()))}getAllTags(){let e=new Set;return s.forEach(a=>a.tags.forEach(t=>e.add(t))),Array.from(e).sort()}static \u0275fac=function(a){return new(a||o)};static \u0275prov=i({token:o,factory:o.\u0275fac,providedIn:"root"})};export{r as a};
