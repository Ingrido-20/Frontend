import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    constructor(private http: HttpClient) {}
    private apiUrl = 'https://api.example.com/tasks';
    
    getTasks(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
    addTask(task: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, task);
    }
    updateTask(taskId: string, task: any): Observable<any> {
        const url = `${this.apiUrl}/${taskId}`;
        return this.http.put<any>(url, task);
    }
    deleteTask(taskId: string): Observable<any> {
        const url = `${this.apiUrl}/${taskId}`;
        return this.http.delete<any>(url);
    }
}
