import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService } from './tasks-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'TaskFlow';
  tasks: any[] = [];
  
  // New task form fields
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPriority = 'medium';
  newTaskDueDate = '';

  // Filter & Search fields
  searchTerm = '';
  filterStatus = 'all'; // 'all', 'todo', 'in-progress', 'done'
  filterPriority = 'all'; // 'all', 'low', 'medium', 'high'

  // Modal / Detail views
  selectedTask: any = null;
  isEditMode = false;
  
  // Helper to compare dates
  today = new Date().toISOString().split('T')[0];

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasksService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Failed to load tasks:', err);
      }
    });
  }

  // Getters for status filtering and search
  get filteredTasks(): any[] {
    return this.tasks.filter(task => {
      const matchesSearch = !this.searchTerm || 
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesPriority = this.filterPriority === 'all' || task.priority === this.filterPriority;
      
      return matchesSearch && matchesPriority;
    });
  }

  get todoTasks(): any[] {
    return this.filteredTasks.filter(t => t.status === 'todo');
  }

  get inProgressTasks(): any[] {
    return this.filteredTasks.filter(t => t.status === 'in-progress');
  }

  get doneTasks(): any[] {
    return this.filteredTasks.filter(t => t.status === 'done');
  }

  get completedCount(): number {
    return this.tasks.filter(t => t.status === 'done').length;
  }

  get pendingCount(): number {
    return this.tasks.filter(t => t.status !== 'done').length;
  }

  // Create Task
  addTask(): void {
    if (!this.newTaskTitle.trim()) return;

    const taskPayload = {
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim() || null,
      priority: this.newTaskPriority,
      status: 'todo',
      dueDate: this.newTaskDueDate || null
    };

    this.tasksService.addTask(taskPayload).subscribe({
      next: (createdTask) => {
        this.tasks.push(createdTask);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding task:', err);
      }
    });
  }

  // Update Status
  updateStatus(task: any, newStatus: string): void {
    const updatedTask = { ...task, status: newStatus };
    this.tasksService.updateTask(task.id, updatedTask).subscribe({
      next: (res) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = res;
        }
        if (this.selectedTask && this.selectedTask.id === task.id) {
          this.selectedTask = res;
        }
      },
      error: (err) => {
        console.error('Error updating task status:', err);
      }
    });
  }

  // Delete Task
  deleteTask(task: any): void {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.tasksService.deleteTask(task.id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          if (this.selectedTask && this.selectedTask.id === task.id) {
            this.closeTaskDetail();
          }
        },
        error: (err) => {
          console.error('Error deleting task:', err);
        }
      });
    }
  }

  // Save changes from Edit Modal
  saveTaskEdit(): void {
    if (!this.selectedTask || !this.selectedTask.title.trim()) return;

    this.tasksService.updateTask(this.selectedTask.id, this.selectedTask).subscribe({
      next: (res) => {
        const index = this.tasks.findIndex(t => t.id === res.id);
        if (index !== -1) {
          this.tasks[index] = res;
        }
        this.isEditMode = false;
        this.selectedTask = null;
      },
      error: (err) => {
        console.error('Error saving task edits:', err);
      }
    });
  }

  // Modal open/close helpers
  openTaskDetail(task: any, edit = false): void {
    this.selectedTask = { ...task }; // deep clone to prevent instant updates until save
    this.isEditMode = edit;
  }

  closeTaskDetail(): void {
    this.selectedTask = null;
    this.isEditMode = false;
  }

  trackByTaskId(index: number, task: any): number {
    return task.id;
  }

  private resetForm(): void {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = 'medium';
    this.newTaskDueDate = '';
  }
}
