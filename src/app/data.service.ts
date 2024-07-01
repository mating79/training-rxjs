import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiURL = 'https://jsonplaceholder.typicode.com/posts'; // Example API

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(this.apiURL).pipe(
      retry(3), // Retry up to 3 times before failing
      catchError(this.handleError('getData', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
