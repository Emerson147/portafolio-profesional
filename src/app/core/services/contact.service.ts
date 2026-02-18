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
  // TODO: Replace with your actual Formspree endpoint (e.g., https://formspree.io/f/xyza...)
  private apiUrl = 'https://formspree.io/f/YOUR_FORM_ID_HERE';

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
