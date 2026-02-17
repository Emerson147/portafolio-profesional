import { ProjectVisualType } from './icons.data';

export interface Project {
  title: string;
  type: ProjectVisualType;
  desc: string;
  tags: string[];
}

export const PROJECTS: Project[] = [
  {
    title: 'Sistema de Gestión Académica',
    type: 'PLATFORM',
    desc: 'Plataforma integral para gestión de notas y matrículas. Backend robusto en Spring Boot con seguridad JWT y Frontend en Angular con PrimeNG.',
    tags: ['Spring Boot', 'Angular', 'PrimeNG', 'PostgreSQL'],
  },
  {
    title: 'E-Commerce Microservicios',
    type: 'MICROSERVICES',
    desc: 'Arquitectura basada en Docker con servicios independientes para catálogo, carrito y pagos. Comunicación asíncrona con RabbitMQ.',
    tags: ['Java', 'Docker', 'Microservices', 'RabbitMQ'],
  },
  {
    title: 'Dashboard Administrativo Zen',
    type: 'DASHBOARD',
    desc: 'Panel de control minimalista utilizando Sakai NG y Tailwind para visualización de datos en tiempo real.',
    tags: ['Sakai NG', 'Chart.js', 'Tailwind', 'Responsive'],
  },
];
