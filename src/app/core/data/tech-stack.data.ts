export interface TechGroup {
  area: string;
  techs: string[];
}

export const TECH_GROUPS: TechGroup[] = [
  {
    area: 'Backend Core',
    techs: ['Java 17/21', 'Spring Boot 3', 'PostgreSQL', 'Docker & Containers'],
  },
  {
    area: 'Frontend Moderno',
    techs: ['Angular 17+', 'PrimeNG UI', 'Tailwind CSS', 'Sakai NG Template'],
  },
  {
    area: 'Herramientas',
    techs: ['Git & GitHub', 'Maven/Gradle', 'VS Code / IntelliJ', 'Linux Environment'],
  },
  {
    area: 'Metodologías',
    techs: ['Scrum', 'Arquitectura Limpia', 'RESTful APIs', 'Zen Minimalism'],
  },
];

export const FEATURED_TECHS = ['Sakai NG', 'PrimeNG', 'PostgreSQL'];
