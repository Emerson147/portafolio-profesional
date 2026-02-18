export interface NavItem {
  name: string;
  href: string;
  type?: 'anchor' | 'route'; // anchor = same-page scroll, route = router navigation
}

export const NAVIGATION: NavItem[] = [
  { name: 'Perfil', href: '#about', type: 'anchor' },
  { name: 'Proceso', href: '#process', type: 'anchor' },
  { name: 'Stack', href: '#stack', type: 'anchor' },
  { name: 'Servicios', href: '#services', type: 'anchor' },
  { name: 'Proyectos', href: '#projects', type: 'anchor' },
  { name: 'Testimonios', href: '#testimonials', type: 'anchor' },
  { name: 'Contacto', href: '#contact-form', type: 'anchor' },
  { name: 'Blog', href: '/blog', type: 'route' },
];
