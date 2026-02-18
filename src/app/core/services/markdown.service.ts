import { Injectable } from '@angular/core';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  constructor() {
    // Configure marked for Obsidian-compatible output
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown (tables, strikethrough, etc.)
      breaks: false, // Single newlines don't become <br>
    });
  }

  parse(markdown: string): string {
    const result = marked.parse(markdown);
    // marked.parse can return string | Promise<string>
    // With default sync renderer it always returns string
    return result as string;
  }
}
