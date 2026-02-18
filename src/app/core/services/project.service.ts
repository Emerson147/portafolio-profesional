import { Injectable } from '@angular/core';
import { PROJECTS, Project } from '../data/projects.data';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  getAll(): Project[] {
    return PROJECTS;
  }

  getBySlug(slug: string): Project | undefined {
    return PROJECTS.find((p) => p.slug === slug);
  }
}
