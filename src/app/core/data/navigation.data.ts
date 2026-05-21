import { IconName } from './icons.data';

export interface NavItem {
  name: string;
  href: string;
  type?: 'anchor' | 'route';
  icon?: IconName;
}

export const NAVIGATION: NavItem[] = [
  { name: 'Perfil', href: '#about', type: 'anchor', icon: 'person' },
  { name: 'Proceso', href: '#process', type: 'anchor', icon: 'account_tree' },
  { name: 'Stack', href: '#stack', type: 'anchor', icon: 'code2' },
  { name: 'Servicios', href: '#services', type: 'anchor', icon: 'design_services' },
  { name: 'Proyectos', href: '#projects', type: 'anchor', icon: 'rocket_launch' },
  { name: 'Testimonios', href: '#testimonials', type: 'anchor', icon: 'reviews' },
  { name: 'Contacto', href: '#contact-form', type: 'anchor', icon: 'mail' },
  { name: 'Blog', href: '/blog', type: 'route', icon: 'article' },
];
