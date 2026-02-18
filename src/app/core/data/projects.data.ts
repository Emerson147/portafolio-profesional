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
