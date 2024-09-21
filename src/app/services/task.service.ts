import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../components/interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: Task[] = [{
    id: 1,
    assignedTo: "User 1",
    status: "Not Started",
    dueDate: new Date("2024-09-20"),
    priority: "Low",
    comments: "test"
  }];

  constructor() { }

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  createTask(newTask: Omit<Task, 'id'>): Observable<Task[]> {
    const newId = this.tasks.length ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1;
    const taskWithId: Task = { ...newTask, id: newId };
    this.tasks.push(taskWithId);
    return of(this.tasks);
  }

  deleteTask(id: number): Observable<Task[]> {
    this.tasks = this.tasks.filter(task => task.id !== id);
    return of(this.tasks);
  }

  updateTask(id: number, updatedTask: Task): Observable<Task[]> {
    console.log("updating task is", id)
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    console.log("task index is ", taskIndex)
    if (taskIndex > -1) {
      this.tasks[taskIndex] = { ...updatedTask, id };
    }
    console.log("all tasks", this.tasks)
    return of(this.tasks);
  }

  onSearch(event: Event): Observable<Task[]> {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    let filteredTasks = this.tasks.filter(task =>
      task.assignedTo.toLowerCase().includes(input) ||
      task.status.toLowerCase().includes(input) ||
      task.priority.toLowerCase().includes(input)
    );
    return of(filteredTasks)
  }
}
