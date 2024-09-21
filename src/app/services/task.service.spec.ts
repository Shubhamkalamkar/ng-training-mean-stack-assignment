import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task } from '../components/interfaces/task.interface';
import { take } from 'rxjs/operators';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tasks', (done: DoneFn) => {
    service.getTasks().pipe(take(1)).subscribe((tasks: Task[]) => {
      expect(tasks.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should create a new task', (done: DoneFn) => {
    const newTask: Omit<Task, 'id'> = {
      assignedTo: 'User 2',
      status: 'In Progress',
      dueDate: new Date(),
      priority: 'High',
      comments: 'New task created',
    };

    service.createTask(newTask).pipe(take(1)).subscribe((tasks: Task[]) => {
      const addedTask = tasks.find(task => task.assignedTo === 'User 2');
      expect(addedTask).toBeTruthy();
      expect(addedTask?.status).toBe('In Progress');
      done();
    });
  });

  it('should delete a task by id', (done: DoneFn) => {
    const taskToDelete = service.getTasks().pipe(take(1)).subscribe(tasks => {
      const taskIdToDelete = tasks[0].id;

      service.deleteTask(taskIdToDelete).pipe(take(1)).subscribe((updatedTasks: Task[]) => {
        const task = updatedTasks.find(t => t.id === taskIdToDelete);
        expect(task).toBeUndefined();
        done();
      });
    });
  });

  it('should update an existing task', (done: DoneFn) => {
    const updatedTask: Task = {
      id: 1,
      assignedTo: 'Updated User',
      status: 'In Progress',
      dueDate: new Date(),
      priority: 'Medium',
      comments: 'Task updated',
    };

    service.updateTask(1, updatedTask).pipe(take(1)).subscribe((tasks: Task[]) => {
      const task = tasks.find(t => t.id === 1);
      expect(task).toBeTruthy();
      expect(task?.assignedTo).toBe('Updated User');
      expect(task?.status).toBe('In Progress');
      done();
    });
  });

  it('should filter tasks based on search input', (done: DoneFn) => {
    // Mock search event
    const mockEvent = {
      target: { value: 'user 1' }
    } as unknown as Event;

    service.onSearch(mockEvent).pipe(take(1)).subscribe((filteredTasks: Task[]) => {
      expect(filteredTasks.length).toBeGreaterThan(0);
      expect(filteredTasks.every(task => task.assignedTo.toLowerCase().includes('user 1'))).toBeTrue();
      done();
    });
  });
});
