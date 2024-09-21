import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { TaskService } from '../../services/task.service';
import { Task } from '../interfaces/task.interface';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule],
  providers: [provideMomentDateAdapter()],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  taskForm: FormGroup;
  formType: string

  assignedToOptions = ['User 1', 'User 2', 'User 3'];
  statusOptions = ['Not Started', 'In Progress', 'Completed'];
  priorityOptions = ['Low', 'Normal', 'High'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { formType: string, values: Task }
  ) {
    this.formType = data.formType

    this.taskForm = this.fb.group({
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      comments: ['']
    });
    if (this.formType == 'Edit Task') {
      this.taskForm.patchValue(data.values)
    }
  }

  onSubmit(): void {
    console.log("in")
    if (this.taskForm.valid) {
      if (this.formType == "New Task") {
        console.log('New task created:', this.taskForm.value);
        this.taskService.createTask(this.taskForm.value).subscribe({
          next: (res) => {
            this.dialogRef.close(this.taskForm.value);
          }
        })
      }
      else {
        console.log("here", this.taskForm.value)
        this.taskService.updateTask(this.data.values.id, this.taskForm.value).subscribe({
          next: (res) => {
            this.dialogRef.close(this.taskForm.value);
          }
        })
      }
    }
    else {
      console.log("form not valid")
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
