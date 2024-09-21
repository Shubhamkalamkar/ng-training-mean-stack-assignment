import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { Task } from '../interfaces/task.interface';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent {
  displayedColumns: string[] = ['assignedTo', 'status', 'dueDate', 'priority', 'comments', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private taskService: TaskService, public dialog: MatDialog) { }

  ngOnInit() {
    this.fetchTasks();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchTasks() {
    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    }
    );
  }

  onSearch(event: Event): void {
    this.taskService.onSearch(event).subscribe({
      next: (res) => {
        this.dataSource.data = res;
      }
    })
  }

  onEdit(task: Task) {
    console.log('Editing task:', task);
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: { formType: 'Edit Task', values: task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New task edited:', result);
        this.fetchTasks()
      }
    });
  }

  onDelete(task: Task) {
    console.log('Deleting task:', task);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Do you want to delete this task?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(task.id).subscribe({
          next: (res) => {
            console.log("task deleted")
            this.fetchTasks()
          }
        })
      }
    });


  }

  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: { formType: 'New Task' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New task created:', result);
        this.fetchTasks()
      }
    });
  }
}
