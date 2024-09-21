import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../services/task.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskServiceMock: any;
  let dialogRefMock: any;

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['createTask', 'updateTask']);
    taskServiceMock.createTask.and.returnValue(of({}));
    taskServiceMock.updateTask.and.returnValue(of({}));

    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, TaskFormComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { formType: 'New Task', values: {} } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values for "New Task"', () => {
    expect(component.taskForm.value).toEqual({
      assignedTo: '',
      status: '',
      dueDate: '',
      priority: '',
      comments: ''
    });
  });

  it('should not submit the form if invalid', () => {
    component.taskForm.setValue({
      assignedTo: '',
      status: '',
      dueDate: '',
      priority: '',
      comments: ''
    });

    component.onSubmit();

    expect(taskServiceMock.createTask).not.toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should close the dialog on cancel', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
