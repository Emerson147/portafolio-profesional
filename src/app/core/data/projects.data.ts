import { ProjectVisualType } from './icons.data';

export interface ProjectMetrics {
  users?: string;
  uptime?: string;
  performance?: string;
}

export interface Project {
  slug: string;
  title: string;
  type: ProjectVisualType;
  desc: string;
  tags: string[];
  github?: string;
  demo?: string;
  role: string;
  date: string;
  duration?: string;
  status: 'Completado' | 'En Progreso' | 'Mantenimiento';
  metrics?: ProjectMetrics;
  image?: string;
  // Detail page fields
  challenge?: string;
  solution?: string;
  learnings?: string[];
  gallery?: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: 'importaciones-denraf',
    title: 'Importaciones DENRAF',
    type: 'PLATFORM',
    desc: 'Sistema de gestión empresarial para PYMEs de venta e importación. POS intuitivo, control de inventario, gestión de clientes, reportes exportables y métricas en tiempo real. Offline-first con IndexedDB y sincronización a Supabase/PostgreSQL.',
    tags: ['Angular', 'Supabase', 'PostgreSQL', 'IndexedDB'],
    github: 'https://github.com/Emerson147/importaciones-denraf',
    role: 'Full Stack Developer',
    date: '2025',
    duration: '6 meses',
    status: 'Completado',
    metrics: { users: '50+', uptime: '99.8%', performance: '<150ms' },
    challenge:
      'El mayor reto fue diseñar una experiencia fluida que funcionara sin conexión, garantizando que ningún dato de venta se perdiera y que la sincronización con la nube al reconectar fuera transparente, confiable y sin conflictos.',
    solution:
      'Implementé una arquitectura Offline-First usando IndexedDB como fuente de verdad local y Service Workers para interceptar peticiones. Al restaurar la conexión, un proceso de sincronización reconcilia los datos locales con Supabase/PostgreSQL resolviendo conflictos con estrategia "last-write-wins" por entidad.',
    learnings: [
      'Arquitectura Offline-First con IndexedDB y Service Workers.',
      'Sincronización de datos con Supabase (Realtime + REST).',
      'Estado reactivo declarativo con Angular Signals (signal, computed, effect).',
      'Facade Pattern para separar lógica de negocio de la vista en el módulo POS.',
      'Lazy Loading y CustomPreloadingStrategy por prioridad de ruta.',
    ],
  },
  {
    slug: 'gestion-inventario-ely',
    title: 'Sistema de Gestión de Inventario y Ventas La Peruanita',
    type: 'PLATFORM',
    desc: 'Plataforma de gestión de inventario con Spring Boot y Angular. Funcionalidades clave incluyen seguimiento de existencias, gestión de proveedores y generación de reportes personalizados.',
    tags: ['Spring Boot', 'Angular', 'MySQL', 'JWT'],
    github: 'https://github.com/Emerson147/gestion-inventario-ely',
    role: 'Full Stack Developer',
    date: '2025',
    duration: '5 meses',
    status: 'Completado',
    metrics: { users: '3+', uptime: '99.8%', performance: '<150ms' },
    challenge:
      'El principal desafío fue integrar múltiples sistemas externos de seguimiento de inventario y proveedores, cada uno con APIs y formatos de datos diferentes, sin afectar la experiencia del usuario.',
    solution:
      'Diseñé una capa de integración modular utilizando el patrón Adapter para normalizar los datos de los diferentes proveedores. Esto permitió agregar nuevos proveedores en el futuro sin cambios significativos en la lógica del negocio.',
    learnings: [
      'Diseño de arquitecturas modulares con Spring Boot.',
      'Gestión de estado en Angular con Signals.',
      'Optimización de consultas SQL para grandes volúmenes de datos.',
      'Implementación de autenticación y autorización con JWT.',
    ],
  },
  {
    slug: 'sistema-gestion-academica',
    title: 'Sistema de Gestión Académica',
    type: 'PLATFORM',
    desc: 'Plataforma integral para gestión de notas y matrículas. Backend robusto en Spring Boot con seguridad JWT y Frontend en Angular con PrimeNG.',
    tags: ['Spring Boot', 'Angular', 'PrimeNG', 'PostgreSQL'],
    github: 'https://github.com/Emerson147/gestion-academica',
    role: 'Full Stack Developer',
    date: '2024',
    duration: '4 meses',
    status: 'Completado',
    metrics: { users: '500+', uptime: '99.9%', performance: '<150ms' },
    challenge:
      'El principal reto fue diseñar un sistema de permisos granular que permitiera a docentes, administradores y estudiantes acceder a la misma plataforma con vistas y acciones completamente distintas, sin comprometer la seguridad de los datos.',
    solution:
      'Implementé una arquitectura de seguridad basada en roles (RBAC) con Spring Security y JWT. En el frontend, Angular Guards protegen las rutas y directivas personalizadas controlan la visibilidad de los elementos de la UI según el rol del usuario autenticado.',
    learnings: [
      'Diseño de sistemas RBAC escalables con Spring Security.',
      'Gestión de estado complejo en Angular con Signals.',
      'Optimización de queries N+1 en JPA/Hibernate.',
      'Implementación de CI/CD con GitHub Actions.',
    ],
  },
  {
    slug: 'ecommerce-microservicios',
    title: 'E-Commerce Microservicios',
    type: 'MICROSERVICES',
    desc: 'Arquitectura basada en Docker con servicios independientes para catálogo, carrito y pagos. Comunicación asíncrona con RabbitMQ.',
    tags: ['Java', 'Docker', 'Microservices', 'RabbitMQ'],
    github: 'https://github.com/Emerson147/ecommerce-micro',
    role: 'Backend Developer',
    date: '2023',
    duration: '3 meses',
    status: 'En Progreso',
    metrics: { users: '1000+', performance: '<200ms' },
    challenge:
      'Mantener la consistencia de datos entre servicios independientes (catálogo, inventario, pagos) sin acoplarlos directamente, evitando el problema de las transacciones distribuidas.',
    solution:
      'Adopté el patrón Saga con coreografía usando RabbitMQ para la comunicación asíncrona entre servicios. Cada servicio publica eventos de dominio y reacciona a los eventos de otros, garantizando la consistencia eventual sin un coordinador central.',
    learnings: [
      'Patrón Saga para transacciones distribuidas.',
      'Orquestación de contenedores con Docker Compose.',
      'Diseño de APIs RESTful con OpenAPI/Swagger.',
      'Comunicación asíncrona con RabbitMQ.',
    ],
  },
  {
    slug: 'dashboard-administrativo-zen',
    title: 'Dashboard Administrativo Zen',
    type: 'DASHBOARD',
    desc: 'Panel de control minimalista utilizando Sakai NG y Tailwind para visualización de datos en tiempo real.',
    tags: ['Sakai NG', 'Chart.js', 'Tailwind', 'Responsive'],
    demo: 'https://dashboard-zen.vercel.app',
    role: 'Frontend Developer',
    date: '2024',
    duration: '2 meses',
    status: 'Mantenimiento',
    metrics: { uptime: '100%', performance: '<100ms' },
    challenge:
      'El cliente necesitaba un dashboard que se sintiera rápido y fluido incluso con grandes volúmenes de datos (miles de registros), sin sacrificar la estética minimalista.',
    solution:
      'Implementé virtualización de listas para las tablas de datos, carga diferida (lazy loading) de los módulos del dashboard y memoización de los cálculos de métricas. El resultado fue un dashboard que carga en menos de 100ms incluso con 10,000 registros.',
    learnings: [
      'Virtualización de listas para alto rendimiento.',
      'Optimización de rendimiento en Angular con OnPush y Signals.',
      'Diseño de sistemas de diseño (Design Systems) con Tailwind.',
      'Integración de Chart.js con datos en tiempo real.',
    ],
  },
];
