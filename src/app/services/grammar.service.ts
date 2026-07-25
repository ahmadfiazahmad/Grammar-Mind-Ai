import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GrammarResponse {
  success: boolean;
  correctedText?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GrammarService {
  private http = inject(HttpClient);

  correctGrammar(text: string): Observable<GrammarResponse> {
    return this.http.post<GrammarResponse>('/api/correct', { text });
  }
}
