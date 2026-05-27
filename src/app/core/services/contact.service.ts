import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = 'https://formspree.io/f/xzdwykgp';

  constructor() {}

  sendMessage(data: ContactForm): Observable<boolean> {
    return this.http.post(this.apiUrl, data).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error sending message:', error);
        return of(false);
      }),
    );
  }
}
