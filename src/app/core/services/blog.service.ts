import { Injectable } from '@angular/core';
import { BlogPost, BLOG_POSTS } from '../data/blog.data';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  getAll(): BlogPost[] {
    return BLOG_POSTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find((p) => p.slug === slug);
  }

  getByTag(tag: string): BlogPost[] {
    return BLOG_POSTS.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  }

  getAllTags(): string[] {
    const tags = new Set<string>();
    BLOG_POSTS.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }
}
