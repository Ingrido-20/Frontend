import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    private apiUrl = 'http://localhost:8080/api/tasks';

    constructor(private http: HttpClient) {}
    
    getTasks(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
    addTask(task: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, task);
    }
    updateTask(taskId: number | string, task: any): Observable<any> {
        const url = `${this.apiUrl}/${taskId}`;
        return this.http.put<any>(url, task);
    }
    deleteTask(taskId: number | string): Observable<any> {
        const url = `${this.apiUrl}/${taskId}`;
        return this.http.delete<any>(url);
    }
}

